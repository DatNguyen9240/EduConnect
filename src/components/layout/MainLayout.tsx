import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from '../ui/sidebar';
import { useState } from 'react';

export default function MainLayout() {
  const [sidebarHover, setSidebarHover] = useState(false);
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar onHoverChange={setSidebarHover} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarHover ? 'ml-64' : 'ml-20'}`}
      >
        <Header />
        <main className="flex-grow bg-gradient-main ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
