import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICasinoBetData } from 'src/app/fullmarket/types/casino-betdata';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { IBetData } from '../types/bet-data';

@Injectable({
  providedIn: 'root',
})
export class BetsService {
  baseUrl: string;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {
    commonService.apis$.subscribe((res) => {
      this.baseUrl = res.ip;
    });
  }
  placeBet(betData: IBetData) {
    return this.httpClient.post(`${this.baseUrl}/placeBets`, betData);
  }

  placeTPBet(tpBetData: ICasinoBetData) {
    return this.httpClient.post(`${this.baseUrl}/TPplaceBets`, tpBetData);
  }

  placeBetsPremium(betData: any) {
    return this.httpClient.post(`${this.baseUrl}/placeBetsPremium`, betData);
  }
  requestResult(reqId: any) {
    return this.httpClient.get(`${this.baseUrl}/requestResult/${reqId}`);
  }

  cancelBet(betId: string) {
    return this.httpClient.get(`${this.baseUrl}/cancelBet/${betId}`);
  }
}
