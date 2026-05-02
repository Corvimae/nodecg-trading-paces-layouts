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
    teams: Team[];
  } 

  export interface Team {
    id: string;
    name: string;
    players: Player[];
  }

  export interface Player {
    id: string;
    name: string;
    pronouns: string;
    teamID: string;
    social: {
      twitch?: string;
    };
  }
}