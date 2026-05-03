import React from 'react';
import { IncentiveGrid } from './IncentiveGrid';
import { DonationTotal } from './DonationTotal';

export const IncentiveView: React.FC = ({}) => (
  <div className="incentive-view">
    <IncentiveGrid />
    <div className="donation-total">
      <DonationTotal />
      <div className="donation-total__receiver">
        for IRRF
      </div>
    </div>
  </div>
);