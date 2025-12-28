import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout
import AppLayout from './layout/AppLayout';

// Pages
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Investment from './pages/Investment';
import Loan from './pages/Loan';
import Deposit from './pages/Deposit';
import Wallet from './pages/Wallet';

function App() {
  // Mock authentication state - for demo
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Onboarding />} />

        {/* Protected routes with AppLayout */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/invest"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Investment />
              </AppLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/loan"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Loan />
              </AppLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/deposit"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Deposit />
              </AppLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/wallet"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Wallet />
              </AppLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;