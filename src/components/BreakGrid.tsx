import React from 'react';
import { IncentiveGrid } from './IncentiveGrid';
import { CanvasRenderer } from './CanvasRenderer';
import { BitmapCanvas, DrawOpts } from '../utils/bitmapCanvas';
import { INCENTIVE_GRID_WIDTH } from '../utils/incentiveCanvas';
import { useOnMount } from '../utils/hooks';
import { ANIMATION_DELAY_MS } from '../utils/incentiveRotation';
import { SUPPLEMENTARIES_MODULE_NAME } from '../utils/utils';

const MARQUEE_WAIT_FRAMES = 20 * 5; // 5 seconds per side

type MarqueeOpts = DrawOpts & {
  padding?: number;
};

function useBoundedMarquee(value: string, y: number, opts: MarqueeOpts) {
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
    const padding = opts.padding ?? 0;
    const rightBound = currentOpts.current.bounds?.to.x ?? canvas.width;
    const leftBound = (currentOpts.current.bounds?.from.x ?? 0);
    const effectiveWidth = rightBound - leftBound;
    const stringWidth = canvas.getStringWidth(currentValue.current) + (padding * 2);
    const diff = stringWidth - effectiveWidth;
    let offset = 0;
    
    if (frame.current >= MARQUEE_WAIT_FRAMES + diff) {
      offset = diff;
    } else if (frame.current >= MARQUEE_WAIT_FRAMES) {
      offset = frame.current - MARQUEE_WAIT_FRAMES;
    }

    if (diff < 0) {
      canvas.drawString(currentValue.current, leftBound + padding, y, currentOpts.current);
    } else {
      canvas.drawString(currentValue.current, leftBound + padding - offset, y, currentOpts.current);
    }

    if (frame.current >= MARQUEE_WAIT_FRAMES * 2 + diff) {
      frame.current = 0;
    } else {
      frame.current += 1;
    }
  }, []);
}

export const BreakGrid: React.FC = () => {
  const [nowPlaying] = cartographer.useReplicant<string>('foobar:nowPlaying', '', {
    namespace: SUPPLEMENTARIES_MODULE_NAME,
  });

  const [hostName] = cartographer.useReplicant<string>('host:name', '', {
    namespace: SUPPLEMENTARIES_MODULE_NAME,
  });

  const [hostPronouns] = cartographer.useReplicant<string>('host:pronouns', '', {
    namespace: SUPPLEMENTARIES_MODULE_NAME,
  });

  const songCanvas = cartographer.useRef(new BitmapCanvas(INCENTIVE_GRID_WIDTH, INCENTIVE_GRID_WIDTH));
  const incentiveLabelCanvas = cartographer.useRef(new BitmapCanvas(INCENTIVE_GRID_WIDTH, 10));
  const updateIntervalId = cartographer.useRef<number | null>(null);
  const frame = cartographer.useRef(0);
  const hostPronounsRef = cartographer.useRef('');

  const drawHostMarquee = useBoundedMarquee(hostName, 17, {
    bounds: {
      from: { x: 4, y: 5 },
      to: { 
        x: 124 - (hostPronouns ? songCanvas.current.getStringWidth(hostPronouns) + 6 : 1),
        y: songCanvas.current.height },
    }
  });

  const drawNowPlayingMarquee = useBoundedMarquee(nowPlaying.trim(), 17,  {
    padding: 2,
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
      const hostLabel = 'Station Supervisor';
      canvas.drawFilledRect(2, 2, 123, 10);
      canvas.drawString(hostLabel, 4, 3, { inverse: true });

      // Host pronouns
      if (hostPronounsRef.current) {
        const pronounsWidth = canvas.getStringWidth(hostPronounsRef.current);
        canvas.drawFilledRect(125 - pronounsWidth - 5, 16, 123, 24);
        canvas.drawString(hostPronounsRef.current, 122 - pronounsWidth, 17, { inverse: true });
      }
      // Now playing label
      const nowPlayingLabel = 'Now Playing';
      canvas.drawFilledRect(127, 2, canvas.width - 2, 10);
      canvas.drawString(nowPlayingLabel, 129, 3, { inverse: true });

      drawHostMarquee(canvas);

      drawNowPlayingMarquee(canvas);

      frame.current += 1;
    }
  
    updateIntervalId.current = window.setInterval(executeUpdate,ANIMATION_DELAY_MS);
    executeUpdate();

    const labelCanvas = incentiveLabelCanvas.current;
    labelCanvas.blank();
    labelCanvas.drawFilledRect(2, 1, labelCanvas.width - 2, labelCanvas.height);
    labelCanvas.drawString('Incentives Arriving Soon', 4, 2, { inverse: true });

    return () => {
      if (updateIntervalId.current) window.clearInterval(updateIntervalId.current);
    }
  });

  return (
    <div className="break-screen__grid-container">
      <CanvasRenderer
        canvas={incentiveLabelCanvas.current}
        className="break-screen__incentives-label-grid"
        width={1270}
        height={40}
      />
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