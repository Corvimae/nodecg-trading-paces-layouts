namespace Omnibar {
  export interface State {
    activeCarouselItemId: string;
    carouselQueue: {
      data: {
        trackerId: number;
      };
      id: string;
    }[];
  } 
}