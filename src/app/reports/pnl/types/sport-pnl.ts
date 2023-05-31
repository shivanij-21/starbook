import { IProfitLoss } from "./pnl";

export interface ISportPnl {
  sportName: string;
  totalPL: number;

  markets: IProfitLoss[];
}
