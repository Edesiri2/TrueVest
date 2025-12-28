import React from 'react';
import './Onboarding.css';

const Onboarding: React.FC = () => {
  return (
    <div className="onboarding">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h1 className="onboarding-title">Truvest</h1>
          <p className="onboarding-subtitle">Invest. Borrow. Grow.</p>
        </div>
        
        <div className="onboarding-content">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Massive Returns</h3>
              <p>Up to 500% returns on investments</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Quick Loans</h3>
              <p>Get up to $5M with instant processing</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Wallet</h3>
              <p>TRC/BTC wallet integration</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Processing</h3>
              <p>No delays, instant transactions</p>
            </div>
          </div>
          
          <button className="get-started-btn">
            Get Started
          </button>
          
          <p className="onboarding-note">
            Already have an account? <a href="#">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;