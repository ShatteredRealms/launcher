import Keycloak from 'keycloak-js';

let initialized = false;

export const keycloak = new Keycloak({
  url:
    process.env.NODE_ENV === 'production'
      ? 'https://sso.shatteredrealmsonline.com'
      : 'http://localhost:8080',
  realm: 'default',
  clientId: 'sro-gameclient',
});

export const init = () => {
  if (initialized) return;
  initialized = true;
  keycloak
    .init({
      checkLoginIframe: false,
      redirectUri: 'http://localhost:1212/keycloak-redirect',
    })
    .then(
      (authenticated) => {
        // eslint-disable-next-line promise/always-return
        if (authenticated) {
          return;
        }
        keycloak
          .login()
          .then(
            // eslint-disable-next-line promise/always-return
            (resp: any) => {
              console.log('resp:', resp);
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
};
