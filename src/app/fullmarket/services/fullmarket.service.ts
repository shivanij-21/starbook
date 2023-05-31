import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { GamesService } from 'src/app/services/games.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FullmarketService {
  private baseUrl: string;
  private raceUrl;
  private sportUrl;
  private fancyUrl;
  private sportSocketApi;
  private scoreUrl;
  private premiumApi!: string;
  private scoreApi;
  private sslAllSportSocketApi;
  isAllSport: boolean = false;

  private _oddsSub = new BehaviorSubject<any>(null);
  odds$ = this._oddsSub.asObservable();
  liveTvApi: any;

  subject$: WebSocket;

  marketId;

  socketTimeOut: boolean = true;
  intervalSub: Subscription;
  timeOutOdds;

  marketIds = '';

  matchId: any;
  inPlay$ = new Subject();
  racingSocketApi: string;
  matchData: any;
  isSportBookPendingApi: boolean = false;
  private allSportApi!: string;




  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private commonService: CommonService,
    private game: GamesService,
    private shareDataService: ShareDataService,


  ) {
    this.inPlay$.subscribe((inPlay) => {
      this.startOddsInterval(inPlay == 1 ? 500 : 10000);
    });
    this.commonService.apis$.subscribe(res => {
      this.baseUrl = res.ip;
      this.raceUrl = res.racingApi;
      this.sportUrl = res.sportApi;
      this.fancyUrl = res.fancyApi;
      this.scoreUrl = res.scoreApi;
      this.premiumApi = res.premiumApi;
      this.liveTvApi = res.liveTvApi;
      this.scoreApi = res.scoreApi;
      this.allSportApi = res.sslAllSportApi;
      this.sslAllSportSocketApi = res.sslAllSportSocketApi?.replace('http', 'ws');
      this.sportSocketApi = res.sportSocketApi?.replace('http', 'ws');
      this.racingSocketApi = res.racingSocketApi?.replace('http', 'ws');
      console.log(this.racingSocketApi);
      console.log(this.sportUrl);

    })
  }

  startOddsInterval(intervalTime) {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
    this.intervalSub = interval(intervalTime).subscribe(() => {
      if (!this.socketTimeOut) {
        this.getOdds(this.marketIds).subscribe((data) => {
          this._oddsSub.next(data);
        });
        this.getOddsAllSports(this.marketIds).subscribe((data) => {
          this._oddsSub.next(data);
        });
        this.getFancyOdds(this.marketId).subscribe((data: any) => {
          if (data.BMmarket) {
            this._oddsSub.next({ BMmarket: data.BMmarket });
          }
          if (data.Fancymarket) {
            this._oddsSub.next({ Fancymarket: data.Fancymarket[0] });
          }
        });
      }
    });
  }

  loadEvent(eventIdTableName: number | string, isTeenpatti?: boolean) {
    if (isTeenpatti) {
      return this.httpClient.get(`${this.baseUrl}/loadTable/${eventIdTableName}`);
    }
    return this.httpClient.get(`${this.baseUrl}/loadEvent/${eventIdTableName}`);
  }

  listCasinoTable() {
    return this.httpClient.get(`${this.baseUrl}/listCasinoTable`)
  }

  getliveTvApi(eventId: any) {
    return this.httpClient.get(`${this.liveTvApi}/api/get_live_tv_url/${eventId}`);
  }

  getFancyExposure(eventId) {
    return this.httpClient.get(`${this.baseUrl}/fancyExposure/${eventId}`);
  }

  getFancyBook(marketId, fancyId, fancyName) {
    return this.httpClient.get(
      `${this.baseUrl}/listBooks/df_${marketId}_${fancyId}_${fancyName},`
    );
  }

  getBookExposure(marketId) {
    return this.httpClient.get(`${this.baseUrl}/listBooks/${marketId}`)
  }

  getTPExposureBook(tableName: string, roundId: number, selectionId: number) {
    return this.httpClient.get(`${this.baseUrl}/listBooks/${tableName}/${roundId}/${selectionId}`)
  }

  marketDescription(marketId: string) {
    return this.httpClient.get(`${this.raceUrl}/marketDescription/${marketId}`);
  }

  getScore(matchBfId: string) {
    return this.httpClient.get(`${this.scoreUrl}/score_api/${matchBfId}`);
  }

  GetScoreId(matchBfId: string) {
    return this.httpClient.get(`https://access.streamingtv.fun:3440/api/getScoreId/${matchBfId}`);
  }


  getOdds(marketIds) {
    return this.httpClient.get(
      `${this.allSportApi}/oddsInplay/?ids=${marketIds}`);
  }
  getOddsAllSports(marketIds) {
    return this.httpClient.get(
      `${this.sportUrl}/oddsInplay/?ids=${marketIds}`);

  }



  getFancyOdds(matchId) {
    return this.httpClient.get(
      `${this.fancyUrl}/api/bm_fancy/${matchId}`
    );
  }
  getSportsBook(eventId) {
    return this.httpClient.get(
      `${this.premiumApi}/api/sports_book/${eventId}`
    );
  }





  getWebSocketData(marketdata) {
    console.log(marketdata.racing,"marketdata");
    
    if (marketdata.eventTypeId == "4" || marketdata.eventTypeId == "1" || marketdata.eventTypeId == "2") {
      this.isAllSport = false;
    } else {
      this.isAllSport = true;
    }
    if (!marketdata.racing) {
      this.startOddsInterval(marketdata.inPlay == 1 ? 2000 : 10000);
      let ids = marketdata.markets.reduce((acc, c) => [...acc, c.bfId], []);
      this.marketIds = ids.join(',');
    }
    if (this.isAllSport) {
      this.sportSocketApi = this.sslAllSportSocketApi;
    }
    if (marketdata && marketdata.port && this.marketId !== marketdata.bfId) {
      this.marketId = marketdata.bfId;
      if (marketdata.racing) {
        var url = `${this.racingSocketApi}:${marketdata.port}/${this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'}`;
        if (location.protocol === 'https:') {
          var url = `${this.racingSocketApi}/hgport=${marketdata.port}/${this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'}`;
        }
      } else {
        var url = `${this.sportSocketApi}:${marketdata.port}/${this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'}`;
        if (location.protocol === 'https:') {
          var url = `${this.sportSocketApi}/spport=${marketdata.port}/${this.authService.getLoggedIn() ? '?logged=true' : '?logged=false'}`;
        }
      }



      if (!this.subject$ || this.subject$.CLOSED) {
        this.subject$ = this.createConnection(url);
        // console.log(this.subject$);

        this.subject$.onmessage = (message: any) => {
          message = JSON.parse(message.data);

          if (!marketdata.racing) {
            this.socketTimeOut = true;
            clearTimeout(this.timeOutOdds);
            this.timeOutOdds = setTimeout(
              () => {
                this.socketTimeOut = false;
              },
              marketdata.inPlay == 1 ? 3000 : 5000
            );
          }
          this._oddsSub.next(message);
        };
        // this.subject$.onerror = ((error: any) => {
        //   console.log(`[error]: Error connecting to socket`);
        //   this.marketId = null;
        //   this.getWebSocketData(marketdata);
        // });
      }
      // return this.odds$;
    }
    return this.odds$;
  }
  



  createConnection(url) {
    return new WebSocket(url);
  }



  closeConnection() {
    if (this.subject$ && this.subject$.OPEN) {
      this.marketId = null;
      if (this.intervalSub) this.intervalSub.unsubscribe();
      this._oddsSub.next(null);
      this.subject$.close();
    }
  }
}
