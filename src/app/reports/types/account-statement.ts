export interface IAccountStatement {
  credit: number;
  debit: number;
  marketId: string;
  narration: string;
  openingBalance: number;
  runningBalance: number;
  settlementDate: string;
  vouchertId: string;
  bets: {
    PL: number;
    betId: string;
    betTime: string;
    betType: string;
    marketId: string;
    odd: string;
    selectionId: string;
    selectionName: string;
    settlementDate: string;
    stake: number;
    status: string;
  }[];
}
