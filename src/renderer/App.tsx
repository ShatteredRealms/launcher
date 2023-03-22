import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DefaultTemplate from './templates/default';
import Home from './pages/Home';
import Keycloak from 'keycloak-js';

export var keycloak = new Keycloak({
  url: process.env.NODE_ENV === 'production' ?
    'https://sso.shatteredrealmsonline.com' :
    'http://localhost:8080',
  realm: 'default',
  clientId: 'sro-gameclient'
});

// Keycloak initConfig
keycloak.init({
  checkLoginIframe: false,
  redirectUri: 'http://localhost:1212/keycloak-redirect',
}).then(
  (authenticated) => {
    if (!authenticated) {
      keycloak.login().then(
        (resp: any) => {
          console.log('resp:', resp);
        },
        (error: any) => {
          console.log('login failed:', error);
        }
      ).catch((error: any) => {
        console.log('login error:', error);
      });
    }
  },
  (error) => {
    console.log('init failed:', error);
  },
).catch((error) => {
  console.log('init error:', error);
});

export default function App() {
  return (
    <DefaultTemplate>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </DefaultTemplate>
  );
}
