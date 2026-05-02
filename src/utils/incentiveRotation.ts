import { useOnMount } from "./hooks";
import { useIncentiveCanvas } from "./incentiveCanvas";
import { BUNDLE_NAME } from "./utils";

const BID_DISPLAY_DURATION_MS = 10000;
const ANIMATION_DELAY_MS = 100;

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
    setAnimation
  }), [togglePlayback, setAnimation]);
}

export function useIncentiveRotation() {
  const canvas = useIncentiveCanvas();
  const animation = useAnimatedCallback();

  const state = cartographer.useRef<IncentiveRotationState | null>(null);

  const hasFinishedInitialUpdate = cartographer.useRef(false);
  const updateTimeoutId = cartographer.useRef<number | null>(null);
  const isShowingCTA = cartographer.useRef(false);
  const scheduleNextUpdate = cartographer.useCallback(() => {
    function executeUpdate() {
      console.log('Executing update...');
      if (!state.current) {
        scheduleNextUpdate();

        return;
      };

      const nextIndex = (state.current.items.length ?? 0) === 0 ? 0 : (state.current.index + 1) % state.current.items.length;
      
      state.current = {
        ...state.current,
        index: nextIndex,
        nextRotationAt: Date.now() + BID_DISPLAY_DURATION_MS,
      };
      
      scheduleNextUpdate();
      
      if (state.current.items.length === 0) {
        if (isShowingCTA.current) return;
        animation.togglePlayback(true);
        animation.setAnimation((frame) => {
          canvas.drawDonationCTA(frame);
        });

        state.current.nextRotationAt = Date.now() + 50_000;

        isShowingCTA.current = true;
        return;
      }

      const activeItem = state.current.items[nextIndex];

      console.log(state.current.items, nextIndex);
      
      if (!activeItem) {
        console.error('No active item; seems like a bug.');

        return;
      }

      isShowingCTA.current = false;
      if (activeItem.bid_type === 'choice' && activeItem.options.length === 2 && !activeItem.allowuseroptions) {
        canvas.drawBinaryBidwar(activeItem.name, activeItem.options);
      } else if (activeItem.bid_type === 'choice') {
        canvas.drawBidwar(activeItem.name, activeItem.options);
      } else {
        canvas.drawTarget(activeItem.name, activeItem.total, activeItem.goal as number);
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
      index: 0,
      nextRotationAt: Date.now() + BID_DISPLAY_DURATION_MS,
      items: bids,
    };

    console.log('RIP');
    scheduleNextUpdate();
  }, { bundle: BUNDLE_NAME });

  useOnMount(() => {
    window.NodeCG.sendMessageToBundle('incentiveRotationMounted', BUNDLE_NAME);
  });

  return cartographer.useMemo(() => ({ canvas, state }), [canvas, state]);
}