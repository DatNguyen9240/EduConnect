import { NavLink } from 'react-router-dom';
import { navbarItems } from '@/constants/routes';

export default function NavBar() {
  return (
    <nav className="bg-blue-600 text-white h-20">
      <ul className="flex justify-between items-stretch h-full max-w-screen-xl w-full mx-auto px-6">
        {navbarItems.map((item, index) => (
          <li key={index} className="h-full flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col justify-center items-center h-full px-4 transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'hover:bg-blue-700 text-white/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded border transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white/20 text-white border-white/50'
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>

                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-sm">{item.text}</span>
                    {item.hasDropdown && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
