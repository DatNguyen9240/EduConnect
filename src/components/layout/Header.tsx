import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { settingsMenu } from "@/routes/RouterConfig";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center justify-between max-w-screen-xl w-full mx-auto px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/logo/logo.png"
            alt="Edu Connect Logo"
            className="h-8 mr-2"
          />{" "}
          {/* Assuming logo path */}
          <span className="text-blue-600 text-xl font-baloo font-bold">
            Edu Connect
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex items-center border rounded-full px-4 py-2 flex-grow mx-4 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="outline-none flex-grow"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* User Info and Settings */}
        <div className="flex items-center">
          {/* User Info */}
          <div className="flex items-center mr-4">
            <img
              src="/assets/avatar/default.jpg"
              alt="User Avatar"
              className="h-8 w-8 rounded-full mr-2"
            />{" "}
            {/* Assuming avatar path */}
            <span className="text-gray-700">Đạt</span>
          </div>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 cursor-pointer transition-transform duration-300 hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={settingsMenu.profile.path}>
                  {settingsMenu.profile.label}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={settingsMenu.signOut.path}>
                  {settingsMenu.signOut.label}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
