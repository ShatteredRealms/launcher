import { Navigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Rings } from 'react-loader-spinner';

function LoginPage() {
  const { keycloak } = useKeycloak();

  if (keycloak?.authenticated) return <Navigate to="/home" />;

  keycloak?.login();

  return (
    <Rings
      height="200"
      width="200"
      radius="6"
      color="#93c5fe"
      wrapperStyle={{}}
      wrapperClass="w-full h-full bg-gray-900 place-content-center"
      visible
      ariaLabel="rings-loading"
    />
  );
}

export default LoginPage;
