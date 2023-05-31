import { MediaMatcher } from '@angular/cdk/layout';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { interval, Subject, Subscription } from 'rxjs';
import { BetsService } from 'src/app/fullmarket/services/bets.service';
import { FullmarketService } from 'src/app/fullmarket/services/fullmarket.service';
import { IBetslipData } from 'src/app/fullmarket/types/betslip-data';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import {
  IStake,
  SettingsService,
  STAKE_LIST,
} from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { IOpenBets } from 'src/app/shared/types/open-bets';
import * as _ from 'underscore';
import { CasinoService } from '../services/casino-service.service';
import { ICasinoBetData } from '../types/casino-betdata';

import { casinoUrlMap } from './tvurlMap';

@Component({
  selector: 'app-casino-fullmarket',
  templateUrl: './casino-fullmarket.component.html',
  styleUrls: ['./casino-fullmarket.component.scss'],
})
export class CasinoFullmarketComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  sportId: number;
  tableId: number;
  tableName: string;
  matchName: string;
  streamServer: string;
  streamUrl: string;
  oddServer1: string;
  oddServer2: string;
  oddsPort: string;
  tvUrl: any;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  iframeWidth;
  iframeHeight;
  isAverageBets: boolean;
  matchedData: IOpenBets[];
  matchedDataHolder: IOpenBets[];

  unMatchedData: IOpenBets[];
  unMatchedDataHolder: IOpenBets[];
  backBetSlipDataArray: any[] = [];
  layBetSlipDataArray: any[] = [];
  backTeenSlipDataArray: any[] = [];
  backBetSlipList: any[];
  layBetSlipList: any[];
  yesBetSlipList: any[];
  noBetSlipList: any[];
  backBookBetSlipList: any[];
  layBookBetSlipList: any[];
  liabilities: number;
  ExpoMktid: any;
  bets: any;
  liabilityBack: number;
  liabilityBackBook: number;
  liabilityYes: number;
  liabilityLay: number;
  liabilityLayBook: number;
  liabilityNo: number;
  stake: number;
  exposureBook: any;
  cards: any[] = [];
  placeTPData: any;

  stakeList: IStake[];

  disablePlaceBet: boolean = false;
  timeRemaining: any;
  betDelay: any;
  timeRemainingRef: any;
  placedButton: boolean;

  placeMarketData: IBetslipData;
  subSink: Subscription;
  min: any;
  max: any;
  marketMinMax: any;
  resultPort: any;
  oddsDataUrl1: string;
  oddsResultUrl1: string;
  oddsDataUrl2: string;
  oddsResultUrl2: string;
  tpData: any;
  tpMarket?: any;
  clock: any;
  AndarValues: any[];
  BaharValues: any[];
  andar_bahar: any[] = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  result_string: any[] = ['0', 'A', 'B', 'C', 'D', 'E', 'F'];
  Aallcards: any[];
  Ballcards: any[];
  Aresults: any[];
  Bresults: any[];
  CardValues: any[];
  DescValues: any[];
  t3Data: any;
  lowValues: any[] = [];
  highValues: any[] = [];
  roundId: any;
  previousRoundId: any;
  resultCount: number = 0;
  resultsdata: any;

  p8: any = [];
  p9: any = [];
  p10: any = [];
  p11: any = [];

  betSlipEvents = new Subject<any>();
  profit: number;
  top: number;
  top1: number;
  bMTopCss: { top: string; cursor: string };
  resultModalRef: BsModalRef;
  ruleModalRef: BsModalRef;
  result;
  resultCards: any;
  resultSid: any;
  resultRoundId: any;
  gtype: any;
  highCards = ['10', 'J', 'Q', 'K'];
  resultHC: any;
  resultLC: any;
  seletedCards: any;
  betData: any;
  pieChartObject: any = {

  };
  title = '';
  isOpenToggle: boolean;
  toggleTab: () => void;



  type = 'PieChart';
  mydata = [

  ];
  columnNames = ['Browser', 'Percentage'];
  options = {
    is3D: true,
    backgroundColor: '#eee',
    slices: [{ color: 'rgb(8, 108, 184)' }, { color: 'rgb(131, 25, 36)' }, { color: 'rgb(39, 149, 50)' }],
    legend: {
      'position': 'right'
    },
    chartArea: {
      'left': '2%',
      'top': '2%',
      'bottom': '2%',
      'width': '100%',
      'height': '100%'
    },
  };
  width = 209;
  height = 160;
  resultCards1: Object;
  matchid: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private mediaMatcher: MediaMatcher,
    private settingsService: SettingsService,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
    private betsService: BetsService,
    private fullMarketService: FullmarketService,
    private casinoService: CasinoService,
    private commonService: CommonService,
    private modalService: BsModalService
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 499px)');

    if (this.mobileQuery.matches) {
      this.iframeWidth = window.innerWidth - 4;
      this.iframeHeight = Math.ceil(this.iframeWidth / 1.778);
    } else {
      this.iframeWidth = '100%';
      this.iframeHeight = '400';
    }
    this.mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.iframeWidth = window.innerWidth - 4;
        this.iframeHeight = Math.ceil(this.iframeWidth / 1.778);
      } else {
        this.iframeWidth = '100%';
        this.iframeHeight = '400';
      }
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);

    this.subSink = new Subscription();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (this.subSink) this.subSink.unsubscribe();
      this.subSink = new Subscription();
      this.subSink.add(() => {
        this.tableName = null;
        this.matchName = null;
        this.tableId = null;
        this.streamUrl = null;
        this.oddsPort = null;
        this.tvUrl = null;
        this.oddsDataUrl1 = null;
        this.oddsResultUrl1 = null;
        this.oddsDataUrl2 = null;
        this.oddsResultUrl2 = null;
      });
      this.tableName = params.tableName;
      this.matchName = params.tableName;
      this.tableId = params.tableId;
      this.streamServer = params.streamServer;
      this.streamUrl = params.streamUrl;
      this.oddServer1 = params.oddServer1;
      this.oddServer2 = params.oddServer2;
      this.oddsPort = params.oddsUrl;
      this.resultPort = params.resultUrl;
      this.gtype = params.resultUrl.split('/')[2];

      this.tvUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        casinoUrlMap[this.tableName]
      );

      this.oddsDataUrl1 = this.oddServer1 + this.oddsPort;

      this.oddsResultUrl1 = this.oddServer1 + this.resultPort;
      // console.log(this.oddsResultUrl1);

      this.oddsDataUrl2 = this.oddServer2 + this.oddsPort;

      this.oddsResultUrl2 = this.oddServer2 + this.resultPort;
    });
  }

  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.oddServer1 = res.casinoApi + '/api';
      this.oddsDataUrl1 = this.oddServer1 + this.oddsPort;
      this.oddsResultUrl1 = this.oddServer1 + this.resultPort;

      this.oddsDataUrl2 = this.oddServer2 + this.oddsPort;

      this.oddsResultUrl2 = this.oddServer2 + this.resultPort;
      // console.log(this.oddsResultUrl1);
      this.loadEvent();

    });

    this.getOpenBets();
    this.initTable();
    this.clock = (<any>$('.flipclock')).FlipClock(99, { clockFace: 'Counter' });
  }

  ngAfterViewChecked() { }

  initTable() {
    // this.loadEvent();
    this.settingsService.stakeList$.subscribe((stakeList) => {
      this.stakeList = stakeList;
    });
    window.addEventListener('storage', (event) => {
      if (event.key === STAKE_LIST) {
        this.stakeList = JSON.parse(event.newValue);
      }
    });
    this.subSink.add(
      interval(5000).subscribe(() => {
        // this.loadEvent();
      })
    );
    this.subSink.add(
      interval(1000).subscribe(() => {
        this.callOddsData();
      })
    );

    // this.callOddsResult();
  }

  setBetTimeout() {
    // if(!this.betDelay){
    this.betDelay = 0;
    // }
    this.timeRemaining = this.betDelay;
    this.updateTimeout();
  }

  updateTimeout() {
    if (this.timeRemaining !== 0) {
      if (this.timeRemainingRef) {
        clearTimeout(this.timeRemainingRef);
      }
      this.timeRemainingRef = setTimeout(() => {
        this.timeRemaining -= 1;
        this.updateTimeout();
      }, 500);
    }
  }

  openTeenbetSlip(
    event,
    backlay,
    odds,
    runnerName,
    runnerId,
    gameId,
    gameType,
    matchName,
    sportId,
    runnerindex,
    card
  ) {
    // console.log(
    //   backlay,
    //   odds,
    //   runnerName,
    //   runnerId,
    //   gameId,
    //   gameType,
    //   matchName,
    //   sportId,
    //   runnerindex,
    //   card
    // );
    if (backlay == 'back' || backlay == 'lay') {
      this.removeAllBetSlip('remove');
    } else {
      this.removeAllBetSlip();
    }

    if (this.placeTPData) {
      if (this.placeTPData.backlay != backlay) {
        this.removeAllBetSlip();
      }
    }

    // console.log(backlay, odds, runnerName, runnerId, gameId, gameType);
    this.placeTPData = {
      backlay: backlay,
      gameType: gameType,
      odds: odds,
      runnerName: runnerName,
      runnerId: runnerId,
      stake: 0,
      profit: 0,
      gameId: gameId,
      matchname: matchName,

    };
    if (this.placeTPData.gameType === '-23') {
      // this.placeTPData.odds = parseFloat(this.placeTPData.odds) / 100 + 1;
    }

    // if (this.tableId == -9) {
    //   if(odds){
    //     odds = parseFloat(odds) + 1;
    //   }

    // }

    if (this.placeTPData.gameType === '-9') {
      this.placeTPData.odds = parseFloat(this.placeTPData.odds) + 1;
    }


    if (this.placeTPData.gameType === '-12') {
      this.placeTPData.odds = parseFloat(this.placeTPData.odds) / 100 + 1;
    }


    if (card) {
      if (this.cards?.length < 3) {

        let indexcheck = this.cards.indexOf(card);

        if (indexcheck == -1) {
          this.cards.push(card);
          this.cards = this.cards.sort((a, b) => (a > b ? 1 : 0));
        }
      }

    }

    if (this.cards && this.cards.length != 0) {
      this.placeTPData['cards'] = this.cards;
      this.placeTPData.runnerName =
        // this.placeTPData.runnerName + ' ' + this.placeTPData.cards.join('');
        this.placeTPData.runnerName = this.placeTPData.runnerName + ' ' + this.cards.toString().replace(/,/g, "");
    }
    if (this.placeTPData.stake != '' || this.placeTPData.stake != 0) {
      if (
        this.placeTPData.backlay == 'back' ||
        this.placeTPData.backlay == 'lay'
      ) {
        if (this.placeTPData.gameType === '-12') {
          let odds = parseFloat(this.placeTPData.odds) / 100 + 1;
          this.placeTPData.profit = (
            (+odds - 1) *
            parseFloat(this.placeTPData.stake)
          ).toFixed();
        } else {
          this.placeTPData.profit = (
            (parseFloat(this.placeTPData.odds) - 1) *
            parseFloat(this.placeTPData.stake)
          ).toFixed();
        }
      }
    } else {
      this.profit = 0.0;
    }
    this.backTeenSlipDataArray.push(this.placeTPData);
    this.backTeenSlipDataArray = this.removeDuplicates(
      this.backTeenSlipDataArray
    );

    $('.back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3').removeClass('select');
    var element = $(event.currentTarget);
    element.addClass('select');
  }

  selected3cardj(card: any, backlay: any): any {
    let select = false;
    if (!this.placeTPData) {
      return select;
    }

    if (this.placeTPData.backlay == backlay) {
      let indexcheck = this.cards.indexOf(card);
      if (indexcheck > -1) {
        return select = true;
      }
    }
  };

  removeAllBetSlip(remove?: string) {
    this.placeTPData = null;

    this.backBetSlipDataArray = [];
    this.layBetSlipDataArray = [];

    this.backTeenSlipDataArray = [];

    this.backBetSlipList = [];
    this.layBetSlipList = [];

    this.yesBetSlipList = [];
    this.noBetSlipList = [];

    this.backBookBetSlipList = [];
    this.layBookBetSlipList = [];

    // this.finalStakeValue = null;
    this.calculateLiability();
    this.liabilities = 0.0;

    $('#fancyBetMarketList .lay-1').removeClass('select');
    $('#fancyBetMarketList .back-1').removeClass('select');
    $('.casino-market .select').removeClass('select');

    if (this.ExpoMktid != undefined) {
      this.bets.stake = 0;
      this.bets.profit = 0;
      this.calcExposure(this.ExpoMktid, this.bets, 'remove');
    }
    if (remove == undefined) {
      // console.log(this.ExpoMktid)
      if (this.ExpoMktid != undefined) {
        this.bets.stake = 0;
        this.bets.profit = 0;
      }
      this.calcExposure(this.ExpoMktid, this.bets, 'remove');
    }
  }

  calcExposure(mktid: any, betSlipData: IBetslipData, remove?: string) {
    if (mktid == undefined) {
      return false;
    }
    try {
      this.exposureBook = JSON.parse(localStorage.getItem('Exposure_' + mktid));
    } catch (e) { }
    if (this.exposureBook == null) {
      return false;
    }
    this.ExpoMktid = mktid;
    this.bets = betSlipData;
    if (remove == 'remove') {
      // Object.keys(this.exposureBook).forEach((item) => {
      //   let value = this.exposureBook[item];
      //   $('#exposureAfter_' + item + '').css('display', 'none');
      //   $('#exposureAfter_' + item + '').text(parseFloat(value).toFixed(2));
      //   if ($('#exposureAfter_' + item + '').hasClass('to-lose'))
      //     $('#exposureAfter_' + item + '').removeClass('to-lose');
      //   if ($('#exposureAfter_' + item + '').hasClass('to-win'))
      //     $('#exposureAfter_' + item + '').removeClass('to-win');
      //   if (value >= 0) $('#exposureAfter_' + item + '').addClass('to-win');
      //   else $('#exposureAfter_' + item + '').addClass('to-lose');
      // });
    } else {
      Object.keys(this.exposureBook).forEach((item, index) => {
        let value = this.exposureBook[item];
        let newValue = 0;
        let betStake = 0;
        if (this.bets.backlay == 'back') {
          if (item == this.bets.selectionId) {
            newValue = parseFloat(value) + parseFloat(this.bets.profit);
            this.exposureBook[item] = newValue;
          } else {
            if (this.bets.stake == '') {
              betStake = 0;
            } else {
              betStake = this.bets.stake;
            }
            newValue = parseFloat(value) - betStake;
            this.exposureBook[item] = newValue;
          }
        } else {
          if (item == this.bets.selectionId) {
            newValue = parseFloat(value) - parseFloat(this.bets.profit);
            this.exposureBook[item] = newValue;
          } else {
            if (this.bets.stake == '') {
              betStake = 0;
            } else {
              betStake = this.bets.stake;
            }
            newValue = parseFloat(value) + betStake;
            this.exposureBook[item] = newValue;
          }
        }
      });
      // Object.keys(this.exposureBook).forEach((item) => {

      //   let value = this.exposureBook[item];
      //   $('#exposureAfter_' + item + '').css('display', 'inline');
      //   $('#exposureAfter_' + item + '').text(parseFloat(value).toFixed(2));
      //   if ($('#exposureAfter_' + item + '').hasClass('to-lose'))
      //     $('#exposureAfter_' + item + '').removeClass('to-lose');
      //   if ($('#exposureAfter_' + item + '').hasClass('to-win'))
      //     $('#exposureAfter_' + item + '').removeClass('to-win');
      //   if (value >= 0)
      //     $('#exposureAfter_' + item + '').addClass('to-win actualPnl');
      //   else $('#exposureAfter_' + item + '').addClass('to-lose minusval');
      // });
    }
  }
  calculateLiability() {
    this.liabilities = 0.0;
    this.liabilityBack = 0.0;
    this.liabilityBackBook = 0.0;

    this.liabilityYes = 0.0;
    this.liabilityLay = 0.0;
    this.liabilityLayBook = 0.0;

    this.liabilityNo = 0.0;
    this.stake = 0;

    _.forEach(this.backBetSlipDataArray, (item) => {
      _.forEach(item.backBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null) {
          this.stake = 0;
        }
        this.liabilityBack = this.liabilityBack + this.stake;
      });
      _.forEach(item.yesBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null) {
          this.stake = 0;
        }
        this.liabilityYes = this.liabilityYes + this.stake;
      });
      _.forEach(item.backBookBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null) {
          this.stake = 0;
        }
        this.liabilityBackBook = this.liabilityBackBook + this.stake;
      });
    });
    _.forEach(this.layBetSlipDataArray, (item) => {
      _.forEach(item.layBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null) {
          this.stake = 0;
        }
        this.liabilityLay = this.liabilityLay + this.stake;
      });
      _.forEach(item.noBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null) {
          this.stake = 0;
        }
        this.liabilityNo = this.liabilityNo + this.stake;
      });
      _.forEach(item.layBookBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null) {
          this.stake = 0;
        }
        this.liabilityLayBook = this.liabilityLayBook + this.stake;
      });
    });

    if (!!!this.liabilityBack) {
      this.liabilityBack = 0.0;
    }
    if (!!!this.liabilityYes) {
      this.liabilityYes = 0.0;
    }
    if (!!!this.liabilityLay) {
      this.liabilityLay = 0.0;
    }
    if (!!!this.liabilityNo) {
      this.liabilityNo = 0.0;
    }
    if (!!!this.liabilityBackBook) {
      this.liabilityBackBook = 0.0;
    }
    if (!!!this.liabilityLayBook) {
      this.liabilityLayBook = 0.0;
    }
    this.liabilities =
      this.liabilities +
      (this.liabilityBack +
        this.liabilityYes +
        this.liabilityBackBook +
        this.liabilityLay +
        this.liabilityNo +
        this.liabilityLayBook);
  }

  removeDuplicates(betSlipArray: any[]): any {
    let obj = {},
      collection = [];

    _.each(betSlipArray, (value) => {
      if (!obj[value.matchname]) {
        obj[value.matchname];
        collection.push(value);
      }
    });
    return collection;
  }

  loadEvent() {
    this.fullMarketService
      .loadEvent(this.tableName, true)
      .subscribe((res: GenericResponse<any>) => {
        if (res.errorCode == 0) {
          this.betDelay = res.result[0].betDelay;
          this.min = res.result[0].min;
          this.max = res.result[0].max;
          this.marketMinMax = res.result[0].markets;
        }
      });
  }

  public getCardSymbolImg(cardName) {
    if (!cardName || cardName == '1') {
      return '';
    }
    let char = '';
    let type = '';
    let className = '';
    let value = '';
    if (cardName.length == 4) {
      char = cardName.substring(0, 2);
      type = cardName.slice(2);
    } else {
      char = cardName.charAt(0);
      type = cardName.slice(1);
    }
    switch (type) {
      case 'HH':
        type = '}';
        className = 'card-black';
        break;
      case 'DD':
        type = '{';
        className = 'card-red';
        break;
      case 'CC':
        type = ']';
        className = 'card-black';
        break;
      case 'SS':
        type = '[';
        className = 'card-red';
        break;
    }

    value = char + '<span class="' + className + '">' + type + '</span>';

    return value;
  }

  callOddsData() {
    let sub = this.casinoService
      .callOddsData(this.oddsDataUrl1)
      .subscribe((res) => {
        // clearTimeout(timeoutRef);
        if (res) {
          this.setOddsData(res);
        }
      });

    // let timeoutRef = setTimeout(() => {
    //   sub.unsubscribe();
    //   this.casinoService.callOddsData(this.oddsResultUrl2).subscribe((res) => {
    //     this.setOddsData(res);
    //   });
    // }, 3000);
  }

  setOddsData(response) {
    if (this.tableId == -12) {
      if (response.data && response.data.bf) {
        this.tpData = response.data.bf[0];
        this.tpMarket = response.data.bf;
      }
      if (this.tpMarket && this.tpMarket[0] && this.tpMarket[0].lasttime) {
        this.clock.setValue(this.tpMarket[0].lasttime);
      }
    } else if (this.tableId == -5) {
      // console.log(data.data);
      this.AndarValues = [];
      this.BaharValues = [];
      this.Aallcards = [];
      this.Ballcards = [];
      this.Aresults = [];
      this.Bresults = [];

      if (response.data) {
        this.tpData = response.data.t1
          ? response.data.t1[0]
          : response.data.t1[0];
        this.tpMarket = response.data ? response.data.t2 : response.data.t2;
        // console.log(response.data);
      }
      let cardsData = response.data ? response.data.t3 : response.data.t3;
      if (cardsData[0].aall != '') {
        this.Aallcards = cardsData[0].aall.split(',');
      }
      if (cardsData[0].ball != '') {
        this.Ballcards = cardsData[0].ball.split(',');
      }
      if (cardsData[0].ar != '') {
        this.Aresults = cardsData[0].ar.split(',');
      }
      if (cardsData[0].br != '') {
        this.Bresults = cardsData[0].br.split(',');
      }
      _.forEach(this.tpMarket, function (item, index) {
        var andarbaharnat = item.nation.split(' ');

        if (andarbaharnat[0] == 'Ander') {
          this.AndarValues.push(item);
        }
        if (andarbaharnat[0] == 'Bahar') {
          this.BaharValues.push(item);
        }
      });
      this.clock.setValue(this.tpData.autotime);
    } else if (this.tableId == -14) {
      this.CardValues = [];

      // this.tpData = response.data.t1[0];
      // this.tpMarket = response.data.t2;
      // if (this.tpData.cards != "") {
      //   this.CardValues = this.tpData.cards.split(",");
      // }
      // this.clock.setValue(this.tpData.autotime);

      if (response.data) {
        this.tpData = response.data.t1[0];
        this.tpMarket = response.data.t2;
        if (this.tpData.cards != '') {
          this.CardValues = this.tpData.cards.split(',');
        }
        this.clock.setValue(this.tpData.autotime);
      }
    } else if (
      this.tableId == -24 ||
      this.tableId == -25 ||
      this.tableId == -4
    ) {
      this.DescValues = [];

      this.tpData = response.data ? response.data.t1[0] : response.data.t1[0];
      this.tpMarket = response.data ? response.data.t2 : response.data.t2;
      if (this.tpData.desc != '') {
        this.DescValues = this.tpData.desc.split(',');
      }
      let p8 = [];
      let p9 = [];
      let p10 = [];
      let p11 = [];

      _.forEach(this.DescValues, function (value: any, index: number) {
        if (index == 0 || index == 4 || index == 8 || index == 12 || index == 16 || index == 20 || index == 24 || index == 28) {
          if (value != '1') {
            p8.push(value);
          }
        }
        if (index == 1 || index == 5 || index == 9 || index == 13 || index == 17 || index == 21 || index == 25 || index == 29) {
          if (value != '1') {
            p9.push(value);
          }
        }
        if (index == 2 || index == 6 || index == 10 || index == 14 || index == 18 || index == 22 || index == 26 || index == 30) {
          if (value != '1') {
            p10.push(value);
          }
        }
        if (index == 3 || index == 7 || index == 11 || index == 15 || index == 119 || index == 23 || index == 27 || index == 31) {
          if (value != '1') {
            p11.push(value);
          }
        }
      });

      this.p8 = p8;
      this.p9 = p9;
      this.p10 = p10;
      this.p11 = p11;

      this.clock.setValue(this.tpData.autotime);
    } else if (this.tableId == -20) {
      this.DescValues = [];

      this.tpData = response.data ? response.data.t1[0] : response.data.t1[0];
      this.tpMarket = response.data ? response.data.t2 : response.data.t2;
      if (this.tpData.desc != '') {
        this.DescValues = this.tpData.desc.split('##');
      }
      this.clock.setValue(this.tpData.autotime);
    } else if (this.tableId == -19) {
      this.DescValues = [];

      this.tpData = response.data ? response.data.t1[0] : response.data.t1[0];
      this.tpMarket = response.data ? response.data.t2 : response.data.t2;
      this.t3Data = response.data ? response.data.t3 : response.data.t3;
      if (this.tpData.desc != '') {
        this.DescValues = this.tpData.desc.split('##');
      }
      this.clock.setValue(this.tpData.autotime);
    } else if (this.tableId == -3) {
      this.DescValues = [];

      this.tpData = response.data ? response.data.t1[0] : response.data.t1[0];
      this.tpMarket = response.data ? response.data.t2 : response.data.t2;
      this.t3Data = response.data ? response.data.t3 : response.data.t3;
      this.clock.setValue(this.tpData.autotime);
    } else if (this.tableId == -16) {
      this.CardValues = [];
      this.lowValues = [];
      this.highValues = [];

      this.tpData = response.data ? response.data.t1[0] : response.data.t1[0];
      this.tpMarket = response.data ? response.data.t2 : response.data.t2;
      if (this.tpData.cards != '') {
        this.CardValues = this.tpData.cards.split(',');
      }

      this.CardValues.forEach((item) => {
        if (item != 1) {
          let firstChr = item.substr(0, 1);
          if (item.length == 4) {
            firstChr = item.substr(0, 2);
          }
          if (
            firstChr == '10' ||
            firstChr == 'J' ||
            firstChr == 'Q' ||
            firstChr == 'K'
          ) {
            this.highValues.push(item);
          } else {
            this.lowValues.push(item);
          }
        }
      });
      this.clock.setValue(this.tpData.autotime);
    } else {
      this.tpData = response.data && response.data.t1 && response.data.t1[0];
      this.tpMarket = response.data && response.data.t2;
      this.clock.setValue(this.tpData.autotime);
    }

    this.roundId = +(this.tableId == -12
      ? this.tpData?.marketId?.split('.')[1]
      : this.tpData?.mid?.split('.')[1]);

    if (isNaN(this.roundId)) {
      return false;
    }

    if (!this.previousRoundId) {
      this.previousRoundId = this.roundId;
      this.ExposureBookTeenPatti(this.matchName, this.roundId, 1);
      this.callOddsResult();
    }

    if (this.roundId != this.previousRoundId) {
      this.previousRoundId = this.roundId;
      if ($('[id^=Tp_]').length) {
        $('[id^=Tp_]').text('0').css('color', 'black');
      }

      Object.keys(this.tpMarket).forEach((key, index) => {
        index = index + 1;
        $('#Tp_' + this.matchName + '_' + index).text(0);
        $('#Tpm_' + this.matchName + '_' + index).text(0);
      })
      this.userService.getBets();
      this.callOddsResult();
    }
  }

  callOddsResult() {
    let sub = this.casinoService
      .callOddsResult(this.oddsResultUrl1)
      .subscribe((res) => {
        this.setOddsResult(res);
      });

    // let timeoutRef = setTimeout(() => {
    //   sub.unsubscribe();
    //   this.casinoService
    //     .callOddsResult(this.oddsResultUrl2)
    //     .subscribe((res) => {
    //       this.setOddsResult(res);
    //     });
    // }, 3000);
  }

  setOddsResult(response) {
    // console.log("setOddsResult",response);
    this.mydata = [];
    this.resultsdata = response.data;
    if (this.tableId == -9) {
      if (response.graphdata) {
        // this.pieChartObject.data.rows[0].c[1].v = response.data.graphdata.P;
        // this.pieChartObject.data.rows[1].c[1].v = response.data.graphdata.B;
        // this.pieChartObject.data.rows[2].c[1].v = response.data.graphdata.T;
        this.mydata.push(['Player', response.graphdata.P]);
        this.mydata.push(['Banker', response.graphdata.B]);
        this.mydata.push(['Tie', response.graphdata.T]);
      }
    }
    this.resultCount = 0;
  }

  callResult(resultTemp, roundId) {
    // console.log("roundId", roundId);
    if (!this.oddServer1) {
      return;
    }
    this.resultRoundId = roundId.split('.')[1];
    this.casinoService
      .callResult(`${this.oddServer1}/r_result/${this.gtype}/${roundId}`)
      .subscribe((res) => {
        this.result = res;
        this.resultCards = res;
        try {
          this.resultCards = this.result.data[0].cards.split(',');
          // if (tableId == -14) {
          this.resultSid = this.result.data[0].sid.split('|')[0].split(',');

          // console.log(this.resultSid)

          this.resultHC = this.resultCards.filter((card) => {
            return this.highCards.some((c) => card.includes(c));
          });

          this.resultLC = this.resultCards.filter((card) => {
            return this.highCards.every((c) => !card.includes(c));
          });


          // console.log(this.resultHC, this.resultLC, 'highcards');
        } catch (error) { }

        this.resultModalRef = this.modalService.show(resultTemp);
        if (this.tableId == -3) {
          this.resultCards = this.resultCards.data.data;
        }
      });
  }
  callrule(ruleTemp) {
    this.ruleModalRef = this.modalService.show(ruleTemp);
  }
  getBMTopCss(index) {
    if (index == 0) {
      this.top = 0;
      this.top1 = this.top;
      setTimeout(() => {
        this.bMTopCss = {
          top: '0px',
          cursor: 'not-allowed',
        };
      });
      // console.log(index, this.top, this.bMTopCss);
      return this.bMTopCss;
    }
    if (index > 0) {
      this.top = index * 41;
      this.top1 = this.top;
      setTimeout(() => {
        this.bMTopCss = {
          top: this.top1 + 'px',
          cursor: 'not-allowed',
        };
      });
      // console.log(index, this.top, this.bMTopCss);
      return this.bMTopCss;
    }
  }

  getRuns(over, nation) {

    let totalRuns = 0;
    if (this.resultCards) {
      _.forEach(this.resultCards.t2, (element) => {
        if (parseInt(element.over) == parseInt(over) && element.nation == nation) {
          if (element.wkt == 0) {
            totalRuns = totalRuns + parseInt(element.run);
          } else {
            element.run = "ww";
          }
        }
      });
    }

    return totalRuns;
  }

  getWickets(over, nation) {

    let totalWicket = 0;
    let totalRuns = 0;
    if (this.resultCards) {
      _.forEach(this.resultCards.t2, (element) => {
        if (parseInt(element.over) <= parseInt(over) && element.nation == nation) {
          if (element.wkt == 1) {
            element.run = "ww";
            totalWicket = totalWicket + 1;
          } else {
            totalRuns = totalRuns + parseInt(element.run);
          }
        }
      });
    }

    return totalRuns + '/' + totalWicket;
  }

  cancelBetslip(remove) {
    $('.back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3').removeClass('select');
    this.cards = [];
    if (this.placeMarketData != null) {
      this.calcExposure(
        this.placeMarketData.marketId,
        this.placeMarketData,
        'remove'
      );
    }
    // if (this.placeBookData != null) {
    //   this.calcExposure(this.placeBookData, "remove");
    // }

    // if (this.placeTPData != null) {
    //   this.calcExposure(this.placeTPData, "remove");
    // }
    // if (remove == false) {
    //   $rootScope.cards = [];
    // }

    this.placeMarketData = null;
    this.placeTPData = null;
    // this.placeFancyData = null;
    // this.placeBookData = null;
    // this.selectedBet = null;
  }

  placeBet(isMobile?: boolean) {
    if (!this.authService.getLoggedIn()) {
      // Relogin()
      this.toastr.info('Token was expired. Please login to continue.');
      return false;
    }

    this.setBetTimeout();
    if (isMobile) {
      $('#loading_place_tp_bet').css('display', 'block');
      this.placeBetMobile(this.placeTPData);
      return;
    }

    this.placedButton = true;

    if (this.backTeenSlipDataArray.length) {
      _.forEach(this.backTeenSlipDataArray, (item, key) => {
        $('#loading_place_bet').css('display', 'block');
        this.placeTpBet(item);
      });
    }
  }

  placeBetMobile(betData) {
    $(`#inline-pendding${betData.runnerId}`).css('display', 'block');
    let betData1: ICasinoBetData = {
      betType: betData.backlay,
      gameType: betData.matchname,
      selId: betData.runnerId,
      round: +betData.gameId.split('.')[1],
      odds: +betData.odds,
      stake: +betData.stake,
      cards: this.cards,
    };

    // console.log(betData1);
    $('#placebet_btn').removeClass('disable');
    $('#placebet_btn').addClass('disable');
    $('#placebet_btn').prop('disabled', true);
    this.disablePlaceBet = true;
    this.betsService.placeTPBet(betData1).subscribe(
      (response: GenericResponse<any>) => {
        if (response.errorCode == 0) {
          if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
            let getResp = response.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResultPlaceBetMobile(getResp, betData1);
            }, (getResp.delay * 1000) + 500);
          } else {
            this.toastr.success(response.errorDescription);
            $('#loading_place_bet').css('display', 'none');
            $(`#inline-pendding${betData1.selId}`).css('display', 'none');
            // $("#betslip_open").addClass("close");
            setTimeout(() => {
              if (response.result[1]) {
                let TeenDataList = response.result[1];
                let tableName = response.result[0].eventName
                // console.log(this.TeenDataList);
                _.forEach(TeenDataList, function (value, item) {
                  let BMExposure = parseFloat(value);
                  if (BMExposure > 0) {
                    $('#Tp_' + tableName + '_' + item)
                      .text(BMExposure)
                      .css('color', 'green');
                  } else {
                    $('#Tp_' + tableName + '_' + item)
                      .text(BMExposure)
                      .css('color', 'red');
                  }
                  if (BMExposure > 0) {
                    $('#Tpm_' + tableName + '_' + item)
                      .text(BMExposure)
                      .css('color', 'green');
                  } else {
                    $('#Tpm_' + tableName + '_' + item)
                      .text(BMExposure)
                      .css('color', 'red');
                  }
                });
              } else {
                this.ExposureBookTeenPatti(
                  betData1.gameType,
                  betData1.round,
                  betData1.selId
                );
              }
              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();
              }
              if (response.result[2]) {
                this.userService.sendBets(response.result[2]);
                // this.userService.sendBets(response.result[2].filter((bet) => (bet.sportName == "Live Casino")))
                // console.log(this.matchedData);

              } else {
                this.userService.getBets()
              }


            }, 500);
            $('#placebet_btn').removeClass('disable');
            $('#placebet_btn').prop('disabled', false);
            $('.casino-market .select').removeClass('select');
            this.removeAllBetSlip();
            this.placeTPData = null;
            this.placedButton = false;
            this.disablePlaceBet = false;
            this.placeMarketData = null;
            $('#loading_place_tp_bet').css('display', 'none');
          }


          // this.getMultiExposureBook()
        } else {
          this.removeAllBetSlip();
          $('#loading_place_bet').css('display', 'none');
          $(`#inline-pendding${betData1.selId}`).css('display', 'none');
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          $('.casino-market .select').removeClass('select');

          this.toastr.error(response.errorDescription);
          this.placedButton = false;
          this.disablePlaceBet = false;
          this.placeMarketData = null;
          $('#loading_place_tp_bet').css('display', 'none');
        }

      },
      function myError(error) {
        $('#placebet_btn').removeClass('disable');
        $('#loading_place_tp_bet').css('display', 'none');
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
      }
    );
  }

  requestResultPlaceBetMobile(data, betData1) {

    // console.log(data)
    this.betsService.requestResult(data.reqId).subscribe(
      (response: GenericResponse<any>) => {

        if (response.errorCode == 0) {
          if (response.result[0]?.result == "pending") {
            setTimeout(() => {
              this.requestResultPlaceBetMobile(data, betData1);
            }, 500)
          } else {
            this.toastr.success(response.errorDescription);
            $('#loading_place_bet').css('display', 'none');
            $(`#inline-pendding${betData1.selId}`).css('display', 'none');
            // $("#betslip_open").addClass("close");
            setTimeout(() => {
              if (response.result[1]) {
                let TeenDataList = response.result[1];
                let tableName = response.result[0].eventName
                // console.log(this.TeenDataList);
                _.forEach(TeenDataList, function (value, item) {
                  let BMExposure = parseFloat(value);
                  if (BMExposure > 0) {
                    $('#Tp_' + tableName + '_' + item)
                      .text(BMExposure)
                      .css('color', 'green');
                  } else {
                    $('#Tp_' + tableName + '_' + item)
                      .text(BMExposure)
                      .css('color', 'red');
                  }
                  if (BMExposure > 0) {
                    $('#Tpm_' + tableName + '_' + item)
                      .text(BMExposure)
                      .css('color', 'green');
                  } else {
                    $('#Tpm_' + tableName + '_' + item)
                      .text(BMExposure)
                      .css('color', 'red');
                  }
                });
              } else {
                this.ExposureBookTeenPatti(
                  betData1.gameType,
                  betData1.round,
                  betData1.selId
                );
              }

              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();
              }
              if (response.result[2]) {
                this.userService.sendBets(response.result[2]);

                // this.userService.sendBets(response.result[2].filter((bet) => (bet.sportName == "Live Casino")))
                // console.log(this.matchedData);
              } else {
                this.userService.getBets()
              }

            }, 1000);
            $('#placebet_btn').removeClass('disable');
            $('#placebet_btn').prop('disabled', false);
            $('.casino-market .select').removeClass('select');
            this.removeAllBetSlip();
            this.placeTPData = null;
            this.placedButton = false;
            this.disablePlaceBet = false;
            this.placeMarketData = null;
            $('#loading_place_tp_bet').css('display', 'none');
          }


        } else {
          this.removeAllBetSlip();
          $('#loading_place_bet').css('display', 'none');
          $(`#inline-pendding${betData1.selId}`).css('display', 'none');
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          $('.casino-market .select').removeClass('select');

          this.toastr.error(response.errorDescription);
          this.placedButton = false;
          this.disablePlaceBet = false;
          this.placeMarketData = null;
          $('#loading_place_tp_bet').css('display', 'none');
        }

      },
      function myError(error) {
        $('#placebet_btn').removeClass('disable');
        $('#loading_place_tp_bet').css('display', 'none');
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }

      }
    );
  }

  placeTpBet(betData) {
    this.setBetTimeout();
    let betData1: ICasinoBetData = {
      betType: betData.backlay,
      gameType: betData.matchname,
      selId: betData.runnerId,
      round: +betData.gameId.split('.')[1],
      odds: +betData.odds,
      stake: +betData.stake,
      cards: this.cards,
    };
    // console.log(betData1);
    this.betsService
      .placeTPBet(betData1)
      .subscribe((response: GenericResponse<any>) => {
        if (response.errorCode == 0) {
          // this.$emit("callExp", {})

          // if($location.path()=== "/multi-market"){
          //     this.$emit("callMultiMarketExp", {})
          // }

          this.toastr.success(response.errorDescription);
          $('#loading_place_bet').css('display', 'none');
          // $("#betslip_open").addClass("close");
          this.userService.getBalance();
          this.userService.getBets();
          this.ExposureBookTeenPatti(
            betData1.gameType,
            betData1.round,
            betData1.selId
          );

          setTimeout(() => {
            this.userService.getBalance();
            this.userService.getBets();
            this.ExposureBookTeenPatti(
              betData1.gameType,
              betData1.round,
              betData1.selId
            );
          }, 1000);
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          this.removeAllBetSlip();
          // this.getMultiExposureBook()
          // if (
          //   betData.gameType == 1 ||
          //   betData.gameType == 2 ||
          //   betData.gameType == 6
          // ) {
          //   this.ExposureBookTeenPatti(betData.gameId);
          // }
          // if (betData.gameType == 5) {
          //   this.ExposureBookLucky7(betData.gameId);
          // }
          // if (betData.gameType == 7) {
          //   this.AndarBaharExposureBook(betData.gameId);
          // }
          this.placedButton = false;

        } else {
          this.removeAllBetSlip();
          $('#loading_place_bet').css('display', 'none');
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);

          this.toastr.error(response.errorDescription);
          this.placedButton = false;

        }
      });
  }

  ExposureBookTeenPatti(tableName, roundId, selectionId) {
    this.fullMarketService
      .getTPExposureBook(tableName, roundId, selectionId)
      .subscribe((response: GenericResponse<any>) => {
        let TeenDataList = response.result[0];
        // console.log(this.TeenDataList);
        _.forEach(TeenDataList, function (value, item) {
          let BMExposure = parseFloat(value);
          if (BMExposure > 0) {
            $('#Tp_' + tableName + '_' + item)
              .text(BMExposure)
              .css('color', 'green');
          } else {
            $('#Tp_' + tableName + '_' + item)
              .text(BMExposure)
              .css('color', 'red');
          }
          if (BMExposure > 0) {
            $('#Tpm_' + tableName + '_' + item)
              .text(BMExposure)
              .css('color', 'green');
          } else {
            $('#Tpm_' + tableName + '_' + item)
              .text(BMExposure)
              .css('color', 'red');
          }
        });
      });
  }

  stakeValue(stake, bet, booktype) {
    // console.log(stake)

    if (bet.backlay == 'back' || bet.backlay == 'lay') {
      var getStake = bet.stake;
      if (getStake == '') {
        getStake = 0;
      }
      var totalStake = parseInt(getStake) + parseInt(stake);
      bet.stake = totalStake;

      var odds = bet.odds;
      if (bet.gameType === '-12') {
        odds = parseFloat(odds) / 100 + 1;
      }
      var pnl = (parseFloat(odds) - 1) * totalStake;
      bet.profit = pnl.toFixed(2);
      this.calculateLiability();
      this.calcExposure(this.ExpoMktid, this.bets);
    }

    if (bet.backlay == 'backBook' || bet.backlay == 'layBook') {
      // if (bet.booktype === 1) {
      var getStake = bet.stake;
      if (getStake == '') {
        getStake = 0;
      }
      var totalStake = parseInt(getStake) + parseInt(stake);
      bet.stake = totalStake;
      var pnl = (parseFloat(bet.odds) / 100) * totalStake;
      bet.profit = pnl.toFixed(2);
      this.calculateLiability();
      // } else {
      //   var getStake = bet.stake;
      //   if (getStake == '') {
      //     getStake = 0;
      //   }
      //   var totalStake = parseInt(getStake) + parseInt(stake);
      //   bet.stake = totalStake;
      //   var pnl = (parseFloat(bet.odds) - 1) * totalStake;
      //   bet.profit = pnl.toFixed(2);
      //   this.calculateLiability();
      // }
    }

    if (bet.yesno == 'yes' || bet.yesno == 'no') {
      var getStake = bet.stake;
      if (getStake == '') {
        getStake = 0;
      }
      var totalStake = parseInt(getStake) + parseInt(stake);
      bet.stake = totalStake;
      var pnl = (parseFloat(bet.rate) * totalStake) / 100;
      bet.profit = pnl.toFixed(2);
      this.calculateLiability();
    }
  }


  getOpenBets() {
    let openBetsSub = this.userService.openBets$.subscribe((bets) => {
      // console.log(bets)
      this.matchedDataHolder = Array.from(
        bets.filter((bet) => bet.eventId == this.matchid && bet.unmatched == 0)
      );
      this.unMatchedDataHolder = Array.from(
        bets.filter((bet) => bet.eventId == this.matchid && bet.unmatched == 1)
      );
      this.getAvgOdds(this.isAverageBets);
    });
    this.subSink.add(openBetsSub);
  }

  getOpenBetsByEvent() {
    this.userService
      .listBetsByEvent(this.matchid)
      .subscribe((res: GenericResponse<IOpenBets>) => {
        this.matchedDataHolder = Array.from(
          res?.result.filter(
            (bet) => bet.eventId == this.matchid && bet.unmatched == 0
          )
        );
        this.unMatchedDataHolder = Array.from(
          res?.result.filter(
            (bet) => bet.eventId == this.matchid && bet.unmatched == 1
          )
        );
        this.getAvgOdds(this.isAverageBets);
      });
  }


  getAvgOdds(isAverageBets) {
    if (isAverageBets) {
      let countMap = {};
      console.log(this.matchedData, "matchdata");

      this.matchedData = this.matchedDataHolder
        .map((a) => ({ ...a }))
        .map((b) => {
          b.odds = +b.odds;
          return b;
        })
        .reduce((acc, c) => {
          let betIndex = acc.findIndex(
            (e) => +e.selId === +c.selId && e.betType === c.betType
          );
          let bet = acc[betIndex];
          if (bet) {
            if (countMap[bet.selId]) {
              countMap[bet.selId] += 1;
            } else {
              countMap[bet.selId] = 2;
            }
            bet.odds += +c.odds;
            bet.odds = Math.round((bet.odds / 2) * 100) / 100;
            bet.PL += c.PL;
            bet.stake += c.stake;
            acc.splice(betIndex, 1);
            acc.push(bet);
            return acc;
          } else {
            acc.push(c);
            return acc;
          }
        }, []);

      this.unMatchedData = this.unMatchedDataHolder
        .map((a) => ({ ...a }))
        .map((b) => {
          b.odds = +b.odds;
          return b;
        })
        .reduce((acc, c) => {
          let betIndex = acc.findIndex(
            (e) => +e.selId === +c.selId && e.betType === c.betType
          );
          let bet = acc[betIndex];
          if (bet) {
            if (countMap[bet.selId]) {
              countMap[bet.selId] += 1;
            } else {
              countMap[bet.selId] = 2;
            }
            bet.odds += +c.odds;
            bet.odds = Math.round((bet.odds / 2) * 100) / 100;
            bet.PL += c.PL;
            bet.stake += c.stake;
            acc.splice(betIndex, 1);
            acc.push(bet);
            return acc;
          } else {
            acc.push(c);
            return acc;
          }
        }, []);
    } else {
      this.matchedData = this.matchedDataHolder.map((a) => ({ ...a }));
      this.unMatchedData = this.unMatchedDataHolder.map((a) => ({ ...a }));
    }
  }

  emitEventToBetslip(func, ...params: any) {
    this.betSlipEvents.next({ func, params });
  }

  trackByCon(trackByCon, item: IOpenBets) {
    return item.consolidateId;
  }

  trackByIndex(index, item) {
    return index;
  }

  trackByNation(index, item) {
    return item.nation;
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    this.subSink.unsubscribe();
  }
}
