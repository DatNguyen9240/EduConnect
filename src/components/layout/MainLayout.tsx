import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from '../ui/sidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-grow p-6 bg-gradient-to-b from-blue-100 to-blue-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
