import React from 'react';
import { BitmapCanvas } from '../utils/bitmapCanvas';
import { useOnMount } from '../utils/hooks';

interface CanvasRendererProps {
  canvas: BitmapCanvas;
  className?: string;
  width: number;
  height: number;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  canvas: bitmapCanvas,
  className,
  width,
  height,
 }) => {
  const canvasRef = cartographer.useRef<HTMLCanvasElement>();
  const requestId = cartographer.useRef(0);

  const renderFrame = cartographer.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < bitmapCanvas.width; x += 1) {
      for (let y = 0; y < bitmapCanvas.height; y += 1) {
        if (bitmapCanvas.getPoint(x, y)) {
          ctx.fillStyle = "rgba(255, 122, 6, 1)";
        } else {
          ctx.fillStyle = "rgba(255, 122, 6, 0.1)";
        }
        
        ctx.fillRect(5 + x * 4, 1 + y * 4, 3, 3);
      }
    }

    requestId.current = requestAnimationFrame(renderFrame);
  }, [bitmapCanvas]);

  useOnMount(() => {
    renderFrame();

    return () => {
      if (requestId.current) cancelAnimationFrame(requestId.current);
    }
  });

  return (
    <canvas ref={canvasRef} className={className} width={width} height={height} />
  );
};