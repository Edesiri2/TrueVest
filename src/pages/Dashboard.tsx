import React from 'react';
import './Dashboard.css';

// Common components
import Card from '../components/common/Card';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, John!</h2>
        <p>Your financial dashboard</p>
      </div>

      <div className="dashboard-grid">
        <Card className="dashboard-card">
          <h3>Total Balance</h3>
          <p className="balance-amount">$12,450.00</p>
          <p className="balance-change positive">+12.5% this month</p>
        </Card>

        <Card className="dashboard-card">
          <h3>Investments</h3>
          <p className="balance-amount">$8,500.00</p>
          <p className="balance-change positive">Projected: $25,500</p>
        </Card>

        <Card className="dashboard-card">
          <h3>Pending Fees</h3>
          <p className="balance-amount">$250.00</p>
          <p className="balance-change warning">Pay to unlock features</p>
        </Card>

        <Card className="dashboard-card">
          <h3>Active Plans</h3>
          <p className="balance-amount">3</p>
          <p className="balance-change">All performing well</p>
        </Card>
      </div>

      <Card className="dashboard-banner">
        <h3>🚀 Ready for Massive Returns?</h3>
        <p>Invest now and get up to 500% returns in 6 months. Limited time offer!</p>
        <button className="cta-button">Invest Now</button>
      </Card>
    </div>
  );
};

export default Dashboard;