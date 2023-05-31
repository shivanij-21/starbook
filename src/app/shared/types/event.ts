export interface IEvent {
  sportId: string;
  tv: number;
  isFancy: number;
  activeStatus: number;
  sportsName: string;
  competitionName: string;
  totalMatched: number;
  tvPid: number;
  tvMapid: number;
  time: string;
  bet: number;
  isInPlay: number;
  usersOnline: number;
  noOfBets: number;
  session: string;
  unmatched: number;
  id: number;
  eventTypeId: string;
  competitionId: number;
  eventId: number;
  eventName: string;
  status: number;
  markets: {
    marketName: string;
    gameId: number;
    marketId: string;
    runners: string[];
    open: number;
    status: number;
  }[];
}
