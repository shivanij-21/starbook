import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CommonService } from '../services/common.service';
import { DataFormatService } from '../services/data-format.service';
import { GamesService } from '../services/games.service';
import { OddsServiceService } from '../services/odds-service.service';
import { LEVELS, ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import { GenericResponse } from '../shared/types/generic-response';
import { ICasinoData, ICasinoTable } from './types/casino-data';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.scss'],
})
export class SportsComponent implements OnInit, OnDestroy {
  selectedSportId: number = 4;
  selectedSport: string;
  Highlightlist: any[];
  matchDataHome = {};
  intervalSub = new Subscription();

  sportsDataVal: boolean = false;
  casinoData: ICasinoData;
  tables: ICasinoTable[];
  isPendingLogin: boolean = false;
  isAuthPending: boolean = false;
  isInrCurrency = false;
  isLogin: boolean = false;


  awcCasinoList_Vnd = [
    { sr: 9, prod_code: '7', prod_type: '1', name: "ALLBET", prod_name: "ALLBET", prod_type_name: 'LIVE CASINO' },
    { sr: 9, prod_code: '132', prod_type: '2', name: "KA GAMING", prod_name: "KA GAMING", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '42', prod_type: '2', name: "QUICK SPIN", prod_name: "QUICK SPIN", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '45', prod_type: '2', name: "NETENT", prod_name: "NETENT", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '48', prod_type: '2', name: "BLUEPRINT", prod_name: "BLUEPRINT", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '74', prod_type: '2', name: "PLAYSTAR", prod_name: "PLAYSTAR", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '3', prod_type: '1', name: "SEXY BACCARAT", prod_name: "SEXY BACCARAT", prod_type_name: 'LIVE CASINO' },
    { sr: 9, prod_code: '117', prod_type: '2', name: "KINGMAKER", prod_name: "KINGMAKER", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '19', prod_type: '1', name: "DREAM GAMING", prod_name: "DREAM GAMING", prod_type_name: 'LIVE CASINO' },
    { sr: 9, prod_code: '20', prod_type: '1', name: "KING855", prod_name: "KING855", prod_type_name: 'LIVE CASINO' },
    { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 9, prod_code: '12', prod_type: '2', name: "SPADE GAMING", prod_name: "SPADE GAMING", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '107', prod_type: '6', name: "FC FISHING", prod_name: "FC FISHING", prod_type_name: 'FISH HUNTER' },
    { sr: 9, prod_code: '116', prod_type: '2', name: "RED TIGER", prod_name: "RED TIGER", prod_type_name: 'SLOT' },
    { sr: 9, prod_code: '152', prod_type: '4', name: "AELOTTO", prod_name: "AELOTTO", prod_type_name: 'LOTTO' },
    { sr: 9, prod_code: '146', prod_type: '5', name: "1G Poker", prod_name: "1G Poker", prod_type_name: 'LIVE CASINO,CARD AND BOARD' },
    { sr: 9, prod_code: '39', prod_type: '2', name: "CQ9", prod_name: "CQ9", prod_type_name: 'SLOT,FISH HUNTER' },
    { sr: 9, prod_code: '148', prod_type: '2', name: "ASIA GAMING", prod_name: "ASIAGAMING", prod_type_name: 'LIVE CASINO,SLOT' },
    { sr: 9, prod_code: '17', prod_type: '3', name: "M8 SPORT", prod_name: "M8 SPORT", prod_type_name: 'SPORTBOOK' },
    { sr: 33, prod_code: '144', prod_type: '2', name: "FUNKY GAME", prod_name: "FUNKY GAME", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '98', prod_type: '1', name: "ORIENTAL GAMING", prod_name: "ORIENTAL GAMING", prod_type_name: 'LIVE CASINO' },
    { sr: 33, prod_code: '74', prod_type: '2', name: "PLAYSTAR", prod_name: "PLAYSTAR", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '123', prod_type: '2', name: "WORLD MATCH", prod_name: "WORLD MATCH", prod_type_name: 'SLOT' },
    { sr: 33, prod_code: '129', prod_type: '2', name: "AMEBA", prod_name: "AMEBA", prod_type_name: 'SLOT' },
    { sr: 13, prod_code: '1006', prod_type: '1', name: "EVOLUTION GAMING", prod_name: "EVOLUTION GAMING", prod_type_name: 'LIVE CASINO' },
  ]
  accountInfo: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dataformatService: DataFormatService,
    private oddsService: OddsServiceService,
    private shareDataService: ShareDataService,
    private titleService: Title,
    private gamesService: GamesService,
    private commonService: CommonService,
    private tokenService: TokenService,


  ) {

  }

  ngOnInit(): void {
    this.titleService.setTitle('Exchange');
    this.activatedRoute.params.subscribe((params) => {
      this.selectedSportId = +params.sportId;

      if (this.selectedSportId === 4) {
        this.selectedSport = 'Cricket';
      } else if (this.selectedSportId === 1) {
        this.selectedSport = 'Football';
      } else if (this.selectedSportId === 2) {
        this.selectedSport = 'Tennis';
      } else if (this.selectedSportId === 7) {
        this.selectedSport = 'Horse Racing';
      } else if (this.selectedSportId === 4339) {
        this.selectedSport = 'Greyhound Racing';
      } else if (this.selectedSportId === 10) {
        this.selectedSport = 'Live Casino';
      }

      if (this.intervalSub) {
        this.intervalSub.unsubscribe();
      }

      if (this.selectedSportId != 10) {
        this.sportsDataVal = false;
        this.dataformatService.sportsData$.subscribe((sportsData) => {
          if (sportsData && !this.sportsDataVal) {
            this.getOdds();
            this.sportsDataVal = true;
          }
        });

        this.intervalSub = interval(60000).subscribe(() => {
          this.getOdds();
        });
      } else if (this.selectedSportId == 10) {
        this.commonService.apis$.subscribe((res) => {
          this.getLiveCasinoTables();
          this.UserDescription();
          this.listCasinoProduct();
        });
      }

      this.shareDataService.setLeftColState({
        level: LEVELS.SPORT,
        value: { id: this.selectedSportId, name: this.selectedSport },
      });
    });
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }
  }

  getOdds() {
    this.Highlightlist = this.dataformatService.highlightwisedata(
      this.selectedSportId
    );
    if (this.selectedSportId != 52) {
      var ids = [];
      this.Highlightlist?.forEach((match, index) => {
        if (this.selectedSportId === +match.SportbfId) {
          ids.push(match.bfId);
        }
      });
      if (ids?.length) {
        this.oddsService
          .getMatchOdds(this.selectedSportId, ids.join(','))
          .subscribe((res: any[]) => {
            if (res) {
              res?.forEach((market) => {
                this.matchDataHome[market.eventId] = market;
              });
            }
          });
      }
      // if (ids?.length) {
      //   this.oddsService
      //     .getMatchOdds1(this.selectedSportId, ids.join(','))
      //     .subscribe((res: any) => {
      //       if (!res.errorCode) {
      //         res?.forEach((market, index) => {
      //           this.matchDataHome[market.eventId] = market;
      //         });

      //       }
      //     });
      // }
    }
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
    if (this.accountInfo.currencyCode == 'INR') {
      this.isInrCurrency = true;
    }
    // console.log(this.accountInfo)
  }

  QuitCasino() {
    this.oddsService.QuitCasino(this.accountInfo.userName, this.accountInfo.userId).subscribe((resp: any) => {
      // console.log(resp);
      if (resp.errorCode == 0) {

      }
    }, err => {
    })
  }


  awc_login_direct(prod_code, prod_type, prod_name, game_code) {
    if (!this.isLogin) {
      return;
    }
    if (!prod_code || !prod_type) {
      return;
    }
    if (this.isAuthPending) {
      return;
    }
    this.isAuthPending = true;

    // this.QuitCasino();
    $('#page_loading').css('display', 'flex');

    // this.QuitCasino();


    // setTimeout(() => {
    this.oddsService.getAuthCasino(this.accountInfo.userName, this.accountInfo.userId, prod_code, prod_type).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        resp.url = JSON.parse(resp.url)
      }

      if (game_code && prod_name == 'KINGMAKER' && resp.url) {
        resp.url = this.removeParam('gameForbidden', resp.url);
        resp.url = resp.url + '&gameCode=' + game_code + '&isLaunchGame=true&isLaunchGameTable=false';
      }

      if (resp.errorCode == 0 && resp.url) {
        // window.open(JSON.parse(resp.url), '_blank');
        window.open(resp.url, "_self");

      } else {
        alert(resp.errorDescription);
      }
      this.isAuthPending = false;
      $('#page_loading').css('display', 'none');

    }, err => {
      this.isAuthPending = false;
      $('#page_loading').css('display', 'none');

    })
    // },1500)
  }

  removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
      param,
      params_arr = [],
      queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        if (param === key) {
          params_arr.splice(i, 1);
        }
      }
      if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
  }

  listCasinoProduct() {
    this.gamesService.listCasinoProduct().subscribe((resp: any) => {
      if (resp.result) {
        let awcCasinoList_Vnd = [];
        this.awcCasinoList_Vnd.forEach(element2 => {
          resp.result.forEach((element, index) => {

            if (element.product == element2.prod_name || (!element2.prod_code && index == 0)) {
              awcCasinoList_Vnd.push(element2);
            }
          });
        });
        this.awcCasinoList_Vnd = awcCasinoList_Vnd;





        // console.log(this.awcCasinoListTest)


      }
    })
  }


  getLiveCasinoTables() {
    this.gamesService
      .listCasinoTable()
      .subscribe((res: GenericResponse<ICasinoData>) => {
        // console.log(res);
        this.casinoData = res.result[0];
        this.Highlightlist = res.result[0].tables;
      });
  }

  trackByFn(item, index) {
    return item.matchId;
  }


  ngOnDestroy() {
    this.intervalSub.unsubscribe();
  }
}
