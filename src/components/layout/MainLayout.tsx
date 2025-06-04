import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './Navbar';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
