import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <span className="header-logo">💎</span>
          <h1 className="header-title">Truvest</h1>
          <span className="header-badge">Beta</span>
        </div>
        
        <div className="header-actions">
          <div className="header-balance">
            <span className="balance-label">Available Balance</span>
            <span className="balance-amount">$12,450.00</span>
          </div>
          
          <button className="header-notifications" aria-label="Notifications">
            <span className="notification-icon">🔔</span>
            <span className="notification-dot"></span>
          </button>
          
          <div className="header-profile">
            <div className="profile-avatar">
              <span>JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;