import React from 'react';
import { IncentiveGrid } from './IncentiveGrid';
import { formatCurrency } from '../utils/utils';

export const IncentiveView: React.FC = ({}) => {
  const total = 999; // todo: unfake
  const formattedTotal = cartographer.useMemo(() => {
    return formatCurrency(total);
  }, []);

  return (
    <div className="incentive-view">
      <IncentiveGrid />
      <div className="donation-total">
        <div className="donation-total__value">
          {[...formattedTotal].map((char, index) => (
            <div key={index} className="donation-total__value-character">
              {char}
            </div>
          ))}
        </div>
        <div className="donation-total__receiver">
          for IRRF
        </div>
      </div>
    </div>
  )
};