import { useOnMount } from "./hooks";
import { useIncentiveCanvas } from "./incentiveCanvas";
import { BUNDLE_NAME } from "./utils";

const BID_DISPLAY_DURATION_MS = 10000;
const BLANKING_DURATION_MS = 1000;
export const ANIMATION_DELAY_MS = 50;

interface IncentiveRotationState {
  index: number;
  nextRotationAt: number;
  items: Tracker.Bid[];  
}

export function useAnimatedCallback() {
  const intervalId = cartographer.useRef<number | null>(null);
  const frameCount = cartographer.useRef(0);
  const callback = cartographer.useRef<((frame: number) => void) | null>(null);
  const isPlaying = cartographer.useRef(false);

  const togglePlayback = cartographer.useCallback((active: boolean) => {
    isPlaying.current = active;

    if (active) {
      if (intervalId.current) window.clearInterval(intervalId.current);
      function tickAnimation() {
        callback.current?.(frameCount.current);
        frameCount.current += 1;
      }

      intervalId.current = window.setInterval(tickAnimation, ANIMATION_DELAY_MS);
      tickAnimation();
    } else {
      if (intervalId.current) window.clearInterval(intervalId.current);
    }
  }, [callback]);
  
  const setAnimation = cartographer.useCallback((newCallback: (frame: number) => void) => {
    frameCount.current = 0;
    callback.current = newCallback;
  }, []);

  return cartographer.useMemo(() => ({
    togglePlayback,
    setAnimation,
    currentAnimation: callback.current,
  }), [togglePlayback, setAnimation]);
}

export function useIncentiveRotation() {
  const canvas = useIncentiveCanvas();
  const animation = useAnimatedCallback();

  const state = cartographer.useRef<IncentiveRotationState | null>(null);

  const hasFinishedInitialUpdate = cartographer.useRef(false);
  const updateTimeoutId = cartographer.useRef<number | null>(null);
  const isShowingCTA = cartographer.useRef(false);
  const isBlanking = cartographer.useRef(false);
  const scheduleNextUpdate = cartographer.useCallback(() => {
    function executeUpdate() {
      console.log('Executing update...');
      if (!state.current) {
        scheduleNextUpdate();

        return;
      };

      const prevIndex = state.current.index;
      const nextIndex = (state.current.items.length ?? 0) === 0 ? 0 : (state.current.index + 1) % state.current.items.length;
      
      state.current = {
        ...state.current,
        index: nextIndex,
        nextRotationAt: Date.now() + BID_DISPLAY_DURATION_MS,
      };

      if (prevIndex === -1) {
        console.log('Blanking!');
        isBlanking.current = true;
        animation.togglePlayback(true);

        state.current.nextRotationAt = Date.now() + BLANKING_DURATION_MS;

        scheduleNextUpdate();

        return;
      }

      function wrapAnimation(animation: (frame: number) => void) {
        const startFrame = { current: 0 };
        const hasBlankingStarted = { current: false };

        return (frame: number) => {
          if (!startFrame.current && isBlanking.current) {
            startFrame.current = frame;
            hasBlankingStarted.current = true;
          }

          const frameOffset = frame - startFrame.current;

          if (hasBlankingStarted.current && (frameOffset > 6 || frameOffset % 2 === 0)) {
            canvas.blank();
          } else {
            animation(frame);
          }
        }
      }
      
      isBlanking.current = false;
            
      if (state.current.items.length === 0) {
        if (isShowingCTA.current) return;
        animation.togglePlayback(true);
        animation.setAnimation(wrapAnimation((frame) => {
          canvas.drawDonationCTA(frame);
        }));

        state.current.nextRotationAt = Date.now() + 500_000;

        isShowingCTA.current = true;
        return;
      }

      const activeItem = state.current.items[nextIndex];
      
      if (!activeItem) {
        console.error('No active item; seems like a bug.');

        return;
      }

      isShowingCTA.current = false;

      if (activeItem.bid_type === 'choice' && activeItem.options.length === 2 && !activeItem.allowuseroptions) {
        animation.togglePlayback(true);
        animation.setAnimation(wrapAnimation((frame) => {
          canvas.drawBinaryBidwar(activeItem.name, activeItem.options, frame);
        }));
      } else if (activeItem.bid_type === 'choice') {
        animation.togglePlayback(true);
        animation.setAnimation(wrapAnimation((frame) => {
          canvas.drawBidwar(activeItem.name, activeItem.options, frame);
        }));
      } else {
        animation.togglePlayback(true);
        animation.setAnimation(wrapAnimation((frame) => {
          canvas.drawTarget(activeItem.name, activeItem.total, activeItem.goal as number, frame);
        }));
      }

      if (state.current.items.length > 1) {
        scheduleNextUpdate();
      }
    }
    
    console.log('Scheduling update...');
    if (!state.current) {
      console.log('Deferring incentive rotation setup...');
      setTimeout(scheduleNextUpdate, 1000);

      return;
    }

    if (!hasFinishedInitialUpdate.current || Date.now() > state.current.nextRotationAt) {
      hasFinishedInitialUpdate.current = true;
      executeUpdate();
    } else {
      if (updateTimeoutId.current) window.clearTimeout(updateTimeoutId.current);
      updateTimeoutId.current = window.setTimeout(executeUpdate, state.current.nextRotationAt - Date.now());
    }
  }, [state]);

  cartographer.useListenFor('requestIncentivePlan', (bids: Tracker.Bid[]) => {
    if (updateTimeoutId.current) {
      window.clearTimeout(updateTimeoutId.current);
      updateTimeoutId.current = null;
    }

    state.current = {
      index: -1,
      nextRotationAt: Date.now(),
      items: bids,
    };

    scheduleNextUpdate();
  }, { bundle: BUNDLE_NAME });

  useOnMount(() => {
    window.NodeCG.sendMessageToBundle('incentiveRotationMounted', BUNDLE_NAME);
  });

  return cartographer.useMemo(() => ({ canvas, state }), [canvas, state]);
}