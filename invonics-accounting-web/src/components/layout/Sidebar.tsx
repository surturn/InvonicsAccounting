import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PlusCircle, 
  BarChart2, 
  Calendar,
  LogOut
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const { user } = useAuth();

  const links = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Transactions', path: ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
    { label: 'Add Entry', path: ROUTES.ADD_TRANSACTION, icon: PlusCircle },
    { label: 'Reports', path: ROUTES.REPORTS, icon: BarChart2 },
    { label: 'Periods', path: ROUTES.PERIODS, icon: Calendar },
  ];

  return (
    <div className="w-[240px] h-full flex flex-col bg-bg-surface border-r border-bg-border">
      <div className="px-6 py-6 border-b border-bg-border">
        <h1 className="text-2xl font-bold text-accent tracking-tight">Invonics</h1>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mt-1">Accounting</p>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onCloseMobile}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-accent-subtle text-accent' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }
            `}
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-bg-border flex flex-col gap-3">
        <div className="px-2 truncate">
          <p className="text-sm font-medium text-text-primary truncate">
            {user?.fullName || 'John Doe'}
          </p>
          <p className="text-xs text-text-muted truncate">
            {user?.email || 'john@invonics.com'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 w-full text-left rounded-lg text-sm font-medium text-danger hover:bg-danger-subtle transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
