import React, { useState } from 'react';
import './Deposit.css';

// Common components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressBar from '../components/common/ProgressBar';

const Deposit: React.FC = () => {
  // State for deposit/withdrawal
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasPaidFee, setHasPaidFee] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<'TRC20' | 'BTC' | 'USSD' | 'BANK'>('TRC20');
  const [transactionProof, setTransactionProof] = useState<File | null>(null);
  const [withdrawalAddress, setWithdrawalAddress] = useState<string>('');

  // Constants
  const MIN_DEPOSIT_AMOUNT = 10; // $10 minimum deposit
  const MAX_DEPOSIT_AMOUNT = 100000; // $100K maximum deposit
  const MIN_WITHDRAWAL_AMOUNT = 50; // $50 minimum withdrawal
  const MAX_WITHDRAWAL_AMOUNT = 50000; // $50K maximum withdrawal
  const WITHDRAWAL_FEE_PERCENTAGE = 3.0; // 3% withdrawal fee
  const DEPOSIT_FEE_PERCENTAGE = 1.0; // 1% deposit fee

  // Mock wallet addresses
  const WALLET_ADDRESSES = {
    TRC20: 'TXYZ1234567890abcdefghijklmnopqrstuvw',
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    USSD: '*123*456*789#',
    BANK: 'Truvest Bank\nAccount: 1234567890\nRouting: 987654321'
  };

  // Mock balance data
  const balanceData = {
    availableBalance: 12450.00,
    totalDeposits: 18500.00,
    totalWithdrawals: 6050.00,
    pendingWithdrawals: 1500.00,
    feesPaid: 375.00,
    withdrawalLimit: 50000.00,
    dailyLimit: 10000.00
  };

  // Calculate fees
  const calculateWithdrawalFee = (amount: number): number => {
    const fee = amount * (WITHDRAWAL_FEE_PERCENTAGE / 100);
    return Math.max(5, Math.min(fee, 1000)); // Min $5, max $1000
  };

  const calculateDepositFee = (amount: number): number => {
    const fee = amount * (DEPOSIT_FEE_PERCENTAGE / 100);
    return Math.max(1, Math.min(fee, 500)); // Min $1, max $500
  };

  const parsedAmount = parseFloat(amount) || 0;
  const withdrawalFee = calculateWithdrawalFee(parsedAmount);
  const depositFee = calculateDepositFee(parsedAmount);
  const withdrawalTotal = parsedAmount + withdrawalFee;
  const depositTotal = parsedAmount - depositFee;

  // Recent transactions (mock)
  const recentTransactions = [
    { id: 'TXN-001', type: 'Deposit', amount: 5000, method: 'TRC20', status: 'Completed', date: '2 days ago', fee: 50 },
    { id: 'TXN-002', type: 'Withdrawal', amount: 2500, method: 'BTC', status: 'Processing', date: '1 week ago', fee: 75 },
    { id: 'TXN-003', type: 'Deposit', amount: 1000, method: 'USSD', status: 'Completed', date: '2 weeks ago', fee: 10 },
    { id: 'TXN-004', type: 'Withdrawal', amount: 500, method: 'TRC20', status: 'Pending Fee', date: '3 days ago', fee: 15 },
    { id: 'TXN-005', type: 'Deposit', amount: 15000, method: 'Bank', status: 'Completed', date: '1 month ago', fee: 150 }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'TRC20', name: 'TRC-20 (USDT)', icon: '🔄', fee: '$1 network fee', speed: '5-30 minutes' },
    { id: 'BTC', name: 'Bitcoin (BTC)', icon: '₿', fee: '$5-10 network fee', speed: '10-60 minutes' },
    { id: 'USSD', name: 'USSD Transfer', icon: '📱', fee: 'No fee', speed: 'Instant' },
    { id: 'BANK', name: 'Bank Transfer', icon: '🏦', fee: '1-2% bank fee', speed: '1-3 business days' }
  ];

  // Quick amount buttons
  const quickAmounts = activeTab === 'deposit' 
    ? [10, 50, 100, 500, 1000, 5000]
    : [50, 100, 500, 1000, 2500, 5000];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'deposit') {
      if (parsedAmount < MIN_DEPOSIT_AMOUNT || parsedAmount > MAX_DEPOSIT_AMOUNT) {
        alert(`Deposit amount must be between $${MIN_DEPOSIT_AMOUNT} and $${MAX_DEPOSIT_AMOUNT}`);
        return;
      }
    } else {
      if (parsedAmount < MIN_WITHDRAWAL_AMOUNT || parsedAmount > MAX_WITHDRAWAL_AMOUNT) {
        alert(`Withdrawal amount must be between $${MIN_WITHDRAWAL_AMOUNT} and $${MAX_WITHDRAWAL_AMOUNT}`);
        return;
      }
      if (parsedAmount > balanceData.availableBalance) {
        alert(`Insufficient balance. Available: $${balanceData.availableBalance.toLocaleString()}`);
        return;
      }
      if (parsedAmount > balanceData.dailyLimit) {
        alert(`Amount exceeds daily limit of $${balanceData.dailyLimit.toLocaleString()}`);
        return;
      }
      if (!withdrawalAddress) {
        alert('Please enter your withdrawal address');
        return;
      }
    }
    
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  // Handle fee payment
  const handleFeePayment = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setHasPaidFee(true);
      setIsProcessing(false);
      setCurrentStep(2);
    }, 2000);
  };

  // Handle proof upload
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTransactionProof(file);
    }
  };

  // Handle transaction completion
  const handleTransactionComplete = () => {
    setCurrentStep(3);
    // Reset after 3 seconds
    setTimeout(() => {
      setIsModalOpen(false);
      setCurrentStep(1);
      setAmount('');
      setWithdrawalAddress('');
      setHasPaidFee(false);
      setTransactionProof(null);
    }, 3000);
  };

  return (
    <div className="deposit">
      {/* Page Header */}
      <div className="deposit-header">
        <div className="header-content">
          <div>
            <h2 className="page-title">Deposit & Withdraw</h2>
            <p className="page-subtitle">Manage your funds securely and efficiently</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">${balanceData.availableBalance.toLocaleString()}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat">
              <span className="stat-value">${balanceData.dailyLimit.toLocaleString()}</span>
              <span className="stat-label">Daily Limit</span>
            </div>
            <div className="stat">
              <span className="stat-value">${balanceData.withdrawalLimit.toLocaleString()}</span>
              <span className="stat-label">Max Withdrawal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="deposit-content">
        {/* Left Column - Balance & Transaction Form */}
        <div className="deposit-left">
          {/* Balance Summary */}
          <Card className="balance-summary">
            <div className="balance-header">
              <h3 className="balance-title">💰 Balance Overview</h3>
              <div className="balance-badge">Real-time</div>
            </div>
            
            <div className="balance-amount">
              <span className="currency">$</span>
              <span className="amount">{balanceData.availableBalance.toLocaleString()}</span>
              <span className="balance-label">Available Balance</span>
            </div>

            <div className="balance-details">
              <div className="balance-row">
                <span className="label">Total Deposits</span>
                <span className="value success">${balanceData.totalDeposits.toLocaleString()}</span>
              </div>
              <div className="balance-row">
                <span className="label">Total Withdrawals</span>
                <span className="value">${balanceData.totalWithdrawals.toLocaleString()}</span>
              </div>
              <div className="balance-row">
                <span className="label">Pending Withdrawals</span>
                <span className="value warning">${balanceData.pendingWithdrawals.toLocaleString()}</span>
              </div>
              <div className="balance-row">
                <span className="label">Total Fees Paid</span>
                <span className="value fee">${balanceData.feesPaid.toLocaleString()}</span>
              </div>
            </div>

            <ProgressBar 
              value={(balanceData.availableBalance / balanceData.withdrawalLimit) * 100}
              label="Withdrawal Limit Usage"
              color="primary"
              showPercentage
              size="lg"
            />
          </Card>

          {/* Transaction Tabs */}
          <Card className="transaction-tabs">
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === 'deposit' ? 'active' : ''}`}
                onClick={() => setActiveTab('deposit')}
              >
                <span className="tab-icon">📥</span>
                Deposit Funds
              </button>
              <button
                className={`tab-button ${activeTab === 'withdraw' ? 'active' : ''}`}
                onClick={() => setActiveTab('withdraw')}
              >
                <span className="tab-icon">📤</span>
                Withdraw Funds
              </button>
            </div>
          </Card>

          {/* Transaction Form */}
          <Card className="transaction-form">
            <form onSubmit={handleSubmit}>
              <div className="form-header">
                <h3 className="form-title">
                  {activeTab === 'deposit' ? '📥 Deposit Funds' : '📤 Withdraw Funds'}
                </h3>
                <div className="form-limit">
                  Limit: ${activeTab === 'deposit' ? MIN_DEPOSIT_AMOUNT : MIN_WITHDRAWAL_AMOUNT} - 
                  ${activeTab === 'deposit' ? MAX_DEPOSIT_AMOUNT.toLocaleString() : MAX_WITHDRAWAL_AMOUNT.toLocaleString()}
                </div>
              </div>

              {/* Amount Input */}
              <div className="form-group">
                <label className="form-label">
                  {activeTab === 'deposit' ? 'Deposit Amount' : 'Withdrawal Amount'}
                </label>
                <div className="amount-input-container">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    className="amount-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={activeTab === 'deposit' ? MIN_DEPOSIT_AMOUNT : MIN_WITHDRAWAL_AMOUNT}
                    max={activeTab === 'deposit' ? MAX_DEPOSIT_AMOUNT : MAX_WITHDRAWAL_AMOUNT}
                    placeholder={`Enter amount (Min: $${activeTab === 'deposit' ? MIN_DEPOSIT_AMOUNT : MIN_WITHDRAWAL_AMOUNT})`}
                    required
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="quick-amounts">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      className="quick-amount-btn"
                      onClick={() => setAmount(quickAmount.toString())}
                    >
                      ${quickAmount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Selection */}
              <div className="form-group">
                <label className="form-label">
                  {activeTab === 'deposit' ? 'Payment Method' : 'Withdrawal Method'}
                </label>
                <div className="method-options">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`method-option ${selectedMethod === method.id ? 'active' : ''}`}
                      onClick={() => setSelectedMethod(method.id as any)}
                    >
                      <div className="method-icon">{method.icon}</div>
                      <div className="method-details">
                        <h4 className="method-name">{method.name}</h4>
                        <div className="method-fee">{method.fee}</div>
                        <div className="method-speed">{method.speed}</div>
                      </div>
                      <div className="method-check">✓</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Withdrawal Address Field */}
              {activeTab === 'withdraw' && (
                <div className="form-group">
                  <label className="form-label">
                    Withdrawal Address
                    <span className="label-note">(Where to send your funds)</span>
                  </label>
                  <input
                    type="text"
                    className="address-input"
                    value={withdrawalAddress}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                    placeholder="Enter your crypto wallet address"
                    required
                  />
                  <div className="address-note">
                    ⚠️ Ensure address is correct. Transactions cannot be reversed.
                  </div>
                </div>
              )}

              {/* Fee Summary */}
              <Card className="fee-summary">
                <div className="summary-header">
                  <h4 className="summary-title">
                    {activeTab === 'deposit' ? '📋 Deposit Summary' : '📋 Withdrawal Summary'}
                  </h4>
                </div>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="summary-label">
                      {activeTab === 'deposit' ? 'Amount to Deposit' : 'Amount to Withdraw'}
                    </span>
                    <span className="summary-value">
                      ${parsedAmount > 0 ? parsedAmount.toLocaleString() : '0'}
                    </span>
                  </div>
                  
                  <div className="summary-row fee-row">
                    <span className="summary-label">
                      {activeTab === 'deposit' ? 'Deposit Fee' : 'Withdrawal Fee'}
                      <span className="fee-percentage">
                        ({activeTab === 'deposit' ? DEPOSIT_FEE_PERCENTAGE : WITHDRAWAL_FEE_PERCENTAGE}%)
                      </span>
                      <span className="fee-note">*Required upfront</span>
                    </span>
                    <span className="summary-value fee-amount">
                      ${activeTab === 'deposit' ? depositFee.toLocaleString() : withdrawalFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="summary-row network-row">
                    <span className="summary-label">Network Fee</span>
                    <span className="summary-value">
                      {selectedMethod === 'TRC20' ? '$1' : 
                       selectedMethod === 'BTC' ? '$5-10' : 
                       selectedMethod === 'USSD' ? 'No fee' : '1-2%'}
                    </span>
                  </div>

                  <div className="summary-row total-row">
                    <span className="summary-label">
                      {activeTab === 'deposit' ? 'Total You\'ll Receive' : 'Total You\'ll Pay'}
                    </span>
                    <span className="summary-value total-amount">
                      ${activeTab === 'deposit' ? depositTotal.toLocaleString() : withdrawalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="summary-note">
                  <span className="note-icon">💡</span>
                  <p>
                    {activeTab === 'deposit' 
                      ? `You'll receive $${depositTotal.toLocaleString()} after $${depositFee.toLocaleString()} deposit fee.`
                      : `You'll pay $${withdrawalTotal.toLocaleString()} total ($${parsedAmount.toLocaleString()} + $${withdrawalFee.toLocaleString()} fee).`
                    }
                  </p>
                </div>
              </Card>

              {/* CTA Button */}
              <Button
                type="submit"
                variant={activeTab === 'deposit' ? 'primary' : 'secondary'}
                size="lg"
                fullWidth
                disabled={
                  parsedAmount < (activeTab === 'deposit' ? MIN_DEPOSIT_AMOUNT : MIN_WITHDRAWAL_AMOUNT) ||
                  (activeTab === 'withdraw' && (!withdrawalAddress || parsedAmount > balanceData.availableBalance))
                }
              >
                {activeTab === 'deposit' ? '🚀 Proceed to Deposit' : '💰 Request Withdrawal'}
              </Button>

              <div className="form-note">
                {activeTab === 'deposit' ? (
                  <p>⚡ <strong>Instant deposits</strong> with crypto. Funds available immediately after confirmation.</p>
                ) : (
                  <p>⏳ <strong>Withdrawals processed within 24 hours</strong> after fee payment confirmation.</p>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column - Recent Transactions & Security */}
        <div className="deposit-right">
          {/* Security Banner */}
          <Card className="security-banner">
            <div className="security-content">
              <div className="security-badge">🔒 SECURE</div>
              <h3 className="security-title">Bank-Level Security</h3>
              <p className="security-text">
                All transactions protected with 256-bit encryption and multi-factor authentication.
              </p>
              
              <div className="security-features">
                <div className="feature">
                  <span className="feature-icon">🛡️</span>
                  <span className="feature-text">Cold Storage</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔐</span>
                  <span className="feature-text">2FA Enabled</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📋</span>
                  <span className="feature-text">Audit Trail</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">👁️</span>
                  <span className="feature-text">24/7 Monitoring</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="recent-transactions">
            <div className="section-header">
              <h3 className="section-title">Recent Transactions</h3>
              <Button variant="ghost" size="sm">View All →</Button>
            </div>
            
            <div className="transactions-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    {transaction.type === 'Deposit' ? '📥' : '📤'}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-header">
                      <span className="transaction-type">{transaction.type}</span>
                      <span className={`transaction-status ${transaction.status.toLowerCase().replace(' ', '-')}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="transaction-footer">
                      <span className="transaction-method">{transaction.method}</span>
                      <span className="transaction-amount">
                        ${transaction.amount.toLocaleString()}
                        <span className="transaction-fee"> (Fee: ${transaction.fee})</span>
                      </span>
                    </div>
                  </div>
                  <div className="transaction-date">{transaction.date}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Fee Comparison */}
          <Card className="fee-comparison">
            <h3 className="comparison-title">💸 Fee Comparison</h3>
            <div className="comparison-table">
              <div className="comparison-row header">
                <span className="comparison-method">Method</span>
                <span className="comparison-deposit">Deposit Fee</span>
                <span className="comparison-withdraw">Withdrawal Fee</span>
                <span className="comparison-speed">Speed</span>
              </div>
              
              {paymentMethods.map((method) => (
                <div key={method.id} className={`comparison-row ${selectedMethod === method.id ? 'active' : ''}`}>
                  <span className="comparison-method">
                    <span className="method-icon-small">{method.icon}</span>
                    {method.name}
                  </span>
                  <span className="comparison-deposit">1%</span>
                  <span className="comparison-withdraw">3%</span>
                  <span className="comparison-speed">{method.speed}</span>
                </div>
              ))}
            </div>
            
            <div className="comparison-note">
              <p>💡 <strong>Tip:</strong> USSD transfers have no network fees but lower limits.</p>
            </div>
          </Card>

          {/* Support Card */}
          <Card className="support-card">
            <div className="support-content">
              <h4 className="support-title">💬 Need Help?</h4>
              <p className="support-text">
                Our support team is available 24/7 to assist with any transactions.
              </p>
              <div className="support-actions">
                <Button variant="outline" size="sm">
                  📞 Live Chat
                </Button>
                <Button variant="ghost" size="sm">
                  📧 Email Support
                </Button>
              </div>
              <div className="support-info">
                <div className="info-item">
                  <span className="info-label">Response Time</span>
                  <span className="info-value">Within 5 minutes</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Resolution Rate</span>
                  <span className="info-value">99.7%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'deposit' ? 'Complete Deposit' : 'Complete Withdrawal'}
        size="lg"
      >
        <div className="modal-steps">
          <ProgressBar 
            value={currentStep * 33.33} 
            label={`Step ${currentStep} of 3`}
            color={activeTab === 'deposit' ? 'primary' : 'secondary'}
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
              <div className="step-label">{activeTab === 'deposit' ? 'Deposit' : 'Pay Fee'}</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Complete</div>
            </div>
          </div>
        </div>

        {/* Step 1: Review Transaction */}
        {currentStep === 1 && (
          <div className="modal-step-content">
            <div className="transaction-review">
              <h4 className="review-title">
                {activeTab === 'deposit' ? 'Review Your Deposit' : 'Review Your Withdrawal'}
              </h4>
              
              <div className="review-details">
                <div className="detail-row">
                  <span className="detail-label">Transaction Type</span>
                  <span className="detail-value">
                    {activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value">${parsedAmount.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Method</span>
                  <span className="detail-value">
                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  </span>
                </div>
                {activeTab === 'withdraw' && (
                  <div className="detail-row">
                    <span className="detail-label">Withdrawal Address</span>
                    <span className="detail-value address">
                      {withdrawalAddress.substring(0, 20)}...
                      {withdrawalAddress.substring(withdrawalAddress.length - 10)}
                    </span>
                  </div>
                )}
                <div className="detail-row fee-row">
                  <span className="detail-label">
                    {activeTab === 'deposit' ? 'Deposit Fee' : 'Withdrawal Fee'}
                    <span className="fee-warning">*Must be paid upfront</span>
                  </span>
                  <span className="detail-value fee-highlight">
                    ${activeTab === 'deposit' ? depositFee.toLocaleString() : withdrawalFee.toLocaleString()}
                  </span>
                </div>
                <div className="detail-row total-row">
                  <span className="detail-label">
                    {activeTab === 'deposit' ? 'Total to Send' : 'Total Required'}
                  </span>
                  <span className="detail-value total">
                    ${activeTab === 'deposit' ? parsedAmount.toLocaleString() : withdrawalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="review-important">
                <h5>⚠️ Important Notes:</h5>
                <ul>
                  {activeTab === 'deposit' ? (
                    <>
                      <li>Send exact amount to avoid delays</li>
                      <li>Include your user ID in the memo field</li>
                      <li>Funds will be available after 3 confirmations</li>
                      <li>Contact support if transaction takes over 2 hours</li>
                    </>
                  ) : (
                    <>
                      <li>Withdrawal fee must be paid before processing</li>
                      <li>Ensure withdrawal address is correct</li>
                      <li>Processing time: 1-24 hours</li>
                      <li>Maximum 3 withdrawals per day</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant={activeTab === 'deposit' ? 'primary' : 'secondary'} 
                  onClick={() => setCurrentStep(2)}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment/Deposit */}
        {currentStep === 2 && (
          <div className="modal-step-content">
            <div className="payment-step">
              <h4 className="payment-title">
                {activeTab === 'deposit' ? 'Make Deposit' : 'Pay Withdrawal Fee'}
              </h4>
              <p className="payment-subtitle">
                {activeTab === 'deposit'
                  ? `Send $${parsedAmount.toLocaleString()} to the address below`
                  : `Send $${withdrawalFee.toLocaleString()} fee to proceed with withdrawal`
                }
              </p>
              
              <div className="payment-details">
                <div className="wallet-address-card">
                  <div className="address-header">
                    <span className="address-label">
                      {activeTab === 'deposit' ? 'Send to:' : 'Fee Payment Address:'}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigator.clipboard.writeText(WALLET_ADDRESSES[selectedMethod])}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="address-value">
                    {WALLET_ADDRESSES[selectedMethod]}
                  </div>
                  
                  {selectedMethod !== 'BANK' && (
                    <div className="qr-code-placeholder">
                      <div className="qr-code">
                        <div className="qr-grid"></div>
                        <div className="qr-label">Scan QR Code</div>
                      </div>
                    </div>
                  )}

                  <div className="payment-instructions">
                    <h5>📝 Instructions:</h5>
                    {activeTab === 'deposit' ? (
                      <ol>
                        <li>Send <strong>exactly ${parsedAmount.toLocaleString()}</strong></li>
                        <li>Include memo: <code>DEP{Math.floor(Math.random() * 10000)}</code></li>
                        <li>Wait for 3 network confirmations</li>
                        <li>Balance will update automatically</li>
                      </ol>
                    ) : (
                      <ol>
                        <li>Send <strong>exactly ${withdrawalFee.toLocaleString()}</strong></li>
                        <li>Include memo: <code>WDF{Math.floor(Math.random() * 10000)}</code></li>
                        <li>Upload transaction proof below</li>
                        <li>Withdrawal will be processed within 24 hours</li>
                      </ol>
                    )}
                  </div>
                </div>

                {/* Proof Upload for Withdrawals */}
                {activeTab === 'withdraw' && (
                  <div className="proof-upload">
                    <h5>📤 Upload Fee Payment Proof</h5>
                    <div className="upload-area">
                      {transactionProof ? (
                        <div className="upload-preview">
                          <div className="file-icon">📄</div>
                          <div className="file-info">
                            <div className="file-name">{transactionProof.name}</div>
                            <div className="file-size">
                              {(transactionProof.size / 1024).toFixed(2)} KB
                            </div>
                          </div>
                          <button 
                            className="remove-file"
                            onClick={() => setTransactionProof(null)}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="upload-icon">📤</div>
                          <p className="upload-text">
                            Upload screenshot of your fee payment transaction
                          </p>
                          <input
                            type="file"
                            id="proof-upload"
                            className="upload-input"
                            onChange={handleProofUpload}
                            accept="image/*,.pdf"
                          />
                          <label htmlFor="proof-upload" className="upload-button">
                            Choose File
                          </label>
                        </>
                      )}
                    </div>
                    <p className="upload-note">
                      ⚠️ Accepted: PNG, JPG, PDF (max 5MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button 
                  variant={activeTab === 'deposit' ? 'primary' : 'secondary'} 
                  onClick={handleFeePayment}
                  disabled={isProcessing || (activeTab === 'withdraw' && !transactionProof)}
                >
                  {isProcessing ? 'Processing...' : 
                   activeTab === 'deposit' ? 'I Have Sent Payment' : 'I Have Paid Fee'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Completion */}
        {currentStep === 3 && (
          <div className="modal-step-content">
            <div className="completion-step">
              <div className="completion-icon">
                {activeTab === 'deposit' ? '✅' : '🎉'}
              </div>
              <h4 className="completion-title">
                {activeTab === 'deposit' ? 'Deposit Submitted!' : 'Withdrawal Requested!'}
              </h4>
              <p className="completion-text">
                {activeTab === 'deposit'
                  ? 'Your deposit is being processed. Funds will be available shortly.'
                  : 'Your withdrawal request has been received and will be processed within 24 hours.'
                }
              </p>
              
              <div className="transaction-summary">
                <div className="summary-item">
                  <span className="summary-label">Transaction ID</span>
                  <span className="summary-value">
                    {activeTab === 'deposit' ? 'DEP' : 'WDR'}
                    -00{Math.floor(Math.random() * 1000)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Amount</span>
                  <span className="summary-value">${parsedAmount.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Status</span>
                  <span className="summary-value status-badge processing">
                    {activeTab === 'deposit' ? 'Processing' : 'Pending'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Estimated Completion</span>
                  <span className="summary-value">
                    {activeTab === 'deposit' ? '15-60 minutes' : '24 hours'}
                  </span>
                </div>
              </div>

              <div className="next-steps">
                <h5>📋 What to Expect:</h5>
                {activeTab === 'deposit' ? (
                  <ul>
                    <li>Balance will update automatically</li>
                    <li>You'll receive email confirmation</li>
                    <li>Funds available for investment immediately</li>
                    <li>Contact support if issues arise</li>
                  </ul>
                ) : (
                  <ul>
                    <li>You'll receive email updates</li>
                    <li>Track status in transaction history</li>
                    <li>Funds sent to your provided address</li>
                    <li>Customer support available 24/7</li>
                  </ul>
                )}
              </div>

              <div className="modal-actions single">
                <Button 
                  variant={activeTab === 'deposit' ? 'primary' : 'secondary'} 
                  onClick={handleTransactionComplete}
                >
                  {activeTab === 'deposit' ? 'View Balance' : 'Close'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Deposit;