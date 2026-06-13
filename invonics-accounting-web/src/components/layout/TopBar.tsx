import React from 'react';
import { Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="h-16 flex-shrink-0 bg-bg-surface border-b border-bg-border flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary hidden sm:block">
          Overview
        </h1>
      </div>
      <div id="topbar-actions" className="flex items-center gap-3">
        {/* Portal target for page-specific actions */}
      </div>
    </header>
  );
}
