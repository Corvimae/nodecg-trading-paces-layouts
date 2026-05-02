import React from 'react';
import classnames from 'classnames';
import { BitmapCanvas } from '../utils/bitmapCanvas';

const GRID_WIDTH = 157;
const GRID_HEIGHT = 13;

const GRID_STYLE = { gridTemplateColumns: `repeat(${GRID_WIDTH}, max-content)`};

const TestPattern = new BitmapCanvas(GRID_WIDTH, GRID_HEIGHT);

TestPattern.drawLine(0, 0, 30, 10);
TestPattern.drawFilledRect(1, 6, 121, 11);

const IncentiveGridPip: React.FC<{ active?: boolean }> = ({ active }) => {
  const classes = classnames('incentive-grid-pip', {
    'incentive-grid-pip--active': active,
  });

  return <div className={classes} />;
}

export const IncentiveGrid: React.FC = ({}) => {
  return (
    <div className="incentive-grid" style={GRID_STYLE}>
      {TestPattern.points.map((active, index) => (
        <IncentiveGridPip key={index} active={active} />
      ))}
    </div>
  )
}