import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { init } from 'services/keycloak';
import DefaultTemplate from './templates/default';
import Home from './pages/Home';

init();

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
