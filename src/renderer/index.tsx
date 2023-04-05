import { ReactKeycloakProvider } from '@react-keycloak/web';
import { createRoot } from 'react-dom/client';
import App from './App';
import keycloak from '../services/keycloak';

const eventLogger = (event: unknown, error: unknown) => {
  // console.log('onKeycloakEvent', event, error);
};

const tokenLogger = (tokens: unknown) => {
  // console.log('onKeycloakTokens', tokens);
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    onEvent={eventLogger}
    onTokens={tokenLogger}
    initOptions={{
      checkLoginIframe: false,
      onLoad: 'login-required',
      redirectUri: 'http://localhost/keycloak-redirect',
    }}
  >
    <App />
  </ReactKeycloakProvider>
);
