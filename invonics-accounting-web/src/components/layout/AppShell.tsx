import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AppShell() {
  return (
    <div className="flex h-screen w-full">
      <div className="w-64 bg-bg-surface border-r border-bg-border">
        {/* Sidebar placeholder */}
        <div className="p-4 font-bold text-lg border-b border-bg-border">Invonics</div>
      </div>
      <div className="flex flex-col flex-1">
        <header className="h-16 bg-bg-surface border-b border-bg-border flex items-center px-6">
          {/* TopBar placeholder */}
        </header>
        <main className="flex-1 overflow-auto bg-bg-base p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
