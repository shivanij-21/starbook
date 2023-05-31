export interface ICasinoData {
  oddServer1: string;
  oddServer2: string;
  streamServer: string;
  tables: ICasinoTable[];
}

export interface ICasinoTable {
  oddsUrl: string;
  resultUrl: string;
  scoreUrl: string;
  streamUrl: string;
  tableId: string;
  tableName: string;
}
