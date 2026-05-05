import React from 'react';
import { useIncentiveRotation } from '../utils/incentiveRotation';
import { CanvasRenderer } from './CanvasRenderer';

export const IncentiveGrid: React.FC = ({}) => {
  const { canvas: incentiveCanvas } = useIncentiveRotation();

  return (
    <div className="incentive-grid">
      <CanvasRenderer
        canvas={incentiveCanvas.internal}
        className="incentive-grid__canvas"
        width={1275}
        height={110}
      />
    </div>
  )
}