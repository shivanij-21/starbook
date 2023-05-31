export interface IProfitLoss {
  PL: string;
  bets: {
    betId: string;
    betTime: string;
    betType: string;
    odds: string;
    netPl: string;
    commission;
    pl: string;
    selName: string;
    stake: string;
  }[];
  commission: number;
  eventName: string;
  marketId: string;
  marketName: string;
  netPL: string;
  round: string;
  settledDate: string;
  sportName: string;
  startTime: string;

  totalPL: number;
}
