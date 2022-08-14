import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';

const Hello = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <h1 className="text-blue-500">Hello Tailwind</h1>
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
