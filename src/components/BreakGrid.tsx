import React from 'react';
import { IncentiveGrid } from './IncentiveGrid';
import { CanvasRenderer } from './CanvasRenderer';
import { BitmapCanvas, BitmapCoordinate, DrawOpts } from '../utils/bitmapCanvas';
import { INCENTIVE_GRID_WIDTH } from '../utils/incentiveCanvas';
import { useOnMount } from '../utils/hooks';
import { ANIMATION_DELAY_MS } from '../utils/incentiveRotation';
import { SUPPLIMENTARIES_MODULE_NAME } from '../utils/utils';

function useBoundedMarquee(value: string, y: number, opts: DrawOpts) {
  const frame = cartographer.useRef(0);
  const currentValue = cartographer.useRef(value);
  const currentOpts = cartographer.useRef(opts);

  cartographer.useEffect(() => {
    if (currentValue.current !== value) {
      currentValue.current = value;
      frame.current = 0;
    }
  }, [value]);

  cartographer.useEffect(() => {
    if (currentOpts.current !== opts) {
      currentOpts.current = opts;
    }
  }, [opts]);

  return cartographer.useCallback((canvas: BitmapCanvas) => {
    const rightBound = currentOpts.current.bounds?.to.x ?? canvas.width;
    const leftBound = (currentOpts.current.bounds?.from.x ?? 0);
    const effectiveWidth = rightBound - leftBound;
    const stringWidth = canvas.getStringWidth(currentValue.current);
    const normalizedOffset = frame.current % (effectiveWidth + stringWidth);
    
    if (stringWidth < effectiveWidth) {
      canvas.drawString(currentValue.current, leftBound, y, currentOpts.current);
    } else {
      canvas.drawString(currentValue.current, rightBound - normalizedOffset, y, currentOpts.current);
    }

    frame.current += 1;
  }, [])
}

export const BreakGrid: React.FC = () => {
  const [nowPlaying] = cartographer.useReplicant<string>('foobar:nowPlaying', '', {
    namespace: SUPPLIMENTARIES_MODULE_NAME,
  });

  const [hostName] = cartographer.useReplicant<string>('host:name', '', {
    namespace: SUPPLIMENTARIES_MODULE_NAME,
  });
  
  const [hostPronouns] = cartographer.useReplicant<string>('host:pronouns', '', {
    namespace: SUPPLIMENTARIES_MODULE_NAME,
  });

  console.log(hostName, hostPronouns);
  const songCanvas = cartographer.useRef(new BitmapCanvas(INCENTIVE_GRID_WIDTH, INCENTIVE_GRID_WIDTH));
  const updateIntervalId = cartographer.useRef<number | null>(null);
  const frame = cartographer.useRef(0);
  const hostPronounsRef = cartographer.useRef('');

  const drawHostMarquee = useBoundedMarquee(hostName, 17, {
    bounds: {
      from: { x: 2, y: 5 },
      to: { x: 123 - songCanvas.current.getStringWidth(hostPronouns) - 6, y: songCanvas.current.height },
    }
  });

  const drawNowPlayingMarquee = useBoundedMarquee(nowPlaying.trim(), 17,  {
    bounds: {
      from: { x: 127, y: 0 },
      to: { x: songCanvas.current.width - 2, y: songCanvas.current.height },
    }
  });

  cartographer.useEffect(() => {
    hostPronounsRef.current = hostPronouns;
  }, [hostPronouns]);

  useOnMount(() => {
    function executeUpdate() {
      const canvas = songCanvas.current;
      canvas.blank();

      canvas.drawLine(0, 0, canvas.width, 0);

      // Separator
      canvas.drawLine(125, 0, 125, canvas.height);
      
      // Host label
      const hostLabel = 'Your host is:';
      canvas.drawFilledRect(2, 2, 123, 10);
      canvas.drawString(hostLabel, 4, 3, { inverse: true });

      // Host pronouns
      const pronounsWidth = canvas.getStringWidth(hostPronounsRef.current);
      canvas.drawFilledRect(125 - pronounsWidth - 5, 16, 123, 24);
      canvas.drawString(hostPronounsRef.current, 122 - pronounsWidth, 17, { inverse: true });

      // Now playing label
      const nowPlayingLabel = 'Now playing:';
      canvas.drawFilledRect(127, 2, canvas.width - 2, 10);
      canvas.drawString(nowPlayingLabel, 129, 3, { inverse: true });

      drawHostMarquee(canvas);

      drawNowPlayingMarquee(canvas);

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