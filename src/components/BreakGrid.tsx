import React from 'react';
import { IncentiveGrid } from './IncentiveGrid';
import { CanvasRenderer } from './CanvasRenderer';
import { BitmapCanvas } from '../utils/bitmapCanvas';
import { INCENTIVE_GRID_WIDTH } from '../utils/incentiveCanvas';
import { useOnMount } from '../utils/hooks';
import { ANIMATION_DELAY_MS } from '../utils/incentiveRotation';

export const BreakGrid: React.FC = () => {
  const songCanvas = cartographer.useRef(new BitmapCanvas(INCENTIVE_GRID_WIDTH, INCENTIVE_GRID_WIDTH));
  const updateIntervalId = cartographer.useRef<number | null>(null);
  const frame = cartographer.useRef(0);

  useOnMount(() => {
    function executeUpdate() {
      const canvas = songCanvas.current;
      canvas.blank();

      const songMessage = 'Now Playing: FINAL FANTASY XIV — Civilizations';
      const normalizedOffset = frame.current % (canvas.width + canvas.getStringWidth(songMessage));

      canvas.drawLine(0, 0, canvas.width, 0);
      canvas.drawString(songMessage, canvas.width - normalizedOffset, 10);
      frame.current += 1;
    }
  
    updateIntervalId.current = window.setInterval(executeUpdate,ANIMATION_DELAY_MS);
    executeUpdate();

    return () => {
      if (updateIntervalId.current) window.clearInterval(updateIntervalId.current);
    }
  });
  return (
    <div className="break-screen__grid-container">
      <IncentiveGrid />
      <CanvasRenderer
        canvas={songCanvas.current}
        className="break-screen__song-grid"
        width={1270}
        height={110}
      />
    </div>
  )
}