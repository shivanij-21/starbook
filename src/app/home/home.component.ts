import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { CommonService } from '../services/common.service';
import { DataFormatService } from '../services/data-format.service';
import { GamesService } from '../services/games.service';
import { OddsServiceService } from '../services/odds-service.service';
import { LEVELS, ShareDataService } from '../services/share-data.service';
import { IHighlight } from './types/highlight';
import { GenericResponse } from '../shared/types/generic-response';
import { ICasinoData, ICasinoTable } from '../sports/types/casino-data';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  activatedTab: number = 1;
  activatedSport: number = 4;
  nextHorseRaces: any = [];
  nextgreyRaces: any = [];
  matchDataHome = {};
  casinoListlist: any = [];

  horseRaces = [];
  greyhoundRaces = [];

  horseLoading = true;
  greyLoading = true;

  subSink = new Subscription();
  selectedTourHorse: any;
  selectedTourGreyhound: any;
  venues: any;
  venuesHorse: any[];
  venuesGrey: any[];
  casinoData: ICasinoData;
  tables: ICasinoTable[];
  sportList = [];

  unSubscribe$ = new Subject();
  Highlightlist: IHighlight[];
  Highlightlists: any;
  isPendingLogin: boolean = false;
  isAuthPending: boolean = false;
  isInrCurrency = false;
  isLogin: boolean = false;
  accountInfo: any;
  subscriptions: any;


  providerList = [
    { "providerName": "Supernowa", "providerCode": "SN", "isBig": true },
    { "providerName": "Ezugi", "providerCode": "EZ", "isBig": false },
    { "providerName": "One Touch", "providerCode": "OT", "isBig": false },
    { "providerName": "Power Games", "providerCode": "PG", "isBig": true },
    { "providerName": "Pragmatic Play", "providerCode": "PP", "isBig": true },
  ];
  snGameAssetsAll = [
    { "name": "Roulette", "code": "RT", "providerCode": "SN", "thumb": "http://files.worldcasinoonline.com/Document/Game/Roulette_1654169469599.867.jpg" },
    { "name": "RNG Worli Matka", "code": "VWM", "providerCode": "SN", "thumb": "http://files.worldcasinoonline.com/Document/Game/5-RNG-Worli-Matka_1654174294949.6729.jpg" },
    { "name": "Heads Or Tails", "code": "HT", "providerCode": "PG", "thumb": "http://files.worldcasinoonline.com/Document/Game/Heads-or-Tails_1654170471388.5208.jpg" },
    { "name": "Crypto Binary", "code": "CRP", "providerCode": "PG", "thumb": "http://files.worldcasinoonline.com/Document/Game/Crypto-Binary_1654170413783.7327.jpg" },
    { "name": "Holdâ€™em Poker", "code": "1", "providerCode": "OT", "thumb": "http://files.worldcasinoonline.com/Document/Game/Holdem-Poker_32_11zon_1661528900527.018.jpg" },
    { "name": "Wild Wild West 2120", "code": "234165", "providerCode": "OT", "thumb": "http://files.worldcasinoonline.com/Document/Game/Wild-Wild-West-2120_5_11zon_1662032499741.5344.jpg" },
    { "name": "Disco Lady", "code": "vs243discolady", "providerCode": "PP", "thumb": "http://files.worldcasinoonline.com/Document/Game/Disco-Lady_1662552356508.9814.jpg" },
    { "name": "Mega Wheel", "code": "801", "providerCode": "PP", "thumb": "http://files.worldcasinoonline.com/Document/Game/Mega-Wheel_1662051227502.8633.jpg" },
    { "name": "Cosmic Cash", "code": "vs40cosmiccash", "providerCode": "PP", "thumb": "http://files.worldcasinoonline.com/Document/Game/Cosmic-Cash_1662551274682.7146.jpg" },
    { "name": "Sweet Bonanza", "code": "vs20fruitsw", "providerCode": "PP", "thumb": "http://files.worldcasinoonline.com/Document/Game/Sweet-Bonanza-Candyland_100_11zon_1662560012257.6707.jpg" },
    { "name": "VIP Fortune Baccarat ", "code": "106", "providerCode": "EZ", "thumb": "http://files.worldcasinoonline.com/Document/Game/vip fortune baccarat_14_11zon_1661787817959.455.png" },
    { "name": "Unlimited Turkish Blackjack", "code": "5051", "providerCode": "EZ", "thumb": "http://files.worldcasinoonline.com/Document/Game/UNLIMITED TURKISH BLACKJACK-min_1662462550467.8113.png" }
  ];

  awcCasinoList_Vnd = [
    // { sr: 9, prod_code: '7', prod_type: '1', name: "ALLBET", prod_name: "ALLBET", prod_type_name: 'LIVE CASINO' },
    // { sr: 9, prod_code: '132', prod_type: '2', name: "KA GAMING", prod_name: "KA GAMING", prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '42', prod_type: '2', name: "QUICK SPIN", prod_name: "QUICK SPIN", prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '45', prod_type: '2', name: "NETENT", prod_name: "NETENT", prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '48', prod_type: '2', name: "BLUEPRINT", prod_name: "BLUEPRINT", prod_type_name: 'SLOT' },
    // { sr: 33, prod_code: '74', prod_type: '2', name: "PLAYSTAR", prod_name: "PLAYSTAR", prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '3', prod_type: '1', name: "SEXY BACCARAT", prod_name: "SEXY BACCARAT", prod_type_name: 'LIVE CASINO' },
    // { sr: 9, prod_code: '117', prod_type: '2', name: "KINGMAKER", prod_name: "KINGMAKER", prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '19', prod_type: '1', name: "DREAM GAMING", prod_name: "DREAM GAMING", prod_type_name: 'LIVE CASINO' },
    // { sr: 9, prod_code: '20', prod_type: '1', name: "KING855", prod_name: "KING855", prod_type_name: 'LIVE CASINO' },
    // { sr: 9, prod_code: '59', prod_type: '2', name: "JILI", prod_name: "JILI", prod_type_name: 'SLOT,FISH HUNTER' },
    // { sr: 9, prod_code: '12', prod_type: '2', name: "SPADE GAMING", prod_name: "SPADE GAMING", prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '107', prod_type: '6', name: "FC FISHING", prod_name: "FC FISHING", prod_type_name: 'FISH HUNTER' },
    // { sr: 9, prod_code: '116', prod_type: '2', name: "RED TIGER", prod_name: "RED TIGER", prod_type_name: 'SLOT' },
    // { sr: 9, prod_code: '152', prod_type: '4', name: "AELOTTO", prod_name: "AELOTTO", prod_type_name: 'LOTTO' },
    // { sr: 9, prod_code: '146', prod_type: '5', name: "1G Poker", prod_name: "1G Poker", prod_type_name: 'LIVE CASINO,CARD AND BOARD' },
    // { sr: 9, prod_code: '39', prod_type: '2', name: "CQ9", prod_name: "CQ9", prod_type_name: 'SLOT,FISH HUNTER' },
    // { sr: 9, prod_code: '148', prod_type: '2', name: "ASIA GAMING", prod_name: "ASIAGAMING", prod_type_name: 'LIVE CASINO,SLOT' },
    // { sr: 9, prod_code: '17', prod_type: '3', name: "M8 SPORT", prod_name: "M8 SPORT", prod_type_name: 'SPORTBOOK' },
    // { sr: 33, prod_code: '144', prod_type: '2', name: "FUNKY GAME", prod_name: "FUNKY GAME", prod_type_name: 'SLOT' },
    // { sr: 33, prod_code: '98', prod_type: '1', name: "ORIENTAL GAMING", prod_name: "ORIENTAL GAMING", prod_type_name: 'LIVE CASINO' },
    // { sr: 33, prod_code: '74', prod_type: '2', name: "PLAYSTAR", prod_name: "PLAYSTAR", prod_type_name: 'SLOT' },
    // { sr: 33, prod_code: '123', prod_type: '2', name: "WORLD MATCH", prod_name: "WORLD MATCH", prod_type_name: 'SLOT' },
    // { sr: 33, prod_code: '129', prod_type: '2', name: "AMEBA", prod_name: "AMEBA", prod_type_name: 'SLOT' },
    { sr: 13, prod_code: '1006', prod_type: '1', name: "EVOLUTION GAMING", prod_name: "EVOLUTION GAMING", prod_type_name: 'LIVE CASINO' },


  ]

  constructor(
    private dataformatService: DataFormatService,
    private oddsService: OddsServiceService,
    private shareDataService: ShareDataService,
    private commonService: CommonService,
    private gamesService: GamesService,
    private tokenService: TokenService,


  ) { }

  ngOnInit(): void {
    this.sportWise();
    this.commonService.apis$.subscribe(res => {
      this.getLiveCasinoTables();
      this.listmeeting()
      this.UserDescription();
      // this.QuitCasino()
      this.listProviders();
      this.listCasinoProduct();



      let sportsDataSub = this.dataformatService.sportsData$.subscribe(
        (sportsData) => {
          if (sportsData) {
            this.horseRaces = HomeComponent.getList(
              sportsData[7.1],
              'tournaments'
            );
            this.greyhoundRaces = HomeComponent.getList(
              sportsData[4339.1],
              'tournaments'
            );
            this.horseLoading = false;
            this.greyLoading = false;

            // console.log(sportsData)

            // console.log(this.horseRaces)
            // console.log(this.greyhoundRaces)


            this.Highlightlist = this.dataformatService.highlightwisedata(
              this.activatedSport
            );

            // console.log(this.Highlightlist)
          }
        }
      );
      this.subSink.add(sportsDataSub);
    })
    if (this.tokenService.getToken()) {
      this.isLogin = true;
    }



    this.shareDataService.setLeftColState({ level: LEVELS.ALL });

    // interval(500).pipe(takeUntil(this.unSubscribe$)).subscribe(() => {
    //   this.selectTab(this.activatedSport, this.activatedSport);
    // })

    let oddsInterval = interval(500).subscribe(() => {
      this.selectTab(this.activatedTab, this.activatedSport);
      if (this.Highlightlist?.length && oddsInterval) oddsInterval.unsubscribe();
    });

    this.subSink.add(
      interval(60000).subscribe(() => {
        this.selectTab(this.activatedTab, this.activatedSport);
      })
    );

    this.sportWise();
    this.sportList = this.dataformatService.headerSportsList;

    this.casinoListlist = [
    
      { "tableName": "Live Teenpatti", "CasinoName": "LiveTP", "opentable": 56767 },
      { "tableName": "Andar Bahar", "CasinoName": "Andar-Bahar", "opentable": 87564 },
     { "tableName": "Poker", "CasinoName": "Poker1Day", "opentable": 67564 },
     { "tableName": "7 up & Down", "CasinoName": "7Up-Down", "opentable": 98789 },
     { "tableName": "Roulette", "CasinoName": "Roulette", "opentable": 98788 },
     { "tableName": "Sicbo", "CasinoName": "Sicbo", "opentable": 98566 },
     { "tableName": "32 cards casino", "CasinoName": "32Cards", "opentable": 56967 },
     { "tableName": "Hi Low", "CasinoName": "Hi-Low", "opentable": 56968 },
     { "tableName": "Worli Matka", "CasinoName": "Matka", "opentable": 92037 },
     { "tableName": "Baccarat", "CasinoName": "Baccarat", "opentable": 92038 },
     { "tableName": "Six player poker", "CasinoName": "Poker6P", "opentable": 67565 },
     { "tableName": "Teenpatti T20", "CasinoName": "TP T20", "opentable": 56768 },
     { "tableName": "Amar Akbar Anthony", "CasinoName": "AAA", "opentable": 98791 },
      { "tableName": "Dragon Tiger", "CasinoName": "Dragon-Tiger", "opentable": 98790 },
     { "tableName": "Race 20-20", "CasinoName": "Race 20-20", "opentable": 90100 },
     { "tableName": "Bollywood Casino", "CasinoName": "Bollywood", "opentable": 67570 },
     { "tableName": "Casino Meter", "CasinoName": "Casino Meter", "opentable": 67575 },
     { "tableName": "Casino War", "CasinoName": "Casino War", "opentable": 67580 },
     { "tableName": "Poker 20-20", "CasinoName": "Poker2020", "opentable": 67567 },
     { "tableName": "Muflis Teenpatti", "CasinoName": "MuflisTP", "opentable": 67600 },
     { "tableName": "Trio", "CasinoName": "MuflisTP", "opentable": 67610 },
     { "tableName": "2 Cards Teenpatti", "CasinoName": "2CardTP", "opentable": 67660 },
     { "tableName": "The Trap", "CasinoName": "Trap", "opentable": 67680 },
     { "tableName": "Teenpatti Test", "CasinoName": "TPTest", "opentable": 67630 },
     { "tableName": "Queen", "CasinoName": "Queen", "opentable": 67620 },
     { "tableName": "Teenpatti Open", "CasinoName": "Race to 17", "opentable": 67640 },
     { "tableName": "29 Card Baccarat", "CasinoName": "29 Card Baccarat", "opentable": 67690 },
     { "tableName": "Race to 17", "CasinoName": "Race to 17", "opentable": 67710 },



  
     
     { "tableName": "Six player poker (Virtual)", "CasinoName": "Poker6P (V)", "opentable": 67566 },
     { "tableName": "Teenpatti One-Day (Virtual)", "CasinoName": "TPOneDay (V)", "opentable": 56766 },
     { "tableName": "Andar Bahar (Virtual)", "CasinoName": "AB (V)", "opentable": 87565 },
     { "tableName": "Teenpatti T20 (Virtual)", "CasinoName": "TP T20 (V)", "opentable": 56769 },
     { "tableName": "Hi Low (Virtual)", "CasinoName": "High-Low (V)", "opentable": 56969 },
     { "tableName": "Poker  (Virtual)", "CasinoName": "Poker (V)", "opentable": 67563 },
     { "tableName": "Matka (Virtual)", "CasinoName": "Mataka (V)", "opentable": 92036 },
     { "tableName": "7 up & Down (Virtual)", "CasinoName": "7Up-Down (V)", "opentable": 98793 },
     { "tableName": "Dragon Tiger (Virtual)", "CasinoName": "DT (V)", "opentable": 98794 },
     { "tableName": "Amar Akbar Anthony (Virtual)", "CasinoName": "AAA (V)", "opentable": 98795 },
     { "tableName": "Roulette (Virtual)", "CasinoName": "Roulette (V)", "opentable": 98792 },
     { "tableName": "32 cards casino (Virtual)", "CasinoName": "32Cards (V)", "opentable": 56966 },
  
  

  
   ];
  }

  static getList(obj, field, day?: number) {
    let list = [];
    if (obj) {
      Object.values(obj?.[field]).forEach((val: any) => {
        if (day) {
          if (val.day === day) {
            list.push(val);
          }
        } else {
          list.push(val);
        }
      });
    }
    return list;
  }

  selectItemHorse(tour) {
    this.selectedTourHorse = tour;
    this.venuesHorse = HomeComponent.getList(tour, 'matches');
  }

  selectItemGreyhound(tour) {
    this.selectedTourGreyhound = tour;
    this.venuesGrey = HomeComponent.getList(tour, 'matches');
  }

  selectTab(tabNumber: number, sportId?: number) {
    this.Highlightlist = this.dataformatService.highlightwisedata(sportId);
    // console.log(this.Highlightlist)
    if (sportId != 52) {
      var ids = [];
      this.Highlightlist?.forEach((match, index) => {
        if (sportId === +match.SportbfId) {
          ids.push(match.bfId);
        }
      });
      if (ids?.length) {
        this.oddsService
          .getMatchOdds(sportId, ids.join(','))
          .subscribe((res: any) => {
            if (!res.errorCode) {
              res?.forEach((market) => {
                this.matchDataHome[market.eventId] = market;
              });
            }
          });
      }
      // if (ids?.length) {
      //   this.oddsService
      //     .getMatchOdds1(sportId, ids.join(','))
      //     .subscribe((res: any) => {
      //       if (!res.errorCode) {
      //         //console.log(res);
      //         res?.forEach((market, index) => {
      //           this.matchDataHome[market.eventId] = market;
      //         });

      //       }
      //     });
      // }

    }

    this.activatedTab = tabNumber;
    this.activatedSport = sportId;
  }


  listmeeting() {
    this.commonService.apis$.subscribe(res => {
      let sportsDataSub = this.dataformatService.sportsData$.subscribe(
        (sportsData) => {
          if (sportsData) {
            // this.nextHorseRaces = HomeComponent.getList(
            //   sportsData[7.1],
            //   'tournaments'
            // );
            this.nextHorseRaces = this.dataformatService.getNextRacingFormat(sportsData[7.1]);
            this.nextgreyRaces = this.dataformatService.getNextRacingFormat(sportsData[4339.1]);

            // console.log( this.nextHorseRaces)
          }
        }
      );
      // this.gamesService.horseRacingGamesToday().subscribe((resp) => {
      //   if (resp) {
      //     this.nextHorseRaces = this.dataformatService.getNextRacingFormat(resp);        
      //   }
      // })
      // this.gamesService.greyhoundGamesToday().subscribe((resp) => {
      //   if (resp) {
      //     this.nextgreyRaces = this.dataformatService.getNextRacingFormat(resp);

      //   }
      // })
    });
  }
  listProviders() {
    this.oddsService.listProviders().subscribe((resp: any) => {
      let sn_providerlist = [];
      this.providerList.forEach(element2 => {
        resp.result.forEach((element, index) => {
          if (element.providerName == element2.providerName) {
            sn_providerlist.push(element2);
          }
        });
      });
      this.providerList = sn_providerlist;
      // console.log(this.providerList);

      $('#page_loading').css('display', 'none');
      if (this.providerList.length > 0) {
        // this.getSNcasinoAssetsList(this.providerList[0].providerCode);
        this.getSNcasinoAssetsList('all');
      }
    },
      error => {
        $('#page_loading').css('display', 'none');
        console.log(error);
      })
  }
  getSNcasinoAssetsList(providerCode) {
    this.oddsService.supernowaGameAssetsList(providerCode).subscribe((resp: any) => {
      // console.log(resp);
      let selectedGameassets = [];
      if (resp.status.code == "SUCCESS") {
        let snGameAssetsAll = resp.games;
        snGameAssetsAll.filter((pro) => {
          return this.providerList.some((game) => {
            return pro.providerCode === game.providerCode;
          });
        });
        this.snGameAssetsAll.forEach(element2 => {
          snGameAssetsAll.forEach((element, index) => {
            if (element.name === element2.name && element.providerCode === element2.providerCode) {
              selectedGameassets.push(element2);
            }
          });
        });
        this.snGameAssetsAll = selectedGameassets;
        // console.log(this.snGameAssetsAll);

      } else {
        this.snGameAssetsAll = [];
      }
      // $('#page_loading').css('display', 'none');
    },
      error => {
        $('#page_loading').css('display', 'none');
        console.log(error);
      })
  }

  sportWise() {
    this.sportList = this.dataformatService.headerSportsList;
    // console.log(this.sportList);
    this.subscriptions?.add(
      this.dataformatService.sportsData$.subscribe((sportsData) => {
        if (sportsData) {
          // console.log(this.sportList);
        }
      })
    );
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

  getLiveCasinoTables() {
    this.gamesService.listCasinoTable().subscribe((res: any) => {
      // console.log(this.Highlightlists);
      this.casinoData = res.result[0];
      this.Highlightlists = res.result[0].tables;
    });
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

  trackByFn(item, index) {
    return item.matchId;
  }


  trackByMatchId(item, index) {
    return item.matchId;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
