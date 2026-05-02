import React from 'react';
import classnames from 'classnames';
import { BUNDLE_NAME } from '../utils/utils';
import { useIncentiveRotation } from '../utils/incentiveRotation';


const IncentiveGridPip: React.FC<{ active?: boolean }> = React.memo(({ active }) => {
  const classes = classnames('incentive-grid-pip', {
    'incentive-grid-pip--active': active,
  });

  return <div className={classes} />;
});

export const IncentiveGrid: React.FC = ({}) => {
  const { canvas, state } = useIncentiveRotation();
  
  // cartographer.useEffect(() => {
  //   // drawBidwar('Favorite 12 character string?', [
  //   //   { name: 'ababababab', value: 2420 },
  //   //   { name: 'awaggaawagga', value: 1483 },
  //   //   { name: 'galoomba1234', value: 12 },
  //   // ]);
  //   // drawTarget('Upgrade to 13 Modelos%', 200, 480);
  //   drawBinaryBidwar('Make Mint drink a 14th Modelo', [
  //     { name: 'Yes', value: 1000 },
  //     { name: 'Yes but on the right', value: 2000 },
  //   ]);
  // }, []);

  return (
    <div className="incentive-grid">
      <div className="incentive-grid__canvas" style={canvas.gridStyle}>
        {canvas.grid.map((active, index) => (
          <IncentiveGridPip key={index} active={active} />
        ))}
      </div>
    </div>
  )
}