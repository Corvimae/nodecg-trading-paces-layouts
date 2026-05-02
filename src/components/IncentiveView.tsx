import React from 'react';
import { IncentiveGrid } from './IncentiveGrid';

export const IncentiveView: React.FC = ({}) => {
  return (
    <div className="incentive-view">
      <IncentiveGrid />
      <div className="donation-total">
        $00,000
      </div>
    </div>
  )
};