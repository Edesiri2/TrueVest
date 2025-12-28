import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/invest', label: 'Invest', icon: '📈' },
    { path: '/loan', label: 'Loan', icon: '💰' },
    { path: '/deposit', label: 'Deposit', icon: '🏦' },
    { path: '/wallet', label: 'Wallet', icon: '👛' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;