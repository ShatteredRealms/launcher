import './Home.css';
import { Fragment, useState } from 'react';
import { RiAccountCircleFill } from 'react-icons/ri';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  const [progress, setProgress] = useState(0.0);
  const [dlSpeed, setDlSpeed] = useState(0.0);
  const [downloading, setDownloading] = useState(false);

  const navigate = useNavigate();

  const onSignOut = () => {
    navigate('/');
  };

  const onInstall = () => {
    setDownloading(true);
    setProgress(0.0);
    setDlSpeed(0.0);
  };

  const onCancelDownload = () => {
    setDownloading(false);
  };

  return (
    <div className="main-bg w-full h-screen text-center">
      <div className="logo absolute top-[100px] left-[450px] w-[570px] h-[150px]" />
      <Menu
        as="div"
        className="absolute top-5 left-5 rounded-full w-[30px] h-[30px]"
      >
        <div>
          <Menu.Button>
            <RiAccountCircleFill className="w-full h-full text-gray-200 text-3xl hover:text-blue-300" />
            {/* <div className="relative rounded-full bottom-3 left-0 w-[10px] h-[10px] bg-green-300 shadow shadow-black" /> */}
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right bg-gray-800 rounded-md shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="https://shatteredrealmsonline.com/"
                    rel="noreferrer"
                    target="_blank"
                    className={classNames(
                      active ? 'bg-gray-900 text-gray-100' : 'text-gray-400',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <button
                    type="button"
                    className={classNames(
                      active ? 'bg-gray-900 text-gray-100' : 'text-gray-400',
                      'block w-full px-4 py-2 text-sm'
                    )}
                    onClick={onSignOut}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <div className="absolute left-0 bottom-0 w-full h-[200px]">
        <div className="w-11/12 h-full inline-flex items-center justify-center m-0">
          <div className="flex w-full h-[100px] items-center">
            <div
              className="w-3/4 h-[10px] bg-blue-500/30 shadow-xl shadow-blue-300 rounded-l"
              style={{ opacity: downloading ? '100%' : '0' }}
            >
              <div
                className="h-full bg-blue-500 rounded-l"
                style={{ width: progress }}
              />
            </div>
            <div className="flex w-1/4 h-full bg-gray-800">
              {downloading ? (
                <div className="flex w-full h-full items-center">
                  <div className="w-10/12 text-4xl text-center text-gray-300">
                    {progress}%
                    <p className="text-xs text-gray-500">
                      Downloading - {dlSpeed} MB/s
                    </p>
                  </div>
                  <button
                    className="w-2/12 h-full text-center bg-red-900 hover:bg-red-800"
                    onClick={onCancelDownload}
                    type="button"
                  >
                    X
                  </button>
                </div>
              ) : (
                <button
                  onClick={onInstall}
                  type="button"
                  className="w-full text-5xl text-blue-300 hover:bg-gray-900"
                >
                  Install
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
