import { Navigate } from 'react-router-dom';
import keycloak from '../../services/keycloak';

export type ProtectedRouteProps = {
  outlet: JSX.Element;
};

export default function ProtectedRoute({ outlet }: ProtectedRouteProps) {
  if (keycloak.authenticated) {
    return outlet;
  }

  return <Navigate to={{ pathname: '/login' }} />;
}
