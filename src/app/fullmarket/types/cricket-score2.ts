export interface ICricketScore2 {
  eventTypeId: number;
  eventId: number;
  score: {
    home: {
      name: string;
      halfTimeScore: string;
      fullTimeScore: string;
      penaltiesScore: string;
      penaltiesSequence: [];
      highlight: boolean;
      inning1: {
        runs: string;
        wickets: string;
        overs: string;
      };
    };
    away: {
      name: string;
      halfTimeScore: string;
      fullTimeScore: string;
      penaltiesScore: string;
      penaltiesSequence: [];
      highlight: boolean;
      inning1: {
        runs: string;
        wickets: string;
        overs: string;
      };
    };
  };
  currentSet: number;
  hasSets: false;
  stateOfBall: {
    overNumber: string;
    overBallNumber: string;
    bowlerName: string;
    batsmanName: string;
    batsmanRuns: string;
    appealId: string;
    appealTypeName: string;
    wide: string;
    bye: string;
    legBye: string;
    noBall: string;
    outcomeId: string;
    dismissalTypeName: string;
    referralOutcome: string;
  };
  currentDay: string;
  matchType: string;
  fullTimeElapsed: {
    hour: number;
    min: number;
    sec: number;
  };
  matchStatus: string;
}
