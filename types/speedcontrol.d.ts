namespace Speedcontrol {
  export interface ActiveRun {
    id: string;
    category: string;
    estimate: string;
    estimateS: number;
    externalId: string;
    game: string;
    gameTwitch: string;
    release: string;
    scheduled: string;
    scheduledS: number;
    setupTime: string;
    setupTimeS: number;
  } 
}