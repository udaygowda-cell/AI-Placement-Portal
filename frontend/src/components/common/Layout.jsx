import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {(title || subtitle) && (
            <div className="mb-8 animate-fade-in">
              {title && <h1 className="text-2xl font-display font-bold text-white">{title}</h1>}
              {subtitle && <p className="text-sm mt-1" style={{ color: 'rgba(240,240,248,0.5)' }}>{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
