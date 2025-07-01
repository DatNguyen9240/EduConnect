import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { routeMenuConfig } from '@/routes/RouterConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';

export default function Sidebar({ onHoverChange }: { onHoverChange?: (hovered: boolean) => void }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = routeMenuConfig.filter((item) => item.showInMenu);

  return (
    <div
      className={cn(
        'group/sidebar min-h-screen flex flex-col bg-white border-r border-gray-200',
        'w-20 hover:w-64 transition-all duration-300 ease-in-out',
        'fixed top-0 left-0 h-screen z-30'
      )}
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
    >
      {/* Logo Section */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-200">
        <img src="/assets/logo/school/logo.jpg" alt="logo" className="h-12 w-12 rounded-xl" />
        <div className="overflow-hidden transition-all duration-300">
          <div className="min-w-[120px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
            <h2 className="font-bold text-lg text-gray-800">Trường THPT Nguyễn Văn Cừ</h2>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-blue-600 flex-shrink-0" />
          <div className="overflow-hidden transition-all duration-300">
            <div className="min-w-[120px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              <p className="font-medium text-gray-800">Nguyễn Thành Công</p>
              <p className="text-xs text-gray-500">lớp 11A1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 flex flex-col p-4 space-y-6">
        <div>
          <div className="overflow-hidden transition-all duration-300">
            <div className="min-w-[120px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              <p className="text-xs font-semibold text-gray-500 px-4 py-2 uppercase tracking-wider">
                Main Menu
              </p>
            </div>
          </div>
          <div className="space-y-1 mt-2">
            {menuItems.map((item, index) =>
              item.icon ? (
                <MenuItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  badge={item.badge}
                  active={currentPath === item.path}
                />
              ) : null
            )}
          </div>
        </div>

        {/* <div>
          <div className="overflow-hidden transition-all duration-300">
            <div className="min-w-[120px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              <p className="text-xs font-semibold text-gray-500 px-4 py-2 uppercase tracking-wider">
                Others
              </p>
            </div>
          </div>
          <div className="space-y-1 mt-2">
            {menuItems
              .slice(5)
              .map((item, index) =>
                item.icon ? (
                  <MenuItem
                    key={index + 5}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    badge={item.badge}
                    active={currentPath === item.path}
                  />
                ) : null
              )}
          </div>
        </div> */}
      </div>
    </div>
  );
}

type MenuItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: string | null;
  path: string;
};

function MenuItem({ icon: Icon, label, active, badge, path }: MenuItemProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className={cn(
        'flex items-center py-2 px-3 rounded-lg mb-1 cursor-pointer transition-all duration-200',
        'group-hover/sidebar:justify-start',
        'justify-center',
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            'h-5 w-5 flex-shrink-0 transition-colors duration-200',
            active ? 'text-white' : 'text-gray-500'
          )}
        />
      )}
      <div className="overflow-hidden transition-all duration-300">
        <div className="min-w-[80px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
          <span className="font-medium ml-2 text-sm">{label}</span>
        </div>
      </div>
      {badge && (
        <div className="overflow-hidden transition-all duration-300">
          <div className="min-w-[32px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
            <span
              className={cn(
                'ml-1 text-xs px-1 py-0.5 rounded-full font-medium',
                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              )}
            >
              {badge}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
