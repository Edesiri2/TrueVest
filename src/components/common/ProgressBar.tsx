import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  striped?: boolean;
  showValue?: boolean;
  max?: number;
  min?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = false,
  color = 'primary',
  size = 'md',
  animated = false,
  striped = false,
  showValue = false,
  max = 100,
  min = 0
}) => {
  // Clamp value between min and max
  const clampedValue = Math.min(max, Math.max(min, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;
  
  // Color classes
  const colorClass = `progress-${color}`;
  const sizeClass = `progress-${size}`;
  
  // Animation classes
  const animationClass = animated ? 'progress-animated' : '';
  const stripeClass = striped ? 'progress-striped' : '';

  return (
    <div className={`progress-container ${sizeClass}`}>
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && (
            <span className="progress-percentage">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className="progress-track">
        <div 
          className={`progress-fill ${colorClass} ${animationClass} ${stripeClass}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label}
        >
          {showValue && (
            <span className="progress-value">
              {clampedValue}
            </span>
          )}
        </div>
      </div>
      
      {/* Optional min/max labels */}
      {(showValue && min !== 0 && max !== 100) && (
        <div className="progress-range">
          <span className="progress-min">{min}</span>
          <span className="progress-max">{max}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;