import React, { useState } from 'react';
import './Loan.css';

// Common components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressBar from '../components/common/ProgressBar';

const Loan: React.FC = () => {
  // State for loan form
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [loanPurpose, setLoanPurpose] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<number>(12); // months
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasPaidFee, setHasPaidFee] = useState<boolean>(false);
  const [uploadedProof, setUploadedProof] = useState<File | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<'TRC20' | 'BTC'>('TRC20');

  // Constants
  const MAX_LOAN_AMOUNT = 5000000; // $5M
  const MIN_LOAN_AMOUNT = 1000; // $1K
  const PROCESSING_FEE_PERCENTAGE = 2.5; // 2.5% processing fee
  const LOAN_TERMS = [3, 6, 12, 24]; // months

  // Mock wallet addresses
  const WALLET_ADDRESSES = {
    TRC20: 'TXYZ1234567890abcdefghijklmnopqrstuvw',
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
  };

  // Calculate processing fee
  const calculateProcessingFee = (amount: number): number => {
    const fee = amount * (PROCESSING_FEE_PERCENTAGE / 100);
    // Minimum fee of $50, maximum of $5000
    return Math.max(50, Math.min(fee, 5000));
  };

  const parsedAmount = parseFloat(loanAmount) || 0;
  const processingFee = calculateProcessingFee(parsedAmount);
  const totalRequired = parsedAmount + processingFee;

  // Loan eligibility mock data
  const loanEligibility = {
    maxAmount: 5000000,
    creditScore: 720,
    approvalRate: 85,
    processingTime: '24-48 hours',
    successRate: 98
  };

  // Recent loan requests (mock)
  const recentLoans = [
    { id: 'LN-001', amount: 25000, purpose: 'Business Expansion', status: 'Approved', date: '2 days ago', feePaid: true },
    { id: 'LN-002', amount: 10000, purpose: 'Home Renovation', status: 'Processing', date: '1 week ago', feePaid: true },
    { id: 'LN-003', amount: 50000, purpose: 'Investment Capital', status: 'Pending Fee', date: '2 weeks ago', feePaid: false },
    { id: 'LN-004', amount: 15000, purpose: 'Medical Emergency', status: 'Completed', date: '1 month ago', feePaid: true }
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount < MIN_LOAN_AMOUNT || parsedAmount > MAX_LOAN_AMOUNT) {
      alert(`Loan amount must be between $${MIN_LOAN_AMOUNT.toLocaleString()} and $${MAX_LOAN_AMOUNT.toLocaleString()}`);
      return;
    }
    setCurrentStep(2);
    setIsModalOpen(true);
  };

  // Handle fee payment confirmation
  const handleFeePayment = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setHasPaidFee(true);
      setIsProcessing(false);
      setCurrentStep(3);
    }, 2000);
  };

  // Handle proof upload
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedProof(file);
    }
  };

  // Handle loan application submission
  const handleLoanApplication = () => {
    setCurrentStep(4);
    // Reset after 3 seconds
    setTimeout(() => {
      setIsModalOpen(false);
      setCurrentStep(1);
      setLoanAmount('');
      setLoanPurpose('');
      setHasPaidFee(false);
      setUploadedProof(null);
    }, 3000);
  };

  // Quick loan amount buttons
  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  return (
    <div className="loan">
      {/* Page Header */}
      <div className="loan-header">
        <div className="header-content">
          <div>
            <h2 className="page-title">Loan Request</h2>
            <p className="page-subtitle">Get up to $5M instantly. Fast approval guaranteed!</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">98%</span>
              <span className="stat-label">Approval Rate</span>
            </div>
            <div className="stat">
              <span className="stat-value">24h</span>
              <span className="stat-label">Processing</span>
            </div>
            <div className="stat">
              <span className="stat-value">$5M</span>
              <span className="stat-label">Max Amount</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="loan-content">
        {/* Left Column - Loan Calculator & Form */}
        <div className="loan-left">
          {/* Urgency Banner */}
          <Card className="urgency-banner">
            <div className="banner-content">
              <div className="urgency-badge">⚡ LIMITED TIME OFFER</div>
              <h3 className="urgency-title">No Credit Check Required!</h3>
              <p className="urgency-text">
                Apply now and get <strong>2.5% lower processing fee</strong> for the first 50 applicants today.
                <span className="remaining-count"> Only 27 spots left!</span>
              </p>
            </div>
          </Card>

          {/* Loan Calculator Card */}
          <Card className="loan-calculator">
            <div className="calculator-header">
              <h3 className="calculator-title">💸 Loan Calculator</h3>
              <div className="calculator-badge">Real-time</div>
            </div>

            <form onSubmit={handleSubmit} className="loan-form">
              {/* Amount Input */}
              <div className="form-group">
                <label className="form-label">
                  Loan Amount
                  <span className="amount-range">
                    ${MIN_LOAN_AMOUNT.toLocaleString()} - ${MAX_LOAN_AMOUNT.toLocaleString()}
                  </span>
                </label>
                <div className="amount-input-container">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    className="amount-input"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    min={MIN_LOAN_AMOUNT}
                    max={MAX_LOAN_AMOUNT}
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
                      onClick={() => setLoanAmount(amount.toString())}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Term */}
              <div className="form-group">
                <label className="form-label">Loan Term (Months)</label>
                <div className="term-options">
                  {LOAN_TERMS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className={`term-option ${loanTerm === term ? 'active' : ''}`}
                      onClick={() => setLoanTerm(term)}
                    >
                      {term} months
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Purpose */}
              <div className="form-group">
                <label className="form-label">Loan Purpose (Optional)</label>
                <select
                  className="purpose-select"
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                >
                  <option value="">Select a purpose</option>
                  <option value="Business">Business Expansion</option>
                  <option value="Personal">Personal Use</option>
                  <option value="Emergency">Emergency Funds</option>
                  <option value="Investment">Investment Capital</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical Expenses</option>
                  <option value="Home">Home Renovation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Fee Summary */}
              <Card className="fee-summary">
                <div className="summary-row">
                  <span className="summary-label">Loan Amount</span>
                  <span className="summary-value">
                    {parsedAmount > 0 ? `$${parsedAmount.toLocaleString()}` : '$0'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">
                    Processing Fee ({PROCESSING_FEE_PERCENTAGE}%)
                    <span className="fee-note">*Required upfront</span>
                  </span>
                  <span className="summary-value fee-amount">
                    ${processingFee.toLocaleString()}
                  </span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">Total Required</span>
                  <span className="summary-value total-amount">
                    ${totalRequired.toLocaleString()}
                  </span>
                </div>
              </Card>

              {/* CTA Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={parsedAmount < MIN_LOAN_AMOUNT}
              >
                🚀 Request Loan Now
              </Button>

              <p className="form-note">
                ⚡ <strong>Instant approval</strong> after fee payment. 
                <span className="warning"> No hidden charges!</span>
              </p>
            </form>
          </Card>
        </div>

        {/* Right Column - Benefits & Recent Loans */}
        <div className="loan-right">
          {/* Benefits Card */}
          <Card className="benefits-card">
            <h3 className="benefits-title">✅ Why Choose Truvest Loans?</h3>
            <ul className="benefits-list">
              <li className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <div>
                  <strong>Instant Processing</strong>
                  <p>Get decision within 24-48 hours</p>
                </div>
              </li>
              <li className="benefit-item">
                <span className="benefit-icon">🔒</span>
                <div>
                  <strong>No Credit Check</strong>
                  <p>Your credit score doesn't matter</p>
                </div>
              </li>
              <li className="benefit-item">
                <span className="benefit-icon">💎</span>
                <div>
                  <strong>Up to $5M</strong>
                  <p>Large amounts available</p>
                </div>
              </li>
              <li className="benefit-item">
                <span className="benefit-icon">🌍</span>
                <div>
                  <strong>Global Access</strong>
                  <p>Available worldwide</p>
                </div>
              </li>
              <li className="benefit-item">
                <span className="benefit-icon">🔄</span>
                <div>
                  <strong>Simple Process</strong>
                  <p>Only 3 steps to complete</p>
                </div>
              </li>
              <li className="benefit-item">
                <span className="benefit-icon">📱</span>
                <div>
                  <strong>Mobile Friendly</strong>
                  <p>Apply from anywhere</p>
                </div>
              </li>
            </ul>
          </Card>

          {/* Recent Loans Card */}
          <Card className="recent-loans">
            <div className="section-header">
              <h3 className="section-title">Recent Loan Requests</h3>
              <Button variant="ghost" size="sm">View All →</Button>
            </div>
            
            <div className="loans-list">
              {recentLoans.map((loan) => (
                <div key={loan.id} className="loan-item">
                  <div className="loan-info">
                    <div className="loan-id">{loan.id}</div>
                    <div className="loan-details">
                      <div className="loan-purpose">{loan.purpose}</div>
                      <div className="loan-amount">${loan.amount.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="loan-status">
                    <span className={`status-badge ${loan.status.toLowerCase().replace(' ', '-')}`}>
                      {loan.status}
                    </span>
                    <div className="loan-date">{loan.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trust Banner */}
          <Card className="trust-banner">
            <div className="trust-content">
              <h4 className="trust-title">🔐 Your Security is Our Priority</h4>
              <p className="trust-text">
                All transactions are secured with bank-level encryption. 
                Your data is never shared with third parties.
              </p>
              <div className="trust-badges">
                <span className="trust-badge">256-bit SSL</span>
                <span className="trust-badge">PCI DSS</span>
                <span className="trust-badge">GDPR Compliant</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Fee Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pay Processing Fee"
        size="lg"
      >
        <div className="modal-steps">
          <ProgressBar 
            value={currentStep * 25} 
            label={`Step ${currentStep} of 4`}
            color="primary"
            showPercentage
          />
          
          <div className="step-indicators">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Review</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Pay Fee</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Verify</div>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Complete</div>
            </div>
          </div>
        </div>

        {/* Step 1: Review Loan Details */}
        {currentStep === 1 && (
          <div className="modal-step-content">
            <div className="loan-review">
              <h4 className="review-title">Review Your Loan Request</h4>
              
              <div className="review-details">
                <div className="detail-row">
                  <span className="detail-label">Loan Amount</span>
                  <span className="detail-value">${parsedAmount.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Loan Term</span>
                  <span className="detail-value">{loanTerm} months</span>
                </div>
                {loanPurpose && (
                  <div className="detail-row">
                    <span className="detail-label">Purpose</span>
                    <span className="detail-value">{loanPurpose}</span>
                  </div>
                )}
                <div className="detail-row fee-row">
                  <span className="detail-label">
                    Processing Fee
                    <span className="fee-warning">*Must be paid upfront</span>
                  </span>
                  <span className="detail-value fee-highlight">${processingFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="review-note">
                <p>⚠️ <strong>Important:</strong> Your loan application will only be processed after the fee payment is confirmed.</p>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Fee Payment */}
        {currentStep === 2 && (
          <div className="modal-step-content">
            <div className="payment-step">
              <h4 className="payment-title">Pay Processing Fee</h4>
              <p className="payment-subtitle">Send ${processingFee.toLocaleString()} to one of the wallets below</p>
              
              <div className="wallet-options">
                <div className="wallet-selector">
                  <button
                    className={`wallet-option ${selectedWallet === 'TRC20' ? 'active' : ''}`}
                    onClick={() => setSelectedWallet('TRC20')}
                  >
                    <span className="wallet-icon">🔄</span>
                    <span className="wallet-name">TRC-20 (USDT)</span>
                    <span className="wallet-fee">Network Fee: $1</span>
                  </button>
                  <button
                    className={`wallet-option ${selectedWallet === 'BTC' ? 'active' : ''}`}
                    onClick={() => setSelectedWallet('BTC')}
                  >
                    <span className="wallet-icon">₿</span>
                    <span className="wallet-name">Bitcoin (BTC)</span>
                    <span className="wallet-fee">Network Fee: $5-10</span>
                  </button>
                </div>

                <div className="wallet-address-card">
                  <div className="address-header">
                    <span className="address-label">Send exact amount to:</span>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(WALLET_ADDRESSES[selectedWallet])}>
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

                  <div className="payment-instructions">
                    <h5>📝 Instructions:</h5>
                    <ol>
                      <li>Send <strong>exactly ${processingFee.toLocaleString()}</strong> to the address above</li>
                      <li>Wait for 3 network confirmations</li>
                      <li>Upload transaction proof in the next step</li>
                      <li>Your loan will be processed within 24 hours</li>
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
                  onClick={handleFeePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'I Have Sent Payment'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Upload Proof */}
        {currentStep === 3 && (
          <div className="modal-step-content">
            <div className="verification-step">
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h4 className="success-title">Payment Received!</h4>
                <p className="success-text">Now verify your transaction to proceed</p>
              </div>

              <div className="proof-upload">
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
                        className="remove-file"
                        onClick={() => setUploadedProof(null)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">📤</div>
                      <h5 className="upload-title">Upload Transaction Proof</h5>
                      <p className="upload-text">
                        Upload screenshot of your crypto transaction
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

                <div className="upload-note">
                  <p>⚠️ Accepted formats: PNG, JPG, PDF (max 5MB)</p>
                </div>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleLoanApplication}
                  disabled={!uploadedProof}
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Completion */}
        {currentStep === 4 && (
          <div className="modal-step-content">
            <div className="completion-step">
              <div className="completion-icon">🎉</div>
              <h4 className="completion-title">Application Submitted!</h4>
              <p className="completion-text">
                Your loan request is now under review. You'll receive an update within 24-48 hours.
              </p>
              
              <div className="application-summary">
                <div className="summary-item">
                  <span className="summary-label">Application ID</span>
                  <span className="summary-value">LN-00{Math.floor(Math.random() * 1000)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Loan Amount</span>
                  <span className="summary-value">${parsedAmount.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Status</span>
                  <span className="summary-value status-badge processing">Under Review</span>
                </div>
              </div>

              <div className="next-steps">
                <h5>📋 Next Steps:</h5>
                <ul>
                  <li>Check your email for confirmation</li>
                  <li>Track status in your dashboard</li>
                  <li>Customer support available 24/7</li>
                </ul>
              </div>

              <div className="modal-actions single">
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Loan;