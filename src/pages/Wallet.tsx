import React, { useState } from 'react';
import './Wallet.css';

// Common components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressBar from '../components/common/ProgressBar';

const Wallet: React.FC = () => {
  // State for wallet operations
  const [activeTab, setActiveTab] = useState<'addresses' | 'transactions' | 'verify'>('addresses');
  const [selectedCurrency, setSelectedCurrency] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');
  const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<string>('');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [uploadedProof, setUploadedProof] = useState<File | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<string>('');

  // Mock wallet data
  const walletData = {
    totalReceived: 45000.00,
    totalFees: 1250.00,
    pendingVerifications: 3,
    verifiedTransactions: 42,
    successRate: 98.5
  };

  // Wallet addresses
  const walletAddresses = {
    USDT: {
      network: 'TRC-20',
      address: 'TXYZ1234567890abcdefghijklmnopqrstuvw',
      qrCode: 'USDT_QR_CODE',
      memoRequired: true,
      memo: 'TRUVEST12345',
      networkFee: '$1',
      minAmount: 10,
      maxAmount: 50000
    },
    BTC: {
      network: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      qrCode: 'BTC_QR_CODE',
      memoRequired: false,
      networkFee: '$5-15',
      minAmount: 50,
      maxAmount: 100000
    },
    ETH: {
      network: 'ERC-20',
      address: '0x742d35Cc6634C0532925a3b844Bc9e',
      qrCode: 'ETH_QR_CODE',
      memoRequired: true,
      memo: 'TRUVEST_ETH',
      networkFee: '$3-10',
      minAmount: 20,
      maxAmount: 75000
    }
  };

  // Recent transactions (mock)
  const recentTransactions = [
    { 
      id: 'TXN-001', 
      type: 'Loan Fee', 
      amount: 250, 
      currency: 'USDT', 
      status: 'Verified', 
      date: '2 hours ago', 
      hash: '0x123...abc',
      confirmations: 12
    },
    { 
      id: 'TXN-002', 
      type: 'Investment Deposit', 
      amount: 5000, 
      currency: 'BTC', 
      status: 'Pending', 
      date: '1 day ago', 
      hash: '0x456...def',
      confirmations: 2
    },
    { 
      id: 'TXN-003', 
      type: 'Withdrawal Fee', 
      amount: 150, 
      currency: 'USDT', 
      status: 'Failed', 
      date: '3 days ago', 
      hash: '0x789...ghi',
      confirmations: 0
    },
    { 
      id: 'TXN-004', 
      type: 'Loan Fee', 
      amount: 1000, 
      currency: 'ETH', 
      status: 'Verified', 
      date: '1 week ago', 
      hash: '0xabc...123',
      confirmations: 45
    },
    { 
      id: 'TXN-005', 
      type: 'Investment Deposit', 
      amount: 25000, 
      currency: 'USDT', 
      status: 'Processing', 
      date: '2 weeks ago', 
      hash: '0xdef...456',
      confirmations: 6
    }
  ];

  // Pending verifications (mock)
  const pendingVerifications = [
    { id: 'PV-001', type: 'Loan Fee', amount: 500, currency: 'USDT', date: '1 hour ago', expires: '23:59' },
    { id: 'PV-002', type: 'Investment', amount: 2500, currency: 'BTC', date: '5 hours ago', expires: '19:30' },
    { id: 'PV-003', type: 'Withdrawal Fee', amount: 75, currency: 'USDT', date: '12 hours ago', expires: '12:00' }
  ];

  // Handle address copy
  const handleCopyAddress = (address: string, currency: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(currency);
    setIsCopyModalOpen(true);
    setTimeout(() => setIsCopyModalOpen(false), 2000);
  };

  // Handle proof upload
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedProof(file);
    }
  };

  // Handle verification submission
  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionHash || !amountPaid || !uploadedProof) {
      alert('Please fill all required fields');
      return;
    }
    setVerificationStep(2);
    setTimeout(() => {
      setVerificationStep(3);
    }, 2000);
  };

  // Handle verification completion
  const handleVerificationComplete = () => {
    setIsVerifyModalOpen(false);
    setVerificationStep(1);
    setTransactionHash('');
    setAmountPaid('');
    setUploadedProof(null);
  };

  // Currency options
  const currencyOptions = [
    { id: 'USDT', name: 'USDT (TRC-20)', icon: '💎', color: '#26a17b' },
    { id: 'BTC', name: 'Bitcoin', icon: '₿', color: '#f7931a' },
    { id: 'ETH', name: 'Ethereum', icon: '⚡', color: '#627eea' }
  ];

  // Get selected wallet
  const selectedWallet = walletAddresses[selectedCurrency];

  return (
    <div className="wallet">
      {/* Page Header */}
      <div className="wallet-header">
        <div className="header-content">
          <div>
            <h2 className="page-title">Wallet Integration</h2>
            <p className="page-subtitle">Secure crypto payments for all transactions</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">${walletData.totalReceived.toLocaleString()}</span>
              <span className="stat-label">Total Received</span>
            </div>
            <div className="stat">
              <span className="stat-value">{walletData.verifiedTransactions}</span>
              <span className="stat-label">Verified</span>
            </div>
            <div className="stat">
              <span className="stat-value">{walletData.successRate}%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="wallet-content">
        {/* Left Column - Wallet Addresses & Info */}
        <div className="wallet-left">
          {/* Security Banner */}
          <Card className="security-banner">
            <div className="security-content">
              <div className="security-badge">🔐 SECURE WALLET</div>
              <h3 className="security-title">Your Funds Are Protected</h3>
              <p className="security-text">
                All wallet addresses are generated with multi-signature security and stored in cold storage.
              </p>
              <div className="security-features">
                <div className="feature">
                  <span className="feature-icon">❄️</span>
                  <span className="feature-text">Cold Storage</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔑</span>
                  <span className="feature-text">Multi-Sig</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🛡️</span>
                  <span className="feature-text">Insurance</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">👁️</span>
                  <span className="feature-text">24/7 Monitoring</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Currency Selection */}
          <Card className="currency-selection">
            <h3 className="selection-title">Select Currency</h3>
            <div className="currency-options">
              {currencyOptions.map((currency) => (
                <button
                  key={currency.id}
                  className={`currency-option ${selectedCurrency === currency.id ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency(currency.id as any)}
                  style={{ borderColor: selectedCurrency === currency.id ? currency.color : 'transparent' }}
                >
                  <div className="currency-icon" style={{ backgroundColor: currency.color }}>
                    {currency.icon}
                  </div>
                  <span className="currency-name">{currency.name}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Wallet Address Card */}
          <Card className="wallet-address-card">
            <div className="address-header">
              <div className="address-title">
                <h3 className="title">{selectedWallet.network} Address</h3>
                <div className="network-badge">{selectedWallet.network}</div>
              </div>
              <div className="address-stats">
                <div className="stat">
                  <span className="stat-label">Min Amount</span>
                  <span className="stat-value">${selectedWallet.minAmount}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Network Fee</span>
                  <span className="stat-value">{selectedWallet.networkFee}</span>
                </div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="qr-code-section">
              <div className="qr-code-container">
                <div className="qr-code">
                  <div className="qr-grid">
                    {/* QR code pattern simulation */}
                    <div className="qr-pattern top-left"></div>
                    <div className="qr-pattern top-right"></div>
                    <div className="qr-pattern bottom-left"></div>
                    <div className="qr-dots"></div>
                  </div>
                  <div className="qr-overlay">
                    <div className="qr-currency">{selectedCurrency}</div>
                    <div className="qr-label">Scan to Pay</div>
                  </div>
                </div>
                <div className="qr-instructions">
                  <h4>📱 How to Pay:</h4>
                  <ol>
                    <li>Open your crypto wallet</li>
                    <li>Scan QR code or copy address</li>
                    <li>Send exact amount required</li>
                    <li>Include memo if required</li>
                    <li>Wait for confirmations</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Address Display */}
            <div className="address-display">
              <div className="address-label">Wallet Address:</div>
              <div className="address-value" onClick={() => handleCopyAddress(selectedWallet.address, selectedCurrency)}>
                <code>{selectedWallet.address}</code>
                <button className="copy-button" aria-label="Copy address">
                  📋
                </button>
              </div>
              
              {selectedWallet.memoRequired && (
                <div className="memo-section">
                  <div className="memo-label">Memo / Tag (Required):</div>
                  <div className="memo-value" onClick={() => navigator.clipboard.writeText(selectedWallet.memo!)}>
                    <code>{selectedWallet.memo}</code>
                    <button className="copy-button" aria-label="Copy memo">
                      📋
                    </button>
                  </div>
                  <div className="memo-note">
                    ⚠️ <strong>Important:</strong> Include this memo or your transaction may be lost!
                  </div>
                </div>
              )}

              <div className="address-actions">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handleCopyAddress(selectedWallet.address, selectedCurrency)}
                >
                  📋 Copy Address
                </Button>
                {selectedWallet.memoRequired && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigator.clipboard.writeText(selectedWallet.memo!)}
                  >
                    📝 Copy Memo
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsVerifyModalOpen(true)}
                >
                  ✅ Verify Payment
                </Button>
              </div>
            </div>

            {/* Important Notes */}
            <div className="important-notes">
              <h4>📋 Important Notes:</h4>
              <ul>
                <li>Send only {selectedCurrency} to this address</li>
                <li>Minimum deposit: ${selectedWallet.minAmount}</li>
                <li>Network fee: {selectedWallet.networkFee} will be deducted</li>
                <li>Transactions require 3+ confirmations</li>
                <li>Contact support if funds don't appear within 2 hours</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Right Column - Transactions & Tabs */}
        <div className="wallet-right">
          {/* Tabs Navigation */}
          <Card className="wallet-tabs">
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <span className="tab-icon">👛</span>
                Wallet Addresses
              </button>
              <button
                className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveTab('transactions')}
              >
                <span className="tab-icon">📊</span>
                Transactions
                {walletData.pendingVerifications > 0 && (
                  <span className="tab-badge">{walletData.pendingVerifications}</span>
                )}
              </button>
              <button
                className={`tab-button ${activeTab === 'verify' ? 'active' : ''}`}
                onClick={() => setActiveTab('verify')}
              >
                <span className="tab-icon">✅</span>
                Verify Payment
              </button>
            </div>
          </Card>

          {/* Tab Content */}
          {activeTab === 'addresses' ? (
            <Card className="addresses-tab">
              <h3 className="tab-title">All Wallet Addresses</h3>
              <div className="addresses-grid">
                {currencyOptions.map((currency) => {
                  const wallet = walletAddresses[currency.id as keyof typeof walletAddresses];
                  return (
                    <div key={currency.id} className="address-card">
                      <div className="card-header">
                        <div className="currency-info">
                          <div className="currency-icon-small" style={{ backgroundColor: currency.color }}>
                            {currency.icon}
                          </div>
                          <div>
                            <h4 className="currency-name">{currency.name}</h4>
                            <div className="network">{wallet.network}</div>
                          </div>
                        </div>
                        <div className="card-badge">Active</div>
                      </div>
                      <div className="card-address">
                        <code>{wallet.address.substring(0, 20)}...{wallet.address.substring(wallet.address.length - 10)}</code>
                      </div>
                      <div className="card-details">
                        <div className="detail">
                          <span className="detail-label">Min Amount</span>
                          <span className="detail-value">${wallet.minAmount}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Network Fee</span>
                          <span className="detail-value">{wallet.networkFee}</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCurrency(currency.id as any);
                            handleCopyAddress(wallet.address, currency.id);
                          }}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCurrency(currency.id as any)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : activeTab === 'transactions' ? (
            <Card className="transactions-tab">
              <div className="tab-header">
                <h3 className="tab-title">Recent Transactions</h3>
                <div className="tab-filters">
                  <select className="filter-select">
                    <option value="all">All Transactions</option>
                    <option value="verified">Verified Only</option>
                    <option value="pending">Pending Only</option>
                  </select>
                </div>
              </div>
              
              <div className="transactions-list">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.type.includes('Fee') ? '💰' : '📥'}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-header">
                        <div>
                          <span className="transaction-type">{transaction.type}</span>
                          <span className="transaction-currency">{transaction.currency}</span>
                        </div>
                        <span className={`transaction-status ${transaction.status.toLowerCase()}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="transaction-footer">
                        <div className="transaction-hash" title={transaction.hash}>
                          {transaction.hash.substring(0, 20)}...
                        </div>
                        <div className="transaction-info">
                          <span className="transaction-amount">${transaction.amount.toLocaleString()}</span>
                          <span className="transaction-confirmations">
                            {transaction.confirmations} conf
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="transaction-date">{transaction.date}</div>
                  </div>
                ))}
              </div>

              {/* Pending Verifications */}
              {walletData.pendingVerifications > 0 && (
                <div className="pending-verifications">
                  <h4 className="pending-title">⏳ Pending Verification</h4>
                  <div className="pending-list">
                    {pendingVerifications.map((verification) => (
                      <div key={verification.id} className="pending-item">
                        <div className="pending-info">
                          <span className="pending-type">{verification.type}</span>
                          <span className="pending-amount">${verification.amount}</span>
                          <span className="pending-currency">{verification.currency}</span>
                        </div>
                        <div className="pending-actions">
                          <span className="pending-expires">Expires: {verification.expires}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsVerifyModalOpen(true)}
                          >
                            Verify Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="verify-tab">
              <h3 className="tab-title">Verify Payment</h3>
              <p className="tab-subtitle">
                Upload proof of payment to verify your transaction
              </p>

              <div className="verification-steps">
                <div className="verification-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4 className="step-title">Make Payment</h4>
                    <p className="step-description">
                      Send exact amount to the wallet address shown
                    </p>
                  </div>
                </div>
                <div className="verification-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4 className="step-title">Get Transaction Hash</h4>
                    <p className="step-description">
                      Copy the transaction ID/hash from your wallet
                    </p>
                  </div>
                </div>
                <div className="verification-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4 className="step-title">Upload Proof</h4>
                    <p className="step-description">
                      Upload screenshot of successful transaction
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setIsVerifyModalOpen(true)}
              >
                🚀 Start Verification
              </Button>

              <div className="verification-tips">
                <h4>💡 Tips for Faster Verification:</h4>
                <ul>
                  <li>Ensure transaction has 3+ confirmations</li>
                  <li>Include memo if required</li>
                  <li>Upload clear screenshot</li>
                  <li>Double-check transaction amount</li>
                  <li>Verification takes 15-60 minutes</li>
                </ul>
              </div>
            </Card>
          )}

          {/* Support & Info Cards */}
          <Card className="support-card">
            <div className="support-content">
              <h4 className="support-title">💬 Need Help with Payment?</h4>
              <p className="support-text">
                Our support team is available 24/7 to assist with any payment issues.
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
                  <span className="info-label">Avg Response</span>
                  <span className="info-value">Less than 1 minutes</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Verification Time</span>
                  <span className="info-value">15-60 min</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Network Status */}
          <Card className="network-status">
            <div className="status-header">
              <h4 className="status-title">🌐 Network Status</h4>
              <div className="status-indicator online">All Systems Operational</div>
            </div>
            <div className="status-list">
              <div className="status-item">
                <span className="status-name">TRC-20 Network</span>
                <span className="status-value online">Normal</span>
              </div>
              <div className="status-item">
                <span className="status-name">Bitcoin Network</span>
                <span className="status-value online">Normal</span>
              </div>
              <div className="status-item">
                <span className="status-name">Ethereum Network</span>
                <span className="status-value warning">High Congestion</span>
              </div>
              <div className="status-item">
                <span className="status-name">Verification System</span>
                <span className="status-value online">Operational</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Copy Success Modal */}
      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        size="sm"
      >
        <div className="copy-success-modal">
          <div className="success-icon">✅</div>
          <h4 className="success-title">Address Copied!</h4>
          <p className="success-text">
            {copiedAddress} address copied to clipboard
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCopyModalOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>

      {/* Verification Modal */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Verify Payment"
        size="lg"
      >
        <div className="verification-modal">
          <div className="modal-steps">
            <ProgressBar 
              value={verificationStep * 50} 
              label={`Step ${verificationStep} of 2`}
              color="success"
              showPercentage
              animated
            />
          </div>

          {verificationStep === 1 && (
            <div className="verification-form">
              <h4 className="form-title">Enter Payment Details</h4>
              
              <form onSubmit={handleVerificationSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Transaction Hash / ID
                    <span className="label-note">(From your wallet)</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Amount Paid
                    <span className="label-note">(Exact amount sent)</span>
                  </label>
                  <div className="amount-input-container">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      className="form-input"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <div className="currency-options-small">
                    {currencyOptions.map((currency) => (
                      <button
                        key={currency.id}
                        type="button"
                        className={`currency-option-small ${selectedCurrency === currency.id ? 'active' : ''}`}
                        onClick={() => setSelectedCurrency(currency.id as any)}
                      >
                        <span className="option-icon">{currency.icon}</span>
                        <span className="option-name">{currency.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Upload Proof
                    <span className="label-note">(Screenshot of transaction)</span>
                  </label>
                  <div className="upload-area">
                    {uploadedProof ? (
                      <div className="upload-preview">
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                          <div className="file-name">{uploadedProof.name}</div>
                          <div className="file-size">
                            {(uploadedProof.size / 1024).toFixed(2)} KB
                          </div>
                        </div>
                        <button 
                          type="button"
                          className="remove-file"
                          onClick={() => setUploadedProof(null)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="upload-icon">📤</div>
                        <p className="upload-text">
                          Drag & drop or click to upload
                        </p>
                        <input
                          type="file"
                          id="proof-upload"
                          className="upload-input"
                          onChange={handleProofUpload}
                          accept="image/*,.pdf"
                          required
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

                <div className="verification-notes">
                  <h5>📋 Verification Notes:</h5>
                  <ul>
                    <li>Ensure transaction has 3+ confirmations</li>
                    <li>Double-check transaction hash</li>
                    <li>Upload clear screenshot showing amount and hash</li>
                    <li>Verification takes 15-60 minutes</li>
                    <li>You'll receive email confirmation</li>
                  </ul>
                </div>

                <div className="modal-actions">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsVerifyModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!transactionHash || !amountPaid || !uploadedProof}
                  >
                    Submit Verification
                  </Button>
                </div>
              </form>
            </div>
          )}

          {verificationStep === 2 && (
            <div className="verification-processing">
              <div className="processing-icon">⏳</div>
              <h4 className="processing-title">Processing Verification</h4>
              <p className="processing-text">
                Checking transaction details and confirmations...
              </p>
              <ProgressBar 
                value={75}
                label="Verifying Transaction"
                color="primary"
                animated
                striped
              />
            </div>
          )}

          {verificationStep === 3 && (
            <div className="verification-success">
              <div className="success-icon">✅</div>
              <h4 className="success-title">Verification Submitted!</h4>
              <p className="success-text">
                Your payment verification has been submitted successfully.
              </p>
              
              <div className="verification-summary">
                <div className="summary-item">
                  <span className="summary-label">Transaction ID</span>
                  <span className="summary-value">VER-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Amount</span>
                  <span className="summary-value">${parseFloat(amountPaid).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Currency</span>
                  <span className="summary-value">{selectedCurrency}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Status</span>
                  <span className="summary-value status-badge processing">Under Review</span>
                </div>
              </div>

              <div className="next-steps">
                <h5>📋 What's Next:</h5>
                <ul>
                  <li>Check your email for confirmation</li>
                  <li>Verification takes 15-60 minutes</li>
                  <li>Track status in transaction history</li>
                  <li>Contact support if issues arise</li>
                </ul>
              </div>

              <div className="modal-actions single">
                <Button
                  variant="primary"
                  onClick={handleVerificationComplete}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;