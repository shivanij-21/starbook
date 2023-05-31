import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { IBalance } from '../shared/balance';

export enum LEVELS {
  ALL,
  SPORT,
  TOURNAMENT,
  MATCH,
  MARKET,
}

export type ILeftColState = {
  level: number;
  value?: any;
};

export const SPORTS_MAP = {
  1: {
    id: 10,
    bfId: 1,
    title: 'Soccer',
  },
  2: {
    id: 20,
    bfId: 2,
    title: 'Tennis',
  },
  4: {
    id: 30,
    bfId: 4,
    title: 'Cricket',
  },
  // 7: {
  //   id: 4,
  //   bfId: 7,
  //   title: "Horse Racing Today's Card",
  //   day: 1
  // },
  // 4339: {
  //   id: 5,
  //   bfId: 4339.1,
  //   title: "Greyhound Racing Today's Card",
  // },
  7: {
    id: 6,
    bfId: 7,
    title: 'Horse Racing',
    1: {
      id: 6,
      bfId: 7,
      title: "Horse Racing Today's Card",
    }
  },
  4339: {
    id: 7,
    bfId: 4339,
    title: 'Greyhound Racing',
    1: {
      id: 7,
      bfId: 4339,
      title: "Greyhound Racing Today's Card",
    }
  },
};

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {
  private _balanceDataSub = new BehaviorSubject<IBalance>(null);
  balanceData$ = this._balanceDataSub.asObservable();

  private _leftColStateSub = new ReplaySubject<ILeftColState>(1);
  leftColState$ = this._leftColStateSub.asObservable();

  private unSubGameSub = new BehaviorSubject<boolean>(false);
  unSubGames$ = this.unSubGameSub.asObservable();

  private _oddsDataSub = new BehaviorSubject<any>(null);
  oddsData$ = this._oddsDataSub.asObservable();

  private _betExpoData = new BehaviorSubject<any>(null);
  betExpoData$ = this._betExpoData.asObservable();
  
  constructor() {}

  setBalanceData(balanceData: IBalance) {
    this._balanceDataSub.next(balanceData);
  }

  setLeftColState(state: ILeftColState) {
    this._leftColStateSub.next(state);
  }

  setUnSubValue(value: boolean) {
    this.unSubGameSub.next(value);
  }
  shareOddsData(data: any) {
    this._oddsDataSub.next(data);
  }
  shareBetExpoData(data: any) {
    this._betExpoData.next(data);
  }
}

