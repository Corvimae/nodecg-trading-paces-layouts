namespace Tracker {
  export interface Bid {
    type: 'bid';
    id: number;
    bid_type: 'choice' | 'target';
    name: string;
    speedrun: number;
    state: 'OPENED' | 'CLOSED' | 'HIDDEN';
    description: string;
    shortdescription: string;
    estiamte: string;
    close_at: string;
    goal: number | null;
    total: number;
    count: number;
    istarget: boolean;
    allowuseroptions: boolean;
    options: {
      type: 'bid';
      id: number;
      bid_type: 'option';
      name: string;
      state: 'OPENED' | 'CLOSED' | 'HIDDEN';
      description: string;
      total: number;
      count: number;
    }[];
  }
}