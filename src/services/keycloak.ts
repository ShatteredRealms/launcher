import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url:
    process.env.NODE_ENV === 'production'
      ? 'https://sso.shatteredrealmsonline.com'
      : 'http://localhost:8080',
  realm: 'default',
  clientId: 'sro-gameclient',
});

export default keycloak;
