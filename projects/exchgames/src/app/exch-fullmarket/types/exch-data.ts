export interface IExchData {
  channel: {
    status: string;
    game: {
      round: number;
      bettingWindowTime: number;
      bettingWindowPercentageComplete: number;
      markets: {
        markets: IExchMarket[];
        currency: string;
      };
      gameData?: IGameDataObject;
      id: number;
    };
    id: number;
    name: string;
    gameType: string;
    games: IGameData;
  };
}

export interface IGameDataObject {
  objects: IGameData[];
}

export interface IGameData {
  description: string;
  status: string;
  properties: {
    name: string;
    value: string;
  }[];
  name: string;
}

export interface IExchResult {
  channel: {
    games: IExchGame;
    id: number;
    name: string;
    gameType: string;
  }
}

export interface IExchMarket {
  status: string;
  commissionRate?: number;
  marketType: string;
  selections: {
    selections: {
      name?: string;
      resource?: {
        href: string;
        title: string;
        responseType: string;
      };
      status?: string;
      amountMatched?: number;
      bestAvailableToBackPrices?: {
        prices: {
          value: number;
          amountUnmatched: number;
        }[];
      };
      bestAvailableToLayPrices?: {
        prices: {
          value: number;
          amountUnmatched: number;
        }[];
      };
      id?: number;
    }[];
    type: string;
  };
  id: number;
  nextId?: number;
}

export interface IExchGame {
  nextPage: {
    resource: {
      href: string;
      title: string;
      responseType: string;
    };
  };
  games: IExchGameResult[];
  total: number;
  start: number;
  end: number;
}

export interface IExchGameResult {
  gameData: {
    objects: {
      description: string;
      status: string;
      properties: {
        name: string;
        value: string;
      }[];
      name: string;
    }[];
  };
  markets: {
    markets: {
      status: string;
      marketType: string;
      selections: {
        selections: [
          {
            name: string;
            status: string;
          }
        ];
        type: string;
      };
      id: number;
    }[];
    currency: string;
  };
  gameStartDate: string;
  id: number;
}
