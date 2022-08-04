import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Login from './Login';

const Hello = () => {
  function closeApp() {
    window.close();
  }

  function minimizeApp() {
    console.log('minimize');
    window.electron.ipcRenderer.minimizeWindow();
  }
  return (
    <div>
      <header>
        {/* eslint-disable-next-line react/button-has-type */}
        <button onClick={minimizeApp} id="minimize">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="2"
            viewBox="0 0 11 2"
          >
            <rect
              id="Rectangle_2"
              data-name="Rectangle 2"
              width="11"
              height="2"
              fill="#e2f7ff"
            />
          </svg>
        </button>
        {/* eslint-disable-next-line react/button-has-type */}
        <button onClick={closeApp} id="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9.742"
            height="9.983"
            viewBox="0 0 9.742 9.983"
          >
            <path
              id="Icon_ionic-md-close"
              data-name="Icon ionic-md-close"
              d="M17.265,8.522l-.974-1-3.9,3.993L8.5,7.523l-.974,1,3.9,3.993-3.9,3.993.974,1,3.9-3.993,3.9,3.993.974-1-3.9-3.993Z"
              transform="translate(-7.523 -7.523)"
              fill="#e2f7ff"
            />
          </svg>
        </button>
      </header>
      <Login />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
