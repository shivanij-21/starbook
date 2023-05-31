import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';

export const STAKE_LIST = 'stakeList';
export const RULES_AGREE = 'rulesAgree';

export interface IStake {
  id: number;
  stake: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  stakeList = [
    { id: 1, stake: 500 },
    { id: 2, stake: 1000 },
    { id: 3, stake: 5000 },
    { id: 4, stake: 10000 },
    { id: 5, stake: 20000 },
    { id: 6, stake: 25000 },
    { id: 7, stake: 50000 },
  ];

  private _stakeListSub = new BehaviorSubject<IStake[]>(null);
  stakeList$ = this._stakeListSub.asObservable();

  constructor(
    private cookieService: CookieService
  ) {
    let stakeList = localStorage.getItem(STAKE_LIST);
    if (stakeList) {
      this.stakeList = JSON.parse(stakeList);
      this._stakeListSub.next(this.stakeList);
    } else {
      this._stakeListSub.next(this.stakeList);
    }
  }

  setStakeList(stakeList: IStake[]) {
    localStorage.setItem(STAKE_LIST, JSON.stringify(stakeList));
    this._stakeListSub.next(stakeList);
  }

  getStakeList() {
    return this._stakeListSub.value;
  }

  setRulesAgreement(agreement: boolean) {
    this.cookieService.put(RULES_AGREE, JSON.stringify(agreement));
  }

  getRulesAgreement() {
    let rulesAgree = this.cookieService.get(RULES_AGREE);
    if (rulesAgree) {
      return JSON.parse(rulesAgree);
    }
    return false;
  }
}
