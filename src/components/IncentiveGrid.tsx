import React from 'react';
import { useIncentiveRotation } from '../utils/incentiveRotation';

export const IncentiveGrid: React.FC = ({}) => {
  const canvasRef = cartographer.useRef<HTMLCanvasElement>();
  const requestId = cartographer.useRef(0);
  const { canvas: incentiveCanvas } = useIncentiveRotation();

  cartographer.useEffect(() => {
    requestId.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < incentiveCanvas.internal.width; x += 1) {
        for (let y = 0; y < incentiveCanvas.internal.height; y += 1) {
          if (incentiveCanvas.internal.getPoint(x, y)) {
            ctx.fillStyle = "rgba(255, 122, 6, 1)";
          } else {
            ctx.fillStyle = "rgba(255, 122, 6, 0.1)";
          }
          
          ctx.fillRect(5 + x * 4, 1 + y * 4, 3, 3);
        }
      }
    });

    return () => {
      if (requestId.current) cancelAnimationFrame(requestId.current);
    };
  })

  return (
    <div className="incentive-grid">
      <canvas ref={canvasRef} className="incentive-grid__canvas" width={1275} height={110} />
    </div>
  )
}