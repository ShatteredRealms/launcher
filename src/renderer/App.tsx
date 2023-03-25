import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DefaultTemplate from './templates/default';
import Home from './pages/Home';
import { Rings } from 'react-loader-spinner';
import { keycloak } from 'services/keycloak';
import { useEffect, useState } from 'react';



export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeKeycloak()
  }, [])

  const initializeKeycloak = () => {
    keycloak
      .init({
        checkLoginIframe: false,
        redirectUri: 'http://localhost:1212/keycloak-redirect',
      })
      .then(
        (authenticated) => {
          // eslint-disable-next-line promise/always-return
          if (authenticated) {
            setLoading(false);
            return;
          }

          keycloak
            .login()
            .then(
              // eslint-disable-next-line promise/always-return
              (resp: any) => {
                console.log('resp:', resp);
                setLoading(false);
              },
              (error: any) => {
                console.log('login failed:', error);
              }
            )
            .catch((error: any) => {
              console.log('login error:', error);
            });
        },
        (error) => {
          console.log('init failed:', error);
        }
      )
      .catch((error) => {
        console.log('init error:', error);
      });
  }

  if (loading) {
    return <Rings
      height="200"
      width="200"
      radius="6"
      color='#93c5fe'
      wrapperStyle={{}}
      wrapperClass="w-full h-full bg-gray-900 place-content-center"
      visible={true}
      ariaLabel="rings-loading"
    />
  }

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
