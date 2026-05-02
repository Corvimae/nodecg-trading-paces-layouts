import type NodeCG from '@nodecg/types';

const INCENTIVE_DISPLAY_DURATION = 10_000;

export = (nodecg: NodeCG.ServerAPI) => {
   async function fetchFromTracker<T = Record<string, unknown>>(path: string): Promise<T[]> {
    const request = await fetch(`${nodecg.bundleConfig.trackerUrl}/${path}`, {
      headers: {
        Authorization: `Token ${nodecg.bundleConfig.trackerApiKey}`,
      },
    });
    
    try {
      const response = await request.json();

      if (request.status !== 200) throw new Error(`Error response from tracker: ${request.status} (${request.statusText}).`);
    
      if (response.next) return [...response.results, ...(await fetchFromTracker(response.next))];
    
      return response.results;
    } catch (e) {
      console.error(`Failed to fetch from ${path}:`);
      console.error(e);

      return [] as T[];
    }
  }

  const bidTree = nodecg.Replicant<Tracker.Bid[]>('bidTree', 'nodecg-trading-paces-layouts', {});

  async function fetchBids() {
    try {
      const allBids = await fetchFromTracker<Tracker.Bid>(`events/${nodecg.bundleConfig.trackerEvent}/bids/tree.json`);

      bidTree.value = allBids;
    } catch (e) {
      console.error('Failed to fetch bids.');
      console.error(e);
    }
  }

  setInterval(fetchBids, 10 * 1000);

  const omnibarState = nodecg.Replicant<Omnibar.State>('nodecg-omnibar', 'nodecg-omnibar', {});
  const previousCarouselItemId = { value: '' };

  function requestIncentivePlan(force = false) {
    if (!omnibarState.value) return;
    if (force || omnibarState.value.activeCarouselItemId !== previousCarouselItemId.value) {
      previousCarouselItemId.value = omnibarState.value.activeCarouselItemId;
      
      const currentRunItem = omnibarState.value.carouselQueue.find((item) => item.id === omnibarState.value?.activeCarouselItemId);
      
      if (!currentRunItem) return [];

      nodecg.sendMessageToBundle(
        'requestIncentivePlan',
        'nodecg-trading-paces-layouts',
        bidTree.value?.filter((bid) => Number(bid.speedrun) === Number(currentRunItem.data.trackerId)) ?? []
      );
    }  
  }

  omnibarState.on('change', () => requestIncentivePlan());

  nodecg.listenFor('incentiveRotationMounted', () => {
    requestIncentivePlan(true);
  });

  setInterval(() => {
    // Update lengths of carousel items based on number of relevant bids.
    if (!omnibarState.value) return;

    omnibarState.value.carouselQueue.forEach((queueItem) => {
      const bidsForItem = bidTree.value?.filter((bid) => Number(bid.speedrun) === Number(queueItem.data.trackerId)) ?? []
    
      queueItem.duration = Math.max(1, bidsForItem.length) * INCENTIVE_DISPLAY_DURATION;
    });
  }, 10_000);

  requestIncentivePlan();
};