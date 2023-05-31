import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class OddsServiceService {
  oddsUrl;
  private _oddsSub = new BehaviorSubject<any>(null);
  odds$ = this._oddsSub.asObservable();
  matchDataHome: any;
  isAllSport: boolean=false;
  private sslAllSportApi;



  constructor(private httpClient: HttpClient, private commonService: CommonService) {
    this.commonService.apis$.subscribe(res => {
      this.oddsUrl = res.sportApi;
      this.sslAllSportApi = res.sslAllSportApi;
    })
  }


  getWebSocketData(marketdata) {
    if ((marketdata.eventTypeId == 4 || marketdata.eventTypeId == 1 || marketdata.eventTypeId == 2) && marketdata.markets[0]?.marketId.length < 13) {
      this.isAllSport = false;
      // console.log(this.isAllSport, "false");

    } else {
      this.isAllSport = true;
      // console.log(this.isAllSport, "true");


    }
  }
  getMatchOdds(sportId: number, ids: string, isAllSport?) {
    if(this.isAllSport){
    return this.httpClient.get(`${this.sslAllSportApi}/matchOdds/${sportId}/?ids=${ids}`);
    }else{
      return this.httpClient.get(`${this.oddsUrl}/matchOdds/${sportId}/?ids=${ids}`);
    }
  }
  // getMatchOdds1(sportId: number, ids: string) {
  //   return this.httpClient.get(`${this.sslAllSportApi}/matchOdds/${sportId}/?ids=${ids}`);
  
  // }


  getOddsOfMatches(matches: any[], sportId?: number) {
    var ids = [];
    matches.forEach((match, index) => {
      if (sportId === +match.SportbfId) {
        ids.push(match.bfId);
      }
    });
    if (ids?.length) {
      this.getMatchOdds(sportId, ids.join(','))
        .subscribe((res: any[]) => {
          res?.forEach((market) => {
            this.matchDataHome[market.eventId] = market;
            this._oddsSub.next(this.matchDataHome);
          });
        });
    }
    // if (ids?.length) {
    //   this.getMatchOdds1(sportId, ids.join(','))
    //     .subscribe((res: any[]) => {
    //       res?.forEach((market) => {
    //         this.matchDataHome[market.eventId] = market;
    //         this._oddsSub.next(this.matchDataHome);
    //       });
    //     });
    // }
    return this.odds$;
  }
  getAuthCasino(userName: string, userId, prod_code, prod_type) {
    // return this.http.post(`http://185.225.233.199:33333/api/auth`, { userName, userId, prod_code, prod_type });
    return this.httpClient.post(`https://etg.globlethings.com/api/auth`, { userName, userId, prod_code, prod_type });

  }
  QuitCasino(userName: string, userId) {
    // return this.http.post(`http://185.225.233.199:33333/api/quit`, { userName, userId });
    return this.httpClient.post(`https://etg.globlethings.com/api/quit`, { userName, userId });

  }
  supernowaAuth(params) {
    return this.httpClient.post(`https://sn.vrnl.net/pad=111/api/auth`, params);
  }
  supernowaGameAssetsList(providerCode:string) {
    return this.httpClient.get(`https://sn.vrnl.net/pad=111/api/games/${providerCode}`);
  }
  listProviders() {
    return this.httpClient.get(`https://api.cricbuzzer.io/pad=89/listProviders`);
  }
}
