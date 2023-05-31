import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CasinoService {

  private baseUrl: string;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {
    commonService.apis$.subscribe((res) => {
      this.baseUrl = res.ip;
    });
  }

  callOddsData(oddsUrl) {
    return this.httpClient.get(`${oddsUrl}`)
  }

  callOddsResult(resultUrl) {
    return this.httpClient.get(`${resultUrl}`)
  }

  callResult(fullResultUrl) {
    return this.httpClient.get(`${fullResultUrl}`)
  }
}
