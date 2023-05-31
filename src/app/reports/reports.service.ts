import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {
    commonService.apis$.subscribe((res) => {
      this.baseUrl = res.ip;
    });
  }
  getAccountStatement(fromDate: string, toDate: string) {
    return this.httpClient.get(
      `${this.baseUrl}/betsReport?from=${fromDate}&to=${toDate}`
    );
  }

  getBetHistory(fromDate: string, toDate: string, betStatus: number) {
    return this.httpClient.get(
      `${this.baseUrl}/betsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  PokerBetHistory(fromDate: string, toDate: string) {
    return this.httpClient.get(
      `${this.baseUrl}/pokerLog?from=${fromDate}&to=${toDate}`
    );
  }

  getProfitLoss(fromDate: string, toDate: string) {
    return this.httpClient.get(
      `${this.baseUrl}/profitLoss?from=${fromDate}&to=${toDate}`
    );
  }

  casinoBGBetsHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoBGBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  CasinoBGProfitLoss(fromDate: string, toDate: string,userId:number) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoBGProfitLoss?from=${fromDate}&to=${toDate}&userId=${userId}`
    );
  }

  getActivityLog() {
    return this.httpClient.get(`${this.baseUrl}/logActivity`);
  }
  SlotBetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoSlotBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  SlotProfitLoss(fromDate: string, toDate: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoSlotProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }
  CasinoBetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  CasinoProfitLoss(fromDate: string, toDate: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }
  SNCasinoBetHistory(fromDate: string, toDate: string, betStatus: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoSNBetsHistory?from=${fromDate}&to=${toDate}&type=${betStatus}`
    );
  }

  SNCasinoProfitLoss(fromDate: string, toDate: string) {
    return this.httpClient.get(
      `${this.baseUrl}/casinoSNProfitLoss?from=${fromDate}&to=${toDate}`
    );
  }
}
