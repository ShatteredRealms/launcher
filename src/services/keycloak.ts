import Keycloak from 'keycloak-js';

var keycloak = new Keycloak({
  url: process.env.NODE_ENV === 'production' ?
    'https://sso.shatteredrealmsonline.com' :
    'http://localhost:8080',
  realm: 'default',
  clientId: 'sro-gameclient'
});

// Keycloak initConfig
keycloak.init({
  checkLoginIframe: false,
  redirectUri: 'http://localhost/keycloak-redirect'
});
const { session: { webRequest } } = mainWindow!.webContents;
const filter = {
  urls: [
    'http://localhost/keycloak-redirect*'
  ]
};
webRequest.onBeforeRequest(filter, async ({ url }) => {
  const params = url.slice(url.indexOf('#'));
  mainWindow!.loadURL('file://' + path.join(__dirname, 'index.html') + params);
});

keycloak.login();
