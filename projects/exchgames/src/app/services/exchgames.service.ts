import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { IApis } from 'src/app/shared/types/apis';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchGamesService {

  private baseUrl: string;
  private apisUrl = environment.apisUrl;
  private exchGamesUrl;
  games: string[];
  constructor(private http: HttpClient, private commonService: CommonService) {
    commonService.apis$.subscribe((res: IApis) => {
      this.baseUrl = res.ip;
      this.exchGamesUrl = res.exchangeGamesApi;
    });
  }

  listGames() {
    return this.http.get(`${this.exchGamesUrl}/ListGames/`);
  }

  getGameData(gameName: string, firstCall?: boolean) {
    if (firstCall) {
      return this.http.get(`${this.exchGamesUrl}/firstData/${gameName}`)
    }
    return this.http.get(`${this.exchGamesUrl}/data/${gameName}`)
  }

  placeBetsExG(exchGameData: any) {
    return this.http.post(`${this.baseUrl}/placeBetsExG`, exchGameData);
  }
  requestResult(reqId: any) {
    return this.http.get(`${this.baseUrl}/requestResult/${reqId}`);
  }


  exchResults(gameId: number) {
    return this.http.get(`${this.exchGamesUrl}/resultsHistory/${gameId}`)
  }

  resultByMarketId(marketId: number) {
    return this.http.get(`${this.exchGamesUrl}/resultByMarket/${marketId}`)
  }

  listBooks(marketId: number) {
    return this.http.get(`${this.baseUrl}/listBooks/${marketId}`);
  }
}
