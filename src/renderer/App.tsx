import {
  MemoryRouter as Router,
  Routes,
  Route, Navigate
} from "react-router-dom";
import './App.css';
import { Rings } from 'react-loader-spinner';
import { useKeycloak } from '@react-keycloak/web';
import Home from './pages/Home';
import DefaultTemplate from './templates/default';
import Login from './pages/Login';
import ProtectedRoute from "./pages/utils";

export default function App() {
  const { initialized } = useKeycloak();

  if (!initialized) {
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

  return (
    <DefaultTemplate>
      <Router>
        <Routes>
          <Route path="/home" element={<ProtectedRoute outlet={<Home />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </DefaultTemplate>
  );
}
