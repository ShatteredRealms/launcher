import './Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="main-bg w-full h-screen text-center">
      <div className="mt-80">
        <Link to="/" className="pt-8">
          Logout
        </Link>
      </div>
    </div>
  );
}
