import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExchGamesService } from 'projects/exchgames/src/app/services/exchgames.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { IBalance } from '../shared/balance';
import { GenericResponse } from '../shared/types/generic-response';
import { IOpenBets } from '../shared/types/open-bets';
import { IPingResponse } from '../shared/types/ping-res';
import { CommonService } from './common.service';
import { GamesService } from './games.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string;
  scoreUrl: string;


  private _balanceSub = new ReplaySubject<IBalance>(1);
  balance$ = this._balanceSub.asObservable();

  private _openBetsSub = new ReplaySubject<IOpenBets[]>(1);
  openBets$ = this._openBetsSub.asObservable();

  private _pingResSub = new BehaviorSubject<IPingResponse>(null);
  pingRes$ = this._pingResSub.asObservable();

  constructor(private httpClient: HttpClient, private commonService: CommonService) {
    commonService.apis$.subscribe(res => {
      this.baseUrl = res.ip;
      this.scoreUrl = res.scoreApi;
    })
  }
  balance() {
    return this.httpClient.get(`${this.baseUrl}/balance`);
  }

  getBalance() {
    this.balance().subscribe((balance: GenericResponse<IBalance>) => {
      if (balance && balance.errorCode === 0) {
        this._balanceSub.next(balance.result[0]);
      }
    });
  }

  setBalance(balance: IBalance) {
    this._balanceSub.next(balance);
  }

  bets() {
    return this.httpClient.get(`${this.baseUrl}/listBets`);
  }

  listBetsByEvent(eventId?: string) {
    if (eventId) {
      return this.httpClient.get(`${this.baseUrl}/listBets?eventId=${eventId}`);
    } else {
      return this.httpClient.get(`${this.baseUrl}/listBets`);
    }
  }

  getBets() {
    this.bets().subscribe((bets: GenericResponse<IOpenBets>) => {
      if (bets && bets.errorCode === 0) {
        this._openBetsSub.next(bets.result);
      }
    });
  }
  getBetss(bets:any) {
    this.bets().subscribe(() => {
      if (bets && bets.errorCode === 0) {
        this._openBetsSub.next(bets.result);
      }
    });
  }
  sendBets(bets:any){
    this._openBetsSub.next(bets);
  }

  setPingValue(pingRes: IPingResponse) {
    this._pingResSub.next(pingRes);
  }

  stakeSetting(stakes) {
    return this.httpClient.get(`${this.baseUrl}/stakeSetting/${stakes}`)
  }

  listBooks(marketId) {
    return this.httpClient.get(`${this.baseUrl}/listBooks/${marketId}`);
  }

  myMarkets() {
    return this.httpClient.get(`${this.baseUrl}/liveBetsByMarket`)
  }

  getTicker() {
    return this.httpClient.get(`${this.baseUrl}/getTicker`);
  }

  getTickerVrnl() {
    return this.httpClient.get(`${this.scoreUrl}/api/get_ticker`);
  }
  get_ticker() {
    return this.httpClient.get(`${this.scoreUrl}/api/get_ticker`);
  }

}
