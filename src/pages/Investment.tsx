import React, { useState } from 'react';
import './Investment.css';

// Common components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressBar from '../components/common/ProgressBar';

const Investment: React.FC = () => {
  // State for investment form
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('growth');
  const [investmentTerm, setInvestmentTerm] = useState<number>(6); // months
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasPaidFee, setHasPaidFee] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<'TRC20' | 'BTC' | 'USSD'>('TRC20');
  const [autoReinvest, setAutoReinvest] = useState<boolean>(true);

  // Constants
  const MIN_INVESTMENT_AMOUNT = 100; // $100
  const MAX_INVESTMENT_AMOUNT = 1000000; // $1M
  const INVESTMENT_FEE_PERCENTAGE = 2.0; // 2% deposit fee
  const TERM_OPTIONS = [3, 6, 12, 24]; // months

  // Mock wallet addresses
  const WALLET_ADDRESSES = {
    TRC20: 'TXYZ1234567890abcdefghijklmnopqrstuvw',
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    USSD: '*123*456*789#'
  };

  // Investment plans
  const investmentPlans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      minAmount: 100,
      maxAmount: 5000,
      returns: 80,
      term: 3,
      icon: '🌱',
      color: 'green',
      features: ['Low risk', 'Weekly returns', 'Capital protection']
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      minAmount: 1000,
      maxAmount: 50000,
      returns: 200,
      term: 6,
      icon: '📈',
      color: 'blue',
      features: ['Medium risk', 'Monthly returns', 'Compound interest', 'Priority support']
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      minAmount: 10000,
      maxAmount: 1000000,
      returns: 500,
      term: 12,
      icon: '💎',
      color: 'purple',
      features: ['High returns', 'Quarterly bonuses', 'Personal manager', 'VIP events']
    }
  ];

  // Mock portfolio data
  const portfolioData = {
    totalInvested: 8500.00,
    currentValue: 12450.00,
    totalReturns: 3950.00,
    activeInvestments: 3,
    portfolioGrowth: 46.47
  };

  // Recent investments (mock)
  const recentInvestments = [
    { id: 'INV-001', amount: 5000, plan: 'Growth Plan', status: 'Active', date: '1 month ago', returns: '+$1,250' },
    { id: 'INV-002', amount: 2000, plan: 'Starter Plan', status: 'Matured', date: '3 months ago', returns: '+$400' },
    { id: 'INV-003', amount: 1500, plan: 'Starter Plan', status: 'Active', date: '2 months ago', returns: '+$375' },
    { id: 'INV-004', amount: 10000, plan: 'Premium Plan', status: 'Processing', date: '1 week ago', returns: 'Pending' }
  ];

  // Calculate investment fee
  const calculateInvestmentFee = (amount: number): number => {
    const fee = amount * (INVESTMENT_FEE_PERCENTAGE / 100);
    return Math.max(10, Math.min(fee, 5000)); // Min $10, max $5000
  };

  // Calculate projected returns
  const calculateProjectedReturns = (amount: number, planId: string): number => {
    const plan = investmentPlans.find(p => p.id === planId);
    if (!plan) return 0;
    return (amount * plan.returns) / 100;
  };

  const parsedAmount = parseFloat(investmentAmount) || 0;
  const investmentFee = calculateInvestmentFee(parsedAmount);
  const projectedReturns = calculateProjectedReturns(parsedAmount, selectedPlan);
  const selectedPlanData = investmentPlans.find(p => p.id === selectedPlan);

  // Handle investment submission
  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount < MIN_INVESTMENT_AMOUNT || parsedAmount > MAX_INVESTMENT_AMOUNT) {
      alert(`Investment amount must be between $${MIN_INVESTMENT_AMOUNT.toLocaleString()} and $${MAX_INVESTMENT_AMOUNT.toLocaleString()}`);
      return;
    }
    
    if (parsedAmount < selectedPlanData!.minAmount || parsedAmount > selectedPlanData!.maxAmount) {
      alert(`This plan requires investment between $${selectedPlanData!.minAmount.toLocaleString()} and $${selectedPlanData!.maxAmount.toLocaleString()}`);
      return;
    }
    
    setCurrentStep(1);
    setIsDepositModalOpen(true);
  };

  // Handle deposit payment
  const handleDepositPayment = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setHasPaidFee(true);
      setIsProcessing(false);
      setCurrentStep(2);
    }, 2000);
  };

  // Handle investment completion
  const handleInvestmentComplete = () => {
    setCurrentStep(3);
    // Reset after 3 seconds
    setTimeout(() => {
      setIsDepositModalOpen(false);
      setCurrentStep(1);
      setInvestmentAmount('');
      setHasPaidFee(false);
    }, 3000);
  };

  // Quick investment amount buttons
  const quickAmounts = [100, 500, 1000, 5000, 10000, 50000];

  return (
    <div className="investment">
      {/* Page Header */}
      <div className="investment-header">
        <div className="header-content">
          <div>
            <h2 className="page-title">Investment Dashboard</h2>
            <p className="page-subtitle">Turn your money into wealth with massive returns!</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">{portfolioData.portfolioGrowth}%</span>
              <span className="stat-label">Portfolio Growth</span>
            </div>
            <div className="stat">
              <span className="stat-value">{portfolioData.activeInvestments}</span>
              <span className="stat-label">Active Plans</span>
            </div>
            <div className="stat">
              <span className="stat-value">${portfolioData.totalReturns.toLocaleString()}</span>
              <span className="stat-label">Total Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="investment-content">
        {/* Left Column - Portfolio & Calculator */}
        <div className="investment-left">
          {/* Portfolio Summary */}
          <Card className="portfolio-summary">
            <div className="portfolio-header">
              <h3 className="portfolio-title">💰 Portfolio Overview</h3>
              <div className="portfolio-badge">Live</div>
            </div>
            
            <div className="portfolio-stats">
              <div className="portfolio-stat">
                <span className="stat-label">Total Invested</span>
                <span className="stat-value">${portfolioData.totalInvested.toLocaleString()}</span>
              </div>
              <div className="portfolio-stat">
                <span className="stat-label">Current Value</span>
                <span className="stat-value highlight">${portfolioData.currentValue.toLocaleString()}</span>
              </div>
              <div className="portfolio-stat">
                <span className="stat-label">Total Returns</span>
                <span className="stat-value success">+${portfolioData.totalReturns.toLocaleString()}</span>
              </div>
              <div className="portfolio-stat">
                <span className="stat-label">Growth</span>
                <span className="stat-value growth">+{portfolioData.portfolioGrowth}%</span>
              </div>
            </div>

            <ProgressBar 
              value={75}
              label="Portfolio Performance"
              color="success"
              size="lg"
              showPercentage
              animated
            />
          </Card>

          {/* Investment Calculator */}
          <Card className="investment-calculator">
            <div className="calculator-header">
              <h3 className="calculator-title">📊 Investment Calculator</h3>
              <div className="calculator-badge">Smart</div>
            </div>

            <form onSubmit={handleInvestSubmit} className="investment-form">
              {/* Plan Selection */}
              <div className="form-group">
                <label className="form-label">Select Investment Plan</label>
                <div className="plan-options">
                  {investmentPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`plan-option ${selectedPlan === plan.id ? 'active' : ''} ${plan.color}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className="plan-icon">{plan.icon}</div>
                      <div className="plan-details">
                        <h4 className="plan-name">{plan.name}</h4>
                        <div className="plan-returns">{plan.returns}% Returns</div>
                        <div className="plan-range">
                          ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="plan-check">✓</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="form-group">
                <label className="form-label">
                  Investment Amount
                  <span className="amount-range">
                    ${MIN_INVESTMENT_AMOUNT.toLocaleString()} - ${MAX_INVESTMENT_AMOUNT.toLocaleString()}
                  </span>
                </label>
                <div className="amount-input-container">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    className="amount-input"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={MIN_INVESTMENT_AMOUNT}
                    max={MAX_INVESTMENT_AMOUNT}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="quick-amounts">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className="quick-amount-btn"
                      onClick={() => setInvestmentAmount(amount.toString())}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment Term */}
              <div className="form-group">
                <label className="form-label">Investment Term (Months)</label>
                <div className="term-options">
                  {TERM_OPTIONS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className={`term-option ${investmentTerm === term ? 'active' : ''}`}
                      onClick={() => setInvestmentTerm(term)}
                    >
                      {term} months
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Reinvest */}
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="auto-reinvest"
                    checked={autoReinvest}
                    onChange={(e) => setAutoReinvest(e.target.checked)}
                    className="checkbox-input"
                  />
                  <label htmlFor="auto-reinvest" className="checkbox-label">
                    <span className="checkbox-custom"></span>
                    Enable Auto-Reinvestment
                    <span className="checkbox-note">(Automatically reinvest your returns for compound growth)</span>
                  </label>
                </div>
              </div>

              {/* Projection Summary */}
              <Card className="projection-summary">
                <div className="summary-header">
                  <h4 className="summary-title">📈 Projected Earnings</h4>
                  <div className="summary-period">{investmentTerm} months</div>
                </div>
                
                <div className="projection-grid">
                  <div className="projection-item">
                    <span className="projection-label">Investment</span>
                    <span className="projection-value">
                      {parsedAmount > 0 ? `$${parsedAmount.toLocaleString()}` : '$0'}
                    </span>
                  </div>
                  <div className="projection-item">
                    <span className="projection-label">
                      Deposit Fee ({INVESTMENT_FEE_PERCENTAGE}%)
                      <span className="fee-note">*Required upfront</span>
                    </span>
                    <span className="projection-value fee">${investmentFee.toLocaleString()}</span>
                  </div>
                  <div className="projection-item highlight">
                    <span className="projection-label">Projected Returns</span>
                    <span className="projection-value success">${projectedReturns.toLocaleString()}</span>
                  </div>
                  <div className="projection-item total">
                    <span className="projection-label">Total Value</span>
                    <span className="projection-value total-amount">
                      ${(parsedAmount + projectedReturns).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="projection-note">
                  <span className="note-icon">💡</span>
                  <p>
                    <strong>Example:</strong> Your ${parsedAmount.toLocaleString()} could grow to ${(parsedAmount + projectedReturns).toLocaleString()} in {investmentTerm} months!
                  </p>
                </div>
              </Card>

              {/* CTA Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={parsedAmount < MIN_INVESTMENT_AMOUNT}
              >
                🚀 Start Investing Now
              </Button>

              <p className="form-note">
                ⚡ <strong>97% of investors</strong> see positive returns within 30 days. 
                <span className="warning"> Start with just $100!</span>
              </p>
            </form>
          </Card>
        </div>

        {/* Right Column - Plans & Recent Investments */}
        <div className="investment-right">
          {/* Featured Opportunity */}
          <Card className="featured-opportunity">
            <div className="opportunity-badge">🔥 HOT OPPORTUNITY</div>
            <div className="opportunity-content">
              <h3 className="opportunity-title">🚀 Limited Time: 500% Returns!</h3>
              <p className="opportunity-text">
                Exclusive premium slots open for the next 24 hours. 
                <strong> Only 15 spots remaining!</strong>
              </p>
              
              <div className="opportunity-stats">
                <div className="opportunity-stat">
                  <span className="stat-number">500%</span>
                  <span className="stat-label">Guaranteed</span>
                </div>
                <div className="opportunity-stat">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Months</span>
                </div>
                <div className="opportunity-stat">
                  <span className="stat-number">15</span>
                  <span className="stat-label">Spots Left</span>
                </div>
              </div>

              <ProgressBar 
                value={75}
                label="Filling Fast"
                color="accent"
                showPercentage
                animated
                striped
              />

              <Button variant="accent" size="lg" fullWidth className="opportunity-btn">
                🔥 Claim Your Spot
              </Button>
            </div>
          </Card>

          {/* Recent Investments */}
          <Card className="recent-investments">
            <div className="section-header">
              <h3 className="section-title">Recent Investments</h3>
              <Button variant="ghost" size="sm">View All →</Button>
            </div>
            
            <div className="investments-list">
              {recentInvestments.map((investment) => (
                <div key={investment.id} className="investment-item">
                  <div className="investment-info">
                    <div className="investment-id">{investment.id}</div>
                    <div className="investment-details">
                      <div className="investment-plan">{investment.plan}</div>
                      <div className="investment-amount">${investment.amount.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="investment-status">
                    <span className={`status-badge ${investment.status.toLowerCase()}`}>
                      {investment.status}
                    </span>
                    <div className="investment-returns">{investment.returns}</div>
                    <div className="investment-date">{investment.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Investment Tips */}
          <Card className="investment-tips">
            <h3 className="tips-title">💡 Investment Tips</h3>
            <ul className="tips-list">
              <li className="tip-item">
                <span className="tip-icon">💰</span>
                <div>
                  <strong>Start Early</strong>
                  <p>The earlier you invest, the more time your money has to grow</p>
                </div>
              </li>
              <li className="tip-item">
                <span className="tip-icon">📊</span>
                <div>
                  <strong>Diversify</strong>
                  <p>Spread investments across different plans for better risk management</p>
                </div>
              </li>
              <li className="tip-item">
                <span className="tip-icon">🔄</span>
                <div>
                  <strong>Reinvest</strong>
                  <p>Enable auto-reinvestment for compound growth</p>
                </div>
              </li>
              <li className="tip-item">
                <span className="tip-icon">🎯</span>
                <div>
                  <strong>Set Goals</strong>
                  <p>Define clear investment goals and timelines</p>
                </div>
              </li>
            </ul>
          </Card>

          {/* Trust Signals */}
          <Card className="trust-signals">
            <div className="signals-header">
              <h4 className="signals-title">🔒 Trusted by Thousands</h4>
              <div className="signals-rating">4.9 ★</div>
            </div>
            <div className="signals-stats">
              <div className="signal-stat">
                <span className="signal-value">10,000+</span>
                <span className="signal-label">Happy Investors</span>
              </div>
              <div className="signal-stat">
                <span className="signal-value">$50M+</span>
                <span className="signal-label">Invested</span>
              </div>
              <div className="signal-stat">
                <span className="signal-value">99.8%</span>
                <span className="signal-label">Success Rate</span>
              </div>
            </div>
            <p className="signals-note">
              Join thousands of investors who have multiplied their wealth with Truvest
            </p>
          </Card>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title="Complete Investment Deposit"
        size="lg"
      >
        <div className="modal-steps">
          <ProgressBar 
            value={currentStep * 33.33} 
            label={`Step ${currentStep} of 3`}
            color="success"
            showPercentage
            animated
          />
          
          <div className="step-indicators">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Review</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Deposit</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Complete</div>
            </div>
          </div>
        </div>

        {/* Step 1: Review Investment */}
        {currentStep === 1 && (
          <div className="modal-step-content">
            <div className="investment-review">
              <h4 className="review-title">Review Your Investment</h4>
              
              <div className="review-details">
                <div className="detail-row">
                  <span className="detail-label">Selected Plan</span>
                  <span className="detail-value">{selectedPlanData?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Investment Amount</span>
                  <span className="detail-value">${parsedAmount.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Investment Term</span>
                  <span className="detail-value">{investmentTerm} months</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Projected Returns</span>
                  <span className="detail-value success">${projectedReturns.toLocaleString()}</span>
                </div>
                <div className="detail-row fee-row">
                  <span className="detail-label">
                    Deposit Fee ({INVESTMENT_FEE_PERCENTAGE}%)
                    <span className="fee-warning">*Required to activate investment</span>
                  </span>
                  <span className="detail-value fee-highlight">${investmentFee.toLocaleString()}</span>
                </div>
                <div className="detail-row total-row">
                  <span className="detail-label">Total to Deposit</span>
                  <span className="detail-value total">${(parsedAmount + investmentFee).toLocaleString()}</span>
                </div>
              </div>

              <div className="review-features">
                <h5>✨ Plan Features:</h5>
                <ul>
                  {selectedPlanData?.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={() => setIsDepositModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(2)}>
                  Proceed to Deposit
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Deposit Payment */}
        {currentStep === 2 && (
          <div className="modal-step-content">
            <div className="deposit-step">
              <h4 className="deposit-title">Make Deposit</h4>
              <p className="deposit-subtitle">
                Send ${(parsedAmount + investmentFee).toLocaleString()} to activate your investment
              </p>
              
              <div className="wallet-options">
                <div className="wallet-selector">
                  {(['TRC20', 'BTC', 'USSD'] as const).map((wallet) => (
                    <button
                      key={wallet}
                      className={`wallet-option ${selectedWallet === wallet ? 'active' : ''}`}
                      onClick={() => setSelectedWallet(wallet)}
                    >
                      <span className="wallet-icon">
                        {wallet === 'TRC20' ? '🔄' : wallet === 'BTC' ? '₿' : '📱'}
                      </span>
                      <span className="wallet-name">
                        {wallet === 'USSD' ? 'USSD Transfer' : `${wallet} (${wallet === 'TRC20' ? 'USDT' : 'BTC'})`}
                      </span>
                      <span className="wallet-fee">
                        {wallet === 'TRC20' ? 'Fee: $1' : wallet === 'BTC' ? 'Fee: $5-10' : 'No fee'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="wallet-address-card">
                  <div className="address-header">
                    <span className="address-label">Send exact amount to:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigator.clipboard.writeText(WALLET_ADDRESSES[selectedWallet])}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="address-value">
                    {WALLET_ADDRESSES[selectedWallet]}
                  </div>
                  
                  <div className="qr-code-placeholder">
                    <div className="qr-code">
                      <div className="qr-grid"></div>
                      <div className="qr-label">Scan QR Code</div>
                    </div>
                  </div>

                  <div className="deposit-instructions">
                    <h5>📝 Important Instructions:</h5>
                    <ol>
                      <li>Send <strong>exactly ${(parsedAmount + investmentFee).toLocaleString()}</strong></li>
                      <li>Include your user ID in the memo/note field</li>
                      <li>Wait for 3 network confirmations</li>
                      <li>Your investment will activate within 1 hour</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleDepositPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'I Have Made Payment'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Completion */}
        {currentStep === 3 && (
          <div className="modal-step-content">
            <div className="completion-step">
              <div className="completion-icon">🎉</div>
              <h4 className="completion-title">Investment Activated!</h4>
              <p className="completion-text">
                Congratulations! Your investment is now active and earning returns.
              </p>
              
              <div className="investment-summary">
                <div className="summary-item">
                  <span className="summary-label">Investment ID</span>
                  <span className="summary-value">INV-00{Math.floor(Math.random() * 1000)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Amount</span>
                  <span className="summary-value">${parsedAmount.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Plan</span>
                  <span className="summary-value">{selectedPlanData?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Status</span>
                  <span className="summary-value status-badge active">Active & Earning</span>
                </div>
              </div>

              <div className="next-steps">
                <h5>📋 What's Next:</h5>
                <ul>
                  <li>Track your investment growth in dashboard</li>
                  <li>First returns expected in 7 days</li>
                  <li>You'll receive weekly performance reports</li>
                  <li>Contact support for any questions</li>
                </ul>
              </div>

              <div className="modal-actions single">
                <Button variant="primary" onClick={handleInvestmentComplete}>
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Investment;