/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { File, Progress } from 'electron-dl';
import { resolveHtmlPath } from './util';
import DownloadItem = Electron.DownloadItem;
import fs from 'fs';
import AdmZip from 'adm-zip';
import { download } from 'electron-dl';
import { execFile } from 'child_process';

const WindowsClientURL =
  'https://downloads.shatteredrealmsonline.com/client/WindowsClient.zip';
const LatestVersionUrl =
  'https://downloads.shatteredrealmsonline.com/client/ClientVersion.txt';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

let currentDownload: DownloadItem | null = null;
let lastTime = 0;
let lastSize = 0;

const baseDirectory =
  process.env.NODE_ENV === 'production'
    ? `${path.dirname(app.getPath('exe'))}`
    : `${app.getAppPath()}`;

const gameDirectory = `${baseDirectory}/game`;
const clientVersionFilePath = `${gameDirectory}/version.txt`;
let latestVersionFile: File | null;

ipcMain.on('minimize-window', async () => {
  mainWindow?.minimize();
});

ipcMain.on('game-status', async (event) => {
  fs.access(`${gameDirectory}`, () => {
    if (mainWindow === null) return;

    download(mainWindow, LatestVersionUrl, {
      directory: gameDirectory,

      onCompleted: (file: File) => {
        latestVersionFile = file;
        // Game installed, check current version
        fs.readFile(
          clientVersionFilePath,
          'utf-8',
          (readFileErr: any, currentVersion: string) => {
            if (readFileErr) {
              // File doesn't exist so redownload.
              event.reply('game-status', false);
              return;
            }

            console.log('currentVersion:', currentVersion);

            // Game is installed and has a version. Check the version.
            fs.readFile(
              latestVersionFile!.path,
              'utf-8',
              (readFileErr: any, latestVersion: string) => {
                if (readFileErr) {
                  console.log('fatal error:', readFileErr);
                  return;
                }

                event.reply('game-status', currentVersion === latestVersion);
                if (currentVersion === latestVersion) {
                  fs.unlink(file.path, () => { });
                }
              },
            );
          }
        );
      },
    });
  });
});

ipcMain.on('launch-client', async (_, [token, refreshToken]) => {
  const executable = `${gameDirectory}/WindowsClient/SROClient.exe`;
  try {
    fs.chmodSync(executable, '755');
  } catch (err) {
    console.log('err:', err);
  }

  try {
    const exec = execFile(executable, ["--sro-token", token, "--sro-refresh-token", refreshToken]);
    exec.on('spawn', () => {
      app.quit()
    })
  } catch (err) {
    console.log('err:', err);
  }

});

ipcMain.on('download', async (event) => {
  if (mainWindow === null)
    return;

  download(mainWindow, WindowsClientURL, {

    directory: gameDirectory,

    onStarted: (item: DownloadItem) => {
      currentDownload = item;
    },

    onProgress: (progress: Progress) => {
      const bytes = progress.transferredBytes - lastSize;
      lastSize = progress.transferredBytes;

      const ms = new Date().getTime() - lastTime;
      lastTime = new Date().getTime();

      let speed = bytes / ms;
      let units = 'KB/s';

      if (speed > 1000) {
        speed /= 1000;
        units = 'MB/s';
      }

      if (Number.isNaN(speed)) {
        speed = 0;
      }

      event.reply('download-progress', { ...progress, speed, units });
    },

    onCompleted: (file: File) => {
      event.reply('download', 'download completed');
      const zip = new AdmZip(file.path);
      zip.extractAllToAsync(gameDirectory, true, true, () => {
        event.reply('installed', 'installation complete');
      });
      fs.unlink(file.path, () => { });
      if (latestVersionFile) {
        fs.rename(latestVersionFile.path, clientVersionFilePath, (err: any) => {
          if (err) {
            console.log('error', err);
          }
        });
      }
    },

    onCancel: (item: DownloadItem) => {
      console.log('canceled: ', JSON.stringify(item));
    },
  });
});

ipcMain.on('download-cancel', async () => {
  if (currentDownload) {
    currentDownload.cancel();
    if (fs.existsSync(currentDownload.getSavePath())) {
      fs.unlink(currentDownload.getSavePath(), () => { });
    }
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      // devTools: !(app.isPackaged || process.env?.NODE_ENV === 'test'),
      nodeIntegration: true,
      webSecurity: false,
    },
    fullscreenable: false,
    resizable: false,
    frame: false,
  });

  if (isDebug) {
    await installExtensions();
  }

  mainWindow.setTitle('Shattered Realms Online Launcher');

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-fail-load', () => {
    // console.log('load failed');
    // mainWindow!.loadURL(resolveHtmlPath('index.html'));
  })

  const filter = {
    urls: [
      'http://localhost/keycloak-redirect*'
    ]
  };
  mainWindow.webContents.session.webRequest.onBeforeRequest(filter, async (details, callback) => {
    let params = details.url.slice(details.url.indexOf('#'));
    if (params.length <= 1) {
      params = "";
    }
    console.log('params', params);
    // setTimeout(() => {
      mainWindow!.loadURL(resolveHtmlPath('index.html') + params);
    // }, 1000)
    callback({cancel: false});
  });

  // Hack to fix keycloak-redirect being canceled.
  mainWindow.webContents.session.webRequest.onErrorOccurred((details) => {
    if (details.url.match("http://localhost/keycloak-redirect*") && details.error === "net::ERR_ABORTED") {
      setTimeout(() => {
        let params = details.url.slice(details.url.indexOf('#'));
        if (params.length <= 1) {
          params = "";
        }
        mainWindow!.loadURL(resolveHtmlPath('index.html') + params);
      }, 100)
    }


  });

  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('browser-window-focus', function() {
  globalShortcut.register("CommandOrControl+R", () => {
    // console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("CommandOrControl+Shift+R", () => {
    // console.log("CommandOrControl+Shift+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
    // console.log("F5 is pressed: Shortcut Disabled");
  });
  globalShortcut.register("CommandOrControl+Q", () => {
    // console.log("CommandOrControl+Q is pressed: Shortcut Disabled");
  });
  globalShortcut.register("CommandOrControl+W", () => {
    // console.log("CommandOrControl+W is pressed: Shortcut Disabled");
  });
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
