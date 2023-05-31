export interface ISportsData {
  sportsBookMarket: any;
  bfId: number;
  id: number;
  name: string;
  tournaments: ITournament;
}

export interface ITournament {
  bfId: number;
  id: number;
  name: string;
  matches: IMatch;
}

export interface IMatch {
  bfId: number;
  inPlay: number;
  startDate: string;
  name: string;
  port: number;
  id: number;
  status: string;
  tv: number;
  isFancy: number;
  activeStatus: number;
  totalMatched: number;
  tvPid: number;
  tvMapid: number;
  bet: number;
  usersOnline: number;
  noOfBets: number;
  session: string;
  unmatched: number;
  markets: IMarket[];
}

export interface IMarket {
  name: string;
  id: number;
  bfId: string;
  betDelay: number;
  racing: boolean;
  startTime: string;
  runnerData: {
    runner1Name: string;
    runner2Name: string;
  };
  status: string;
}
