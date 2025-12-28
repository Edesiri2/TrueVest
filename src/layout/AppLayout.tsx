import React from 'react';
import './AppLayout.css';
import Header from './Header';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;