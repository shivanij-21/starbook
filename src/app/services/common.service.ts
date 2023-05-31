import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApis } from '../shared/types/apis';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private apisUrl = environment.apisUrl;
  apis$: Subject<IApis> = new ReplaySubject<IApis>(1);
  apis: any;

  constructor(private http: HttpClient, private authService: TokenService,) {
    this.apis$.subscribe((res: any) => {
      let hostname = window.origin;
      if (hostname.indexOf('cricbuzzer') > -1 || hostname.indexOf('localhost1') > -1) {
        res.ip = res.devIp;
      } else {
        res.ip = res.sslclient;
      }
      if (location.protocol === 'https:') {
        res.ip = res.sslclient;
        res.racingApi = res.sslRacingApi;
        res.sportApi = res.sslSportApi;
        res.sportSocketApi = res.sslsportSocketApi;
        res.racingSocketApi = res.sslracingSocketApi;
        res.exchangeGamesApi = res.sslExchangeGamesApi;
        res.sslAllSportApi = res.sslAllSportApi;
        res.sslAllSportSocketApi = res.sslAllSportSocketApi;


      }
      this.apis = res;
      if (res.maintanance == 1) {
        this.authService.setMaintanance(res.maintanance);
      } else if (res.maintanance == 2) {
        this.authService.setMaintanance(res.maintanance);
      } else if (res.maintanance == 0) {
        this.authService.removeMaintanance();
      }
    })
  }

  getApis() {
    return this.http.get(`${this.apisUrl}`);
  }
}
