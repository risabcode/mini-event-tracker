import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

export default function App() {
  return (
    <>
      {/* Navigation Bar */}
      <Nav />

      {/* Main Content */}
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}
