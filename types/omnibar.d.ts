namespace Omnibar {
  export interface State {
    activeCarouselItemId: string;
    carouselQueue: {
      data: {
        trackerId: number;
      };
      duration: number;
      id: string;
    }[];
  } 
}