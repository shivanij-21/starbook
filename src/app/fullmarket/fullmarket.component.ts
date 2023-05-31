import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import 'jquery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { DataFormatService } from '../services/data-format.service';
import { GamesService } from '../services/games.service';
import * as _ from 'lodash';

import {
  IStake,
  SettingsService,
  STAKE_LIST,
} from '../services/settings.service';
import {
  LEVELS,
  ShareDataService,
  SPORTS_MAP,
} from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { ICurrentUser } from '../shared/types/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { IOpenBets } from '../shared/types/open-bets';
import { BetsService } from './services/bets.service';
import { FullmarketService } from './services/fullmarket.service';
import { IBetslipData } from './types/betslip-data';
import { ILoadEvent } from './types/load-event';
import { IMarketDescription } from './types/market-description';
import { param } from 'jquery';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-fullmarket',
  templateUrl: './fullmarket.component.html',
  styleUrls: ['./fullmarket.component.scss'],
})
export class FullmarketComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  sportsBookMarketData: any[] = [];
  currentMatchData = [];
  sportsBookMarket: any;
  volMultiplier = 1;
  betDelay = 0;
  isSportBook: boolean = false;
  sportradar_url: any;
  liveUrl: any;
  mktId;
  matchid;
  bfId;
  mktbfId;
  sportId;
  tourID;

  fancyDataList = [];
  fancyData = [];

  runnerData?;
  tvUrl;
  scoreHeight: number;
  sportsData;
  marketdata: any;
  oneClicked: string;
  pending_oneClickPlaceMOBet: boolean;
  betType: any;
  runnerName: any;
  selectionId: any;
  matchName: any;
  odds: any;
  mtid: any;
  fancyRate: any;
  fancyId: any;
  stake: any;
  profit: string;
  loss: string

  backBetSlipDataArray: any[] = [];
  layBetSlipDataArray: any[] = [];
  oneClickStake: any;
  selected_Stake_btn: any;
  backBetSlipList: any[];
  layBetSlipList: any[];
  yesBetSlipList: any[];
  noBetSlipList: any[];
  backBookBetSlipList: any[];
  layBookBetSlipList: any[];
  default_stake: any;

  stakeList: IStake[];
  backTeenSlipDataArray: any[];
  ExpoMktid: any;
  bets: any;
  exposureBook: any;
  liabilityBack: number;
  liabilityBackBook: number;
  liabilityYes: number;
  liabilityLay: number;
  liabilityLayBook: number;
  liabilityNo: number;
  fancyBookCalled: any;
  bmBookCalled: boolean = false;
  placedButton: boolean;
  marketId: any;
  mktid: any;
  BookDataList: any;
  commentary;
  sessionSettings: { max: number; min: number };
  marketDescription: IMarketDescription;
  runnersMap = {};

  BMbookdata: any = [];
  bmMin: any;
  bmMax: any;

  fMin: any;
  fMax: any;

  static fieldMap = {
    MarketId: 'marketId',
    IsMarketDataDelayed: 'isMarketDataDelayed',
    Status: 'status',
    IsInplay: 'isInplay',
    NumberOfRunners: 'numberOfRunners',
    NumberOfActiveRunners: 'numberOfActiveRunners',
    TotalMatched: 'totalMatched',
    Runners: 'runners',
    // selectionId: 'SelectionId',
    ExchangePrices: 'ex',
    AvailableToBack: 'availableToBack',
    AvailableToLay: 'availableToLay',
    Price: 'price',
    Size: 'size',
    LastPriceTraded: 'lastPriceTraded',
    SelectionId: 'selectionId',
    exchange: 'ex',
  };

  fancyType = {
    isStable: 0,
    isDiamond: 0,
    isScrap: 0,
  };
  sportsDataVal: boolean;

  oddsSub: Subscription;
  subSink = new Subscription();
  liabilities: number;
  exposureCalled: boolean = false;

  progressdata = {
    progress: 0,
  };
  fancyBetslipData = {};
  inputStakeYES = 0;
  inputStakeNO = 0;

  modalRef: BsModalRef;
  selectedFancyName: { marketName: any };
  fancyDatabookList: any[] = [];

  matchedData: IOpenBets[];
  matchedDataHolder: IOpenBets[];

  unMatchedData: IOpenBets[];
  unMatchedDataHolder: IOpenBets[];
  cards: any[];
  placeMarketData: IBetslipData;
  placeBookData: IBetslipData;
  isMobile: boolean = false;
  placeTPData: {};
  countDown: string;
  scoreUrl: any;
  fullScore: any = {};
  matcheventId: any;

  rulesModalRef: BsModalRef;
  bookmakerRulesRef: BsModalRef;
  fancyRulesRef: BsModalRef;

  isAverageBets: boolean;

  sportsData$ = new Subject();
  bookmakingData = [];

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  inPlay: number = 0;
  timeRemaining: number;
  timeRemainingRef;
  isScore: boolean;
  marketDatatimeout: any;

  matchInplay: boolean = false;
  disablePlaceBet: boolean = false;
  showTv: boolean = false;

  iframeWidth;
  iframeHeight;
  apisOdds: boolean = true;
  marketIds: any[] = [];
  matchData: any[];
  openedPremiumMarkets = {};
  accountInfo: any;
  currentUser: ICurrentUser;
  score_id: any;
  gameType: any;
  booktype: any;
  newMktExposure: any;
  betSlipData: any;
  BookDataList1: any = {};
  newbookExposure: any;


  constructor(
    private fullmarketService: FullmarketService,
    private activatedRoute: ActivatedRoute,
    private dataformatService: DataFormatService,
    private authService: AuthService,
    private betsService: BetsService,
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private shareDataService: ShareDataService,
    private titleService: Title,
    private settingsService: SettingsService,
    private changeDetectorRef: ChangeDetectorRef,
    private mediaMatcher: MediaMatcher,
    private sanitizer: DomSanitizer,
    private game: GamesService,
    private tokenService: TokenService,
    private commonService: CommonService,



  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 1199px)');

    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);

    this.iframeWidth = window.innerWidth;
    this.iframeHeight = Math.ceil(this.iframeWidth / 1.778);
  }

  ngOnInit(): void {
    this.shareDataService.setUnSubValue(true);
    this.activatedRoute.params.subscribe((params) => {
      this.mktId = params.marketId;
      this.matchid = params.matchId;
      this.bfId = params.bfId;
      this.mktbfId = params.bfId;
      this.sportId = params.sportid;
      this.tourID = params.tourid;

      this.exposureCalled = false;
      this.subSink.unsubscribe();
      this.subSink = new Subscription();
      // this.getTvUrl();
      this.setIframeUrl();
      this.getScoreId();

      let scoreInterval = interval(3000).subscribe(() => {
        if (!this.isRace && this.bfId != "1.172017987" && !this.isKabaddi) {
          this.getScore();
        }
      });
      this.subSink.add(scoreInterval);
      let oddsIntervalSub = interval(1000).subscribe(() => {


        if (this.apisOdds && this.marketdata) {

          if (!this.isKabaddi) {
            this.getOdds();
            this.getOddsAllSports();

          }
          if ((this.sportId == 4 || this.isKabaddi) && this.bfId != "1.172017987") {
            this.getFancyOdds();

          }
          if (this.sportId <= 4) {
            this.getSportsBook();
          }
        }
      });

      this.subSink.add(oddsIntervalSub);

      let pingResSub = this.userService.pingRes$.subscribe((pingRes) => {
        if (pingRes && pingRes.listBets) {
          this.getOpenBetsByEvent();
          this.currentMatchData.forEach((market) => {
            this.ExposureBook(market.marketId);
          });
          this.getFancyExposure();
          this.getBMExposureBook('bm_' + this.bfId);

        }
      });
      this.subSink.add(pingResSub);

      this.subSink.add(() => {
        this.fullmarketService.closeConnection();
        this.fancyData = null;
        this.fullScore = null;
        this.bookmakingData = null;
        this.currentMatchData = null;
        this.marketDescription = null;
        this.marketdata = null;
        this.marketIds = null;
        this.tvUrl = '';
      });

      let sportsDataSub = this.dataformatService.sportsData$
        .pipe(takeUntil(this.sportsData$))
        .subscribe((sportsData) => {
          if (
            sportsData &&
            sportsData[this.sportId] &&
            sportsData[this.sportId].tournaments[this.tourID]
          ) {
            this.sportsData$.next();
            //// console.log(sportsData);

            this.sportsData = sportsData;
            this.sportsDataVal = true;

            try {
              let racingSport =
                this.activatedRoute.snapshot.queryParamMap.get('o');
              if (eval(racingSport)) {
                this.getMarketData(true);
              } else {
                this.getMarketData();

              }
            } catch (e) { }

            // this.fullmarketService
            //   .loadEvent(this.matchid)
            //   .subscribe((res: GenericResponse<ILoadEvent>) => {
            //     if (res) {
            //       if (res.errorCode === 0) {
            //         this.betDelay = res.result[0].betDelay;
            //        // console.log(this.betDelay);
            //        if (res.result[0].bookmakerSettings) {
            //         this.bmMin = res.result[0].bookmakerSettings?.min;
            //         this.bmMax = res.result[0].bookmakerSettings?.max.toString();
            //       }
            //       if (res.result[0].sessionSettings) {
            //         this.fMin = res.result[0].sessionSettings?.min;
            //         this.fMax = res.result[0].sessionSettings?.max.toString();
            //       }
            //         this.volMultiplier = res.result[0].volMultiplier
            //           ? res.result[0].volMultiplier
            //           : 1;
            //         this.sessionSettings = res.result[0].sessionSettings;
            //       }
            //     }
            //   });
          }


        });

      this.getOpenBets();
      this.subSink.add(sportsDataSub);
    });

    this.subSink.add(
      interval(15000).subscribe(() => {
        this.loadEvent()
      })
    );

    this.settingsService.stakeList$.subscribe((stakeList) => {
      this.stakeList = stakeList;
    });
    window.addEventListener('storage', (event) => {
      if (event.key === STAKE_LIST) {
        this.stakeList = JSON.parse(event.newValue);
      }
    });
    this.authService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.UserDescription()


  }


  loadEvent() {
    this.fullmarketService
      .loadEvent(this.matchid)
    this.fullmarketService
      .loadEvent(this.matchid)
      .subscribe((res: GenericResponse<ILoadEvent>) => {
        if (res) {
          if (res.errorCode === 0) {
            this.betDelay = res.result[0].betDelay;
            // console.log(this.betDelay);
            if (res.result[0].bookmakerSettings) {
              this.bmMin = res.result[0].bookmakerSettings?.min;
              this.bmMax = res.result[0].bookmakerSettings?.max.toString();
            }
            if (res.result[0].sessionSettings) {
              this.fMin = res.result[0].sessionSettings?.min;
              this.fMax = res.result[0].sessionSettings?.max.toString();
            }
            this.volMultiplier = res.result[0].volMultiplier
              ? res.result[0].volMultiplier
              : 1;
            this.sessionSettings = res.result[0].sessionSettings;
          }
        }
      });
  }
  // getTvUrl() {
  //   this.tvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //     `https://streamingtv.fun/live_tv/index.html?eventId=${this.matchid}`
  //   );
  // }

  setIframeUrl() {
    this.fullmarketService.getliveTvApi(this.matchid).subscribe((resp: any) => {
      if (resp.streamingUrl) {
        console.log(resp)
        this.liveUrl = resp.streamingUrl;
        this.tvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveUrl);
        console.log(this.tvUrl)
      }

      if (resp.scoreUrl) {
        let url = resp.scoreUrl;
        this.sportradar_url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        console.log(this.sportradar_url)

      }
    }, err => {
    })


    // }
  }

  getOdds() {
    this.fullmarketService
      .getOdds(this.marketIds)
      .subscribe((message) => this.setOddsData(message));
  }


  getOddsAllSports() {
    this.fullmarketService
      .getOddsAllSports(this.marketIds)
      .subscribe((message) => this.setOddsData(message));
  }
  getFancyOdds() {
    this.fullmarketService
      .getFancyOdds(this.matchid)
      .subscribe((message) => this.setOddsData(message));
  }
  getSportsBook() {
    this.fullmarketService
      .getSportsBook(this.matchid)
      .subscribe((message) => this.setOddsData(message));
  }

  getOpenBets() {
    let openBetsSub = this.userService.openBets$.subscribe((bets) => {
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

  getMarketData(racingGame?: boolean) {
    if (racingGame) {
      // let eventsByBfId = this.dataformatService.getEventsByBfId();
      // this.marketdata = eventsByBfId[this.bfId];
      this.marketdata = this.sportsData[this.sportId].tournaments[
        this.tourID
      ].matches[this.matchid].markets.find((market) => market.id === this.bfId);

      this.getMarketDescription();
      let marketDescInterval = interval(5000).subscribe(() => {
        // this.getMarketDescription();
      });

      this.subSink.add(marketDescInterval);
    } else {
      if (this.sportsData && this.sportsData[+this.sportId]) {
        this.marketdata =
          this.sportsData[this.sportId].tournaments[this.tourID].matches[
          this.matchid
          ];
        let ids = this.marketdata.markets.reduce((acc, c) => {
          acc.push(c.bfId);
          return acc;
        }, []);
        this.marketIds = ids.join(',');
        this.matchInplay = this.marketdata.inPlay;
      }
    }

    //// console.log(this.marketdata);
    if (!this.marketdata) {
      this.marketDatatimeout = setTimeout(() => {
        this.getMarketData(racingGame);
      }, 500);
      return;
    }

    this.loadEvent()

    if (this.marketdata) {
      this.matchName = this.marketdata.name;
      try {
        this.shareDataService.setLeftColState({
          level: LEVELS.SPORT,
          value: {
            id: this.sportId,
            name: SPORTS_MAP[this.sportId].title,
            day: this.marketdata.day,
          },
        });
        this.shareDataService.setLeftColState({
          level: LEVELS.TOURNAMENT,
          value: {
            id: this.tourID,
            name: this.sportsData[this.sportId].tournaments[this.tourID].name,
          },
        });
        this.shareDataService.setLeftColState({
          level: LEVELS.MATCH,
          value: { id: this.matchid, name: this.marketdata.name },
        });

        let startTime = this.marketdata.startDate
          ? this.marketdata.startDate
          : this.marketdata.startTime;

        let countDownInterval = interval(1000).subscribe(() => {
          let diff = Math.abs(
            new Date(startTime).getTime() - new Date().getTime()
          );
          let millis = diff % 1000;
          diff = (diff - millis) / 1000;
          let seconds = diff % 60;
          diff = (diff - seconds) / 60;
          let minutes = diff % 60;
          diff = (diff - minutes) / 60;
          let hours = diff % 24;
          diff = (diff - hours) / 24;
          let days = diff;
          // let nd = Date.UTC(1970, 1, 1, hours, minutes, seconds);

          let timeRemain = '';
          if (days) {
            timeRemain += String(days) + 'd ';
          }
          if (hours || hours === 0) {
            timeRemain += String(hours).padStart(2, '0') + ':';
          }
          if (minutes || minutes === 0) {
            timeRemain += String(minutes).padStart(2, '0') + ':';
          }
          if (seconds || seconds === 0) {
            timeRemain += String(seconds).padStart(2, '0');
          }

          this.countDown = timeRemain;
        });
        this.subSink.add(countDownInterval);

        this.matchName = this.marketdata.name;
      } catch (error) {

      }
      this.titleService.setTitle(this.matchName);
      this.getWebSocketData();
    }
  }

  getMarketDescription() {
    this.fullmarketService
      .marketDescription(this.bfId)
      .subscribe((data: IMarketDescription) => {
        this.marketDescription = data;
        console.log(data);
        if (data) {
          data.eventTypes.eventNodes.marketNodes.runners.forEach((runner) => {
            this.runnersMap[runner.selectionId] = runner;
          });
          if (!this.currentMatchData || !this.currentMatchData.length) {
            this.currentMatchData = [data.eventTypes.eventNodes.marketNodes];
          }
          (<any[]>this.currentMatchData)?.forEach((market) => {
            market.runners.forEach((runner) => {
              runner.runnerName = this.runnersMap[runner.selectionId]
                ?.description.runnerName
                ? this.runnersMap[runner.selectionId].description.runnerName
                : '';
              runner['description'] = this.runnersMap[runner.selectionId]
                ?.description
                ? this.runnersMap[runner.selectionId].description
                : '';
            });
          });
        }
      });
  }

  getExposure = function () {
    if (!!this.currentMatchData) {
      this.currentMatchData.forEach((market) => {
        this.exposureBook = {};
        market.runners.forEach((r) => {
          this.exposureBook[r.selectionId] = 0;
        });
        localStorage.setItem(
          'Exposure_' + market.marketId,
          JSON.stringify(this.exposureBook)
        );
      });
      if (this.authService.getLoggedIn()) {
        _.forEach(this.currentMatchData, (market) => {
          this.ExposureBook(market.marketId);
        });
      }
    }
    this.exposureCalled = true;
  };

  timeOutRef;
  getWebSocketData() {
    this.oddsSub = this.fullmarketService
      .getWebSocketData(this.marketdata)
      .subscribe((message) => {
        this.apisOdds = false;
        clearTimeout(this.timeOutRef);
        this.timeOutRef = setTimeout(() => {
          this.apisOdds = true;
        }, 3000);
        this.setOddsData(message);

      });

    this.subSink.add(this.oddsSub);
  }

  // marketsNewBookExposure(message) {
  //  // console.log(message,"message");


  // }



  setOddsData(message) {


    //// console.log(message.sportsBookMarket, "message.sportsBookMarket");

    if (
      message &&
      message.constructor !== Object &&
      !message.matchId &&
      message.length
    ) {
      message = Object.assign([], message)
        .filter((m) => !!m)
        .map((m) => {
          Object.keys(m).forEach((f) => {
            var newKey = FullmarketComponent.fieldMap[f]
              ? FullmarketComponent.fieldMap[f]
              : f;
            m[newKey] = m[f];
            FullmarketComponent.fieldMap[f] ? delete m[f] : '';
          });
          m.runners.map((runner) => {
            Object.keys(runner).forEach((r) => {
              var runKey = FullmarketComponent.fieldMap[r]
                ? FullmarketComponent.fieldMap[r]
                : r;
              runner[runKey] = runner[r];
              FullmarketComponent.fieldMap[r] ? delete runner[r] : '';
            });
            Object.keys(runner.ex).forEach((k) => {
              var blKey = FullmarketComponent.fieldMap[k]
                ? FullmarketComponent.fieldMap[k]
                : k;
              runner.ex[blKey] = runner.ex[k];
              FullmarketComponent.fieldMap[k] ? delete runner.ex[k] : '';
            });
            runner.ex.availableToBack.map((b) => {
              Object.keys(b).forEach((k) => {
                var blKey = FullmarketComponent.fieldMap[k]
                  ? FullmarketComponent.fieldMap[k]
                  : k;
                b[blKey] = b[k];
                FullmarketComponent.fieldMap[k] ? delete b[k] : '';
              });
              // if (b.size) {
              //   if (b.size > 100) {
              //     b.size = Math.round(b.size) * FullmarketComponent.volMultiplier;
              //   } else {
              //     b.size = +(b.size * FullmarketComponent.volMultiplier).toFixed(2);
              //   }
              // }
            });
            runner.ex.availableToLay.map((b) => {
              Object.keys(b).forEach((k) => {
                var blKey = FullmarketComponent.fieldMap[k]
                  ? FullmarketComponent.fieldMap[k]
                  : k;
                b[blKey] = b[k];
                FullmarketComponent.fieldMap[k] ? delete b[k] : '';
              });
              // if (b.size) {
              //   if (b.size > 100) {
              //     b.size = Math.round(b.size) * FullmarketComponent.volMultiplier;
              //   } else {
              //     b.size = +(b.size * FullmarketComponent.volMultiplier).toFixed(2);
              //   }
              // }
            });
            return m;
          });
          return m;
        })
        .sort((a, b) => {
          return a.marketName < b.marketName
            ? -1
            : a.marketName > b.marketName
              ? 1
              : 0;
        });

      this.oddsChangeBlink(this.currentMatchData, message);

      this.currentMatchData = message.slice();
      if (!this.exposureCalled) {
        this.getExposure();
      }
      if (this.currentMatchData[0].isInPlay !== this.inPlay) {
        this.fullmarketService.inPlay$.next(this.inPlay);
      }


      // this.currentMatchData.forEach((market) => {
      //   if (market.marketId == market.marketId) {
      //     market.pnl = this.BookDataList[market.marketId];
      //     if (market.pnl) {
      //       market['pnl'] = market.pnl
      //     }
      //     if (market.newpnl) {
      //       market['newpnl'] = market.newpnl;
      //     }

      //   }
      // })
      //// console.log(this.currentMatchData, "this.currentMatchData");

      // this.matchDataHome[match.bfId] = message.slice();
    }
    else if (message && message.sportsBookMarket) {

      this.getSportsBookMarket(message.sportsBookMarket);

    }
    else if (
      message?.runners &&
      message.constructor === Object &&
      this.marketdata &&
      this.marketdata.racing
    ) {
      message?.runners?.map((runner) => {
        Object.keys(runner).forEach((r) => {
          var runKey = FullmarketComponent.fieldMap[r]
            ? FullmarketComponent.fieldMap[r]
            : r;
          runner[runKey] = runner[r];
          FullmarketComponent.fieldMap[r] ? delete runner[r] : '';
        });
        Object.keys(runner.ex).forEach((k) => {
          var blKey = FullmarketComponent.fieldMap[k]
            ? FullmarketComponent.fieldMap[k]
            : k;
          runner.ex[blKey] = runner.ex[k];
          FullmarketComponent.fieldMap[k] ? delete runner.ex[k] : '';
        });
        runner.ex.availableToBack?.map((b) => {
          Object.keys(b).forEach((k) => {
            var blKey = FullmarketComponent.fieldMap[k]
              ? FullmarketComponent.fieldMap[k]
              : k;
            b[blKey] = b[k];
            FullmarketComponent.fieldMap[k] ? delete b[k] : '';
          });
          // if (b.size) {
          //   if (b.size > 100) {
          //     b.size = Math.round(b.size) * FullmarketComponent.volMultiplier;
          //   } else {
          //     b.size = +(b.size * FullmarketComponent.volMultiplier).toFixed(2);
          //   }
          // }
        });
        runner.ex.availableToLay?.map((b) => {
          Object.keys(b).forEach((k) => {
            var blKey = FullmarketComponent.fieldMap[k]
              ? FullmarketComponent.fieldMap[k]
              : k;
            b[blKey] = b[k];
            FullmarketComponent.fieldMap[k] ? delete b[k] : '';
          });
          // if (b.size) {
          //   if (b.size > 100) {
          //     b.size = Math.round(b.size) * FullmarketComponent.volMultiplier;
          //   } else {
          //     b.size = +(b.size * FullmarketComponent.volMultiplier).toFixed(2);
          //   }
          // }
        });
        if (this.runnersMap && this.runnersMap[runner.selectionId]) {
          runner['description'] =
            this.runnersMap[runner.selectionId].description;
          runner.runnerName =
            this.runnersMap[runner.selectionId].description.runnerName;
        }

        return runner;
      });
      // console.log(message.runners)
      message.runners.sort((a, b) => {
        return a.state.sortPriority - b.state.sortPriority;
      });
      this.currentMatchData = Object.assign([], [message]);
      if (!this.exposureCalled) {
        this.getExposure();
      }
    } else if (message && message.Fancymarket) {
      message.Fancymarket = message.Fancymarket.filter(
        (f1) =>
          !(
            /[0-9]+\.[1-9]\s+(ball)\s+run/.test(f1.nat) ||
            /[\d]+\s+runs\s+bhav\s+/i.test(f1.nat) ||
            /run\s+bhav/i.test(f1.nat) ||
            /(total\s+match\s+boundaries)/i.test(f1.nat) ||
            /\d+\s+to\s+\d+\s+overs\s+/i.test(f1.nat)
          )
      );
      message.Fancymarket = message.Fancymarket.filter((f1) => {
        return !((f1.nat.includes('6 over run ') || f1.nat.includes('10 over run ') || f1.nat.includes('15 over run ') || f1.nat.includes('20 over run ') || f1.nat.includes('25 over run ') || f1.nat.includes('30 over run ') || f1.nat.includes('35 over run ') || f1.nat.includes('40 over run ') || f1.nat.includes('45 over run ') || f1.nat.includes('50 over run ') || f1.nat.includes('lambi over run ')) && f1.nat.includes(' 2'));
      });
      message.Fancymarket = message.Fancymarket.filter((f1) => {
        return !(f1.nat.includes(' boundaries'));
      });
      message.Fancymarket = message.Fancymarket.filter((f1) => {
        return !(f1.nat.includes(' balls'));
      });
      this.fancyData = Object.assign([], message).Fancymarket.map((f1) => {
        f1.sid = +f1.sid;
        return f1;
      });
      this.fancyData = Object.assign([], message).Fancymarket.map((f1) => {
        f1.srno = +f1.srno;
        return f1;
      });
      // this.fancyData.sort((a, b) => {
      //   return a.sid - b.sid;
      // });
      // this.fancyData.sort((a, b) => {
      //   return a.srno - b.srno;
      // });

      if (
        this.fancyData &&
        this.fancyData.length &&
        !this.fancyData[0].sessionid &&
        !this.fancyData[0].sessionId
      ) {
        this.fancyData.sort((a, b) => a.sid - b.sid);
        this.fancyData.sort((a, b) => a.srno - b.srno);

      }
      this.FancyData(this.fancyData);
      if (message && message.BMmarket) {
        message.BMmarket.bm1 = message?.BMmarket.bm1
          .map((bm) => {
            bm.sr = +bm.sr;
            return bm;
          })
          .sort((a, b) => a.sr - b.sr);
        this.bookmakingData = Object.assign([], [message.BMmarket.bm1]);
        if (!this.bmBookCalled) {
          this.getBMExposureBook('bm_' + this.bookmakingData[0][0].mid);
          this.bmBookCalled = true;
        }
      }
    } else if (message && message.BMmarket) {
      message.BMmarket.bm1 = message?.BMmarket.bm1
        .map((bm) => {
          bm.sr = +bm.sr;
          return bm;
        })
        .sort((a, b) => a.sr - b.sr);
      this.bookmakingData = Object.assign([], [message.BMmarket.bm1]);
      if (!this.bmBookCalled) {
        this.getBMExposureBook('bm_' + this.bookmakingData[0][0].mid);
        this.bmBookCalled = true;
      }
    }
  }

  getSportsBookMarket(sportsBookMarket: any[]) {

    //// console.log(sportsBookMarket);

    sportsBookMarket = sportsBookMarket.filter((market) => {
      return market.apiSiteStatus != "DEACTIVED";
    });
    // sportsBookMarket = sportsBookMarket.sort((a, b) => {
    //   return a.eventId - b.eventId;
    // });



    sportsBookMarket = sportsBookMarket.sort((a, b) => {
      return parseInt(a.id) - parseInt(b.id);
    });

    sportsBookMarket = sportsBookMarket.sort((a, b) => {
      return parseInt(a.apiSiteMarketId) - parseInt(b.apiSiteMarketId);
    });

    // sportsBookMarket = sportsBookMarket.sort((a, b) => {
    //   return parseInt(a.updateDate) - parseInt(b.updateDate);
    // });


    _.forEach(sportsBookMarket, (market, index) => {
      // market.sportsBookSelection.filter((market) => {
      //   return market.apiSiteStatus != "DEACTIVED";
      // });
      if (index < 3) {
        market['isExpand'] = 1;
        this.openedPremiumMarkets[market.id] = 1;
      }
      if (this.openedPremiumMarkets[market.id]) {
        market['isExpand'] = this.openedPremiumMarkets[market.id];
      }
      if (market.sportsBookSelection) {
        market.sportsBookSelection = market.sportsBookSelection.sort((a, b) => {
          return parseInt(a.id) - parseInt(b.id);
        });
      }

    });
    this.sportsBookMarketData = sportsBookMarket;


    // this.sportsData[0]['sportsBookMarket'] = sportsBookMarket;
    if (this.fancyData?.length == 0 && sportsBookMarket?.length > 0) {
      this.isSportBook = false;
    }
    // if (sportsBookMarket.length > 0) {
    //   this.isSportBook = true;
    // }
  }

  OpneClosePreMarkets(sportBook) {
    if (sportBook['isExpand'] == 0) {
      sportBook['isExpand'] = 1;
      this.openedPremiumMarkets[sportBook.id] = 1;
    } else {
      sportBook['isExpand'] = 0;
      this.openedPremiumMarkets[sportBook.id] = 0;
    }

  }

  oddsChangeBlink(oldMarkets, newMarkets) {
    _.forEach(oldMarkets, (market: any, index: number) => {
      _.forEach(market.runners, (runner: any, index2: number) => {
        let BackRunner = newMarkets[index]?.runners[index2]?.ex.availableToBack;

        if (BackRunner) {
          _.forEach(runner.ex.availableToBack, (value: any, index3: number) => {
            // || value.size != BackRunner[index3]?.size
            if (value.price != BackRunner[index3]?.price) {
              const back = $(
                '#' + runner.selectionId + ' .back' + (index3 + 1)
              );
              back.addClass('blink');
              this.removeChangeClass(back);
            }
          });
        }

        let LayRunner = newMarkets[index]?.runners[index2]?.ex.availableToLay;

        if (LayRunner) {
          _.forEach(runner.ex.availableToLay, (value: any, index3: number) => {
            // || value.size != LayRunner[index3]?.size
            if (value.price != LayRunner[index3]?.price) {
              const back = $('#' + runner.selectionId + ' .lay' + (index3 + 1));
              back.addClass('blink');
              this.removeChangeClass(back);
            }
          });
        }
      });
    });
  }

  removeChangeClass(changeClass: any) {
    setTimeout(() => {
      changeClass.removeClass('blink');
    }, 300);
  }

  betSlip(
    bfId,
    betType,
    betSlipIndex,
    runnerName,
    selectionId,
    matchName,
    odds,
    mtid,
    mktid,
    isInplay,
    fancyRate,
    fancyId,
    sportId,
    matchBfId,
    gameType
  ) {
    //// console.log(
    //   bfId,
    //   betType,
    //   betSlipIndex,
    //   runnerName,
    //   selectionId,
    //   matchName,
    //   odds,
    //   mtid,
    //   mktid,
    //   isInplay,
    //   fancyRate,
    //   fancyId,
    //   sportId,
    //   matchBfId,
    //   gameType
    // );

    this.placeMarketData = {
      backlay: betType,
      selectionId: selectionId,
      marketId: mktid,
      matchId: mtid,
      odds: odds,
      runnerName: runnerName,
      stake: 0,
      profit: 0,
      loss: 0,
      bfId: bfId,
      matchBfId: matchBfId,
      sportId: sportId,
      gameType: gameType ? gameType : 'exchange',
    };
    if (this.betSlipData) {
      if (this.placeMarketData.backlay == 'back' || this.placeMarketData.backlay == 'lay') {
        this.betSlipData.stake = 0;
        this.betSlipData.profit = 0;
        this.betSlipData.loss = 0;
        this.betSlipData.odds = 0;
        this.betSlipData['remove'] = true;
        this.calcProfit(this.betSlipData)
      }
    }








    if (this.pending_oneClickPlaceMOBet == true) {
      return false;
    }
    if (betType == 'back' || betType == 'lay') {
      this.removeAllBetSlip('remove');
    } else {
      this.removeAllBetSlip();
    }

    $('#fancyBetMarketList .lay-1').removeClass('select');
    $('#fancyBetMarketList .back-1').removeClass('select');
    $('.matchOddTable .select').removeClass('select');

    // this.currRunnerIndex = runnerIndex;

    // if (isInplay == 'false') {
    //   isInplay = 0;
    // } else if (isInplay == 'true') {
    //   isInplay = 1;
    // }

    // this.oneClicked = localStorage.getItem('oneclick');

    // if (this.oneClicked !== 'true') {
    //   $('#fullSelection_' + runnerName + ' #' + betSlipIndex).addClass(
    //     'select'
    //   );
    // }

    this.betType = betType;
    this.runnerName = runnerName;
    this.selectionId = selectionId;
    this.matchName = matchName;
    this.odds = odds;
    this.mktId = mktid;
    this.mtid = mtid;
    this.fancyRate = fancyRate;
    this.fancyId = fancyId;
    if (this.default_stake == undefined) {
      this.default_stake = '';
    }
    this.stake = this.default_stake;
    if (this.stake != '' || this.stake != 0) {
      if (this.betType == 'back' || this.betType == 'lay') {
        this.profit = (
          (parseFloat(this.odds) - 1) *
          parseFloat(this.stake)
        ).toFixed();

      } else if (this.betType == 'yes' || this.betType == 'no') {
        this.profit = (
          (parseFloat(this.fancyRate) * parseFloat(this.stake)) /
          100
        ).toFixed(2);
      } else if (this.betType == 'backBook' || this.betType == 'layBook') {
        this.profit = (
          (parseFloat(this.odds) / 100) *
          parseFloat(this.stake)
        ).toFixed(2);
      }
      // else if (
      //   (this.betType == 'backBook' || this.betType == 'layBook') &&
      //   matchBfId == 2
      // ) {
      //   this.profit = (
      //     (parseFloat(this.odds) - 1) *
      //     parseFloat(this.stake)
      //   ).toFixed(2);
      // }
    } else {
      this.profit = '0.00';
    }

    //// console.log(this.backBetSlipList)
    //// console.log(this.layBetSlipList)

    if (betType == 'back' || betType == 'yes' || betType == 'backBook') {
      var backMatcheData = {
        matchname: matchName,
        selectionId: selectionId,
        isInplay: isInplay,
        bfId: bfId,
        booktype: matchBfId,
        marketId: this.mktId,
        matchId: this.mtid,
        backBetSlipData: [],
        yesBetSlipData: [],
        backBookBetSlipData: [],
      };
      this.backBetSlipDataArray.push(backMatcheData);
      this.backBetSlipDataArray = this.removeDuplicates(
        this.backBetSlipDataArray
      );
    } else if (betType == 'lay' || betType == 'no' || betType == 'layBook') {
      var layMatcheData = {
        matchname: matchName,
        selectionId: selectionId,
        isInplay: isInplay,
        bfId: bfId,
        booktype: matchBfId,
        marketId: this.mktId,
        matchId: this.mtid,
        layBetSlipData: [],
        noBetSlipData: [],
        layBookBetSlipData: [],
      };
      //// console.log(layMatcheData);
      this.layBetSlipDataArray.push(layMatcheData);
      this.layBetSlipDataArray = this.removeDuplicates(
        this.layBetSlipDataArray
      );
    }

    //// console.log(this.backBetSlipDataArray);
    //// console.log(this.layBetSlipDataArray);

    var betSlipData;
    if (
      this.oneClicked == 'true' &&
      (this.betType == 'back' || this.betType == 'lay')
    ) {
      $('#betslip_open').addClass('close');
      $('#processingImg_OneClickBet').css('display', 'block');

      var oneClickMOData = {
        backlay: betType,
        sportId: sportId,
        matchBfId: matchBfId,
        bfId: bfId,
        marketId: this.mktId,
        matchId: this.mtid,
        runnerName: runnerName,
        selectionId: selectionId,
        matchName: matchName,
        odds: odds,
        gameType: gameType,
        stake: this.oneClickStake[this.selected_Stake_btn],
        // profit: this.profit
      };
      //// console.log(oneClickMOData);
      this.oneClickPlaceMOBet(oneClickMOData);
      return false;
    }

    if (this.betType == 'back') {
      var backBetSlipExist = this.backBetSlipList.indexOf(betSlipIndex);

      if (backBetSlipExist == -1) {
        betSlipData = {
          backlay: betType,
          sportId: sportId,
          matchBfId: matchBfId,
          bfId: bfId,
          marketId: this.mktId,
          matchId: this.mtid,
          runnerName: runnerName,
          selectionId: selectionId,
          matchName: matchName,
          odds: odds,
          gameType: gameType,
          stake: this.stake,
          profit: this.profit,
          loss: this.loss
        };
        //// console.log(betSlipData);
        this.backBetSlipList.push(betSlipIndex);
        this.calcExposure(mktid, betSlipData);
        _.forEach(this.backBetSlipDataArray, (value, index) => {
          if (value.matchname == matchName) {
            this.backBetSlipDataArray[index].backBetSlipData.push(betSlipData);
            //// console.log(this.backBetSlipDataArray);
          }
        });
      }
      // this.backBetSlipVisible = true;
    } else if (this.betType == 'lay') {
      var layBetSlipExist = this.layBetSlipList.indexOf(betSlipIndex);
      if (layBetSlipExist == -1) {
        betSlipData = {
          backlay: betType,
          sportId: sportId,
          matchBfId: matchBfId,
          bfId: bfId,
          marketId: this.mktId,
          matchId: this.mtid,
          runnerName: runnerName,
          selectionId: selectionId,
          matchName: matchName,
          odds: odds,
          gameType: gameType,

          stake: this.stake,
          profit: this.profit,
          loss: this.loss

        };
        //// console.log(betSlipData);
        this.layBetSlipList.push(betSlipIndex);
        this.calcExposure(mktid, betSlipData);
        _.forEach(this.layBetSlipDataArray, (value, index) => {
          if (value.matchname == matchName) {
            this.layBetSlipDataArray[index].layBetSlipData.push(betSlipData);
            //// console.log(this.layBetSlipDataArray);
          }
        });
      }
    } else if (this.betType == 'yes') {
      var yesBetSlipExist = this.yesBetSlipList.indexOf(betSlipIndex);
      var betSlipData: any;
      if (yesBetSlipExist == -1) {
        betSlipData = {
          matchName: matchName,
          marketId: this.mktId,
          matchId: this.mtid,
          fancyId: fancyId,
          rate: fancyRate,
          runnerName: runnerName,
          selectionId: selectionId,
          score: odds,
          stake: this.stake,
          yesno: betType,
          profit: this.profit,
          loss: this.loss

        };
        this.yesBetSlipList.push(betSlipIndex);

        _.forEach(this.backBetSlipDataArray, (value, index) => {
          if (value.matchname == matchName) {
            this.backBetSlipDataArray[index].yesBetSlipData.push(betSlipData);
            //// console.log(this.backBetSlipDataArray);
          }
        });
      }
    } else if (this.betType == 'no') {
      var noBetSlipExist = this.noBetSlipList.indexOf(betSlipIndex);

      if (noBetSlipExist == -1) {
        betSlipData = {
          matchName: matchName,
          marketId: this.mktId,
          matchId: this.mtid,
          fancyId: fancyId,
          rate: fancyRate,
          runnerName: runnerName,
          selectionId: selectionId,
          score: odds,
          stake: this.stake,
          yesno: betType,
          profit: this.profit,
          loss: this.loss

        };
        this.noBetSlipList.push(betSlipIndex);
        _.forEach(this.layBetSlipDataArray, (value, index) => {
          if (value.matchname == matchName) {
            this.layBetSlipDataArray[index].noBetSlipData.push(betSlipData);
            //// console.log(this.layBetSlipDataArray);
          }
        });
      }
    } else if (this.betType == 'backBook') {
      var backBookBetSlipExist = this.backBookBetSlipList.indexOf(betSlipIndex);

      if (backBookBetSlipExist == -1) {
        var betBookSlipData = {
          backlay: betType,
          sportId: sportId,
          matchBfId: matchBfId,
          bfId: bfId,
          marketId: this.mktId,
          matchId: this.mtid,
          runnerName: runnerName,
          selectionId: selectionId,
          matchName: matchName,
          odds: odds,
          stake: this.stake,
          profit: this.profit,
          loss: this.loss

        };

        this.backBookBetSlipList.push(betSlipIndex);

        _.forEach(this.backBetSlipDataArray, (value, index) => {
          if (value.matchname == matchName) {
            this.backBetSlipDataArray[index].backBookBetSlipData.push(
              betBookSlipData
            );
            //// console.log(this.backBetSlipDataArray);
          }
        });
      }
    } else if (this.betType == 'layBook') {
      var layBookBetSlipExist = this.layBookBetSlipList.indexOf(betSlipIndex);

      if (layBookBetSlipExist == -1) {
        var betBookSlipData = {
          backlay: betType,
          sportId: sportId,
          matchBfId: matchBfId,
          bfId: bfId,
          marketId: this.mktId,
          matchId: this.mtid,
          runnerName: runnerName,
          selectionId: selectionId,
          matchName: matchName,
          odds: odds,
          stake: this.stake,
          profit: this.profit,
          loss: this.loss

        };

        this.layBookBetSlipList.push(betSlipIndex);

        _.forEach(this.layBetSlipDataArray, (value, index) => {
          if (value.matchname == matchName) {
            this.layBetSlipDataArray[index].layBookBetSlipData.push(
              betBookSlipData
            );
            //// console.log(this.layBetSlipDataArray);
          }
        });
      }
    }
    this.calculateLiability();

  }
  removeAllBetSlip(remove?: string, betData?: any) {
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
    $('.matchOddTable .select').removeClass('select');

    if (this.ExpoMktid != undefined) {
      this.bets.stake = 0;
      this.bets.profit = 0;
      this.calcExposure(this.ExpoMktid, this.bets, 'remove');

    }

    if (remove == undefined) {
      //// console.log(this.ExpoMktid)
      if (this.ExpoMktid != undefined) {
        this.bets.stake = 0;
        this.bets.profit = 0;
      }
      this.calcExposure(this.ExpoMktid, this.bets, 'remove');

    }
    if (betData) {
      betData.odds = 0;
      betData.stake = 0;
      betData.profit = 0;
      betData.loss = 0;
      betData['remove'] = true;
      this.calcProfit(betData)
    }

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
  oneClickPlaceMOBet(oneClickMOData: {
    backlay: any;
    sportId: any;
    matchBfId: any;
    bfId: any;
    marketId: any;
    matchId: any;
    runnerName: any;
    selectionId: any;
    matchName: any;
    odds: any;
    stake: any;
  }) {
    throw new Error('Method not implemented.');
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
        if (this.stake == '') {
          this.stake = 0;
        }
        this.liabilityBack = this.liabilityBack + parseFloat(this.stake);
      });
      _.forEach(item.yesBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == '') {
          this.stake = 0;
        }
        this.liabilityYes = this.liabilityYes + parseFloat(this.stake);
      });
      _.forEach(item.backBookBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == '') {
          this.stake = 0;
        }
        this.liabilityBackBook =
          this.liabilityBackBook + parseFloat(this.stake);
      });
    });
    _.forEach(this.layBetSlipDataArray, (item) => {
      _.forEach(item.layBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == '') {
          this.stake = 0;
        }
        this.liabilityLay = this.liabilityLay + parseFloat(this.stake);
      });
      _.forEach(item.noBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == '') {
          this.stake = 0;
        }
        this.liabilityNo = this.liabilityNo + parseFloat(this.stake);
      });
      _.forEach(item.layBookBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == '') {
          this.stake = 0;
        }
        this.liabilityLayBook = this.liabilityLayBook + parseFloat(this.stake);
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

  marketWiseData(markets) {
    var newMarkets = {};
    _.forEach(markets, (item, key) => {
      var runnerarray = [];
      _.forEach(item.runnerData1, (item, key) => {
        if (item.Key != undefined) {
          runnerarray.push(item.Value);
        } else {
          runnerarray.push(item);
        }
      });
      item.runnerData1 = runnerarray;
      item.runnerData = item.runnerData1;
      item['marketName'] = item.name;
      item['mktStatus'] = item.status.trim('');
      item['mktId'] = item.id;
      // item['mtBfId']=item.bfId;
      newMarkets[item.bfId] = item;
    });
    return newMarkets;
    //// console.log(this.markets)
  }

  FancyData(matchfancyData) {
    this.mtid = this.matchid;
    if (!this.fancyBookCalled) {
      this.getFancyExposure();
      this.fancyBookCalled = true;
    }
  }

  getFancyExposure() {
    this.fullmarketService
      .getFancyExposure(this.matchid)
      .subscribe((response: GenericResponse<any>) => {
        if (response.errorCode === 0) {
          _.forEach(response.result[0], (value, item) => {
            this.fancyData.forEach((fancy) => {
              if (+item.split('_')[2] == fancy.sid) {
                $('#fancyBetBookBtn_' + fancy.sid).css('display', 'block');
                $('#fancyBetBookBtnM_' + fancy.sid).css('display', 'block');
                if (value < 0) {
                  $('#fexp_' + fancy.sid)
                    .text('' + value.toFixed(2) + '')
                    .addClass('minusval');
                } else {
                  $('#fexp_' + fancy.sid)
                    .text('' + (value * -1).toFixed(2) + '')
                    .addClass('minusval');
                }
              }
              // }
            });
          });
        }
      });
  }

  getBMExposureBook(marketId) {

    if (this.sportId == 52) {
      marketId = marketId.replace('bm_', '')
    }
    this.fullmarketService
      .getBookExposure(marketId)
      .subscribe((response: GenericResponse<any>) => {
        if (response.errorCode === 0) {
          $('.bookmakerExpo').removeClass('minusval');
          $('.bookmakerExpo').removeClass('plusval');
          $('.bookmakerExpo').removeClass('minusval');
          $('.bookmakerExpo').removeClass('plusval');

          _.forEach(response.result[0], (value, item) => {
            this.BMbookdata[marketId] = response.result


            value = +value;
            // $('#fancyBetBookBtn_' + fancy.sid).css('display', 'block');
            // if (value[0][1] == 0) {
            //   value[0][1] = 0;
            // } else {
            // $('#fancyBetBookBtn_' + fancy.sid).css('display', 'block');
            if (value < 0) {
              $('#bmExp_' + item).removeClass('minusval');
              $('#bmExp_' + item).removeClass('plusval');

              $('#bmExp_' + item)
                .text('' + value.toFixed(2) + '')
                .addClass('minusval');
            } else {
              $('#bmExp_' + item).removeClass('plusval');
              $('#bmExp_' + item).removeClass('minusval');

              $('#bmExp_' + item)
                .text('' + value.toFixed(2) + '')
                .addClass('plusval');
              $('#fancyBetBookBtn_' + item).css('display', 'block');
            }
            // }
          });
        }
      });
  }

  stakeValue(stake, bet, booktype) {
    //// console.log(stake)

    if (bet.backlay == 'back' || bet.backlay == 'lay') {
      var getStake = bet.stake;
      if (getStake == '') {
        getStake = 0;
      }
      var totalStake = parseInt(getStake) + parseInt(stake);
      bet.stake = totalStake;
      var odds = bet.odds;
      var stake = bet.stake;
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
    this.calcProfit(bet)


  }


  updateStake(bet, booktype) {
    if (!bet.stake || bet.stake == '') {
      bet.stake = 0.0;
    }
    if (bet.backlay == 'back' || bet.backlay == 'lay') {
      var odds = bet.odds;
      //// console.log(bet);
      if (bet.gameType === '-12') {
        odds = parseFloat(odds) / 100 + 1;
      }
      let pnl = ((parseFloat(odds) - 1) * parseFloat(bet.stake)).toFixed(2);
      bet.profit = pnl;
      //// console.log(bet.profit, bet);
      this.calcExposure(this.ExpoMktid, this.bets);

    }
    if (bet.backLay == 'BACK' || bet.backLay == 'LAY') {
      var odds = bet.odds;
      if (bet.gameType === '-12') {
        odds = parseFloat(odds) / 100 + 1;
      }
      let pnl = (parseFloat(odds) - 1) * parseFloat(bet.stake);
      bet.profit = pnl.toFixed(2);
      $('#profitLiabilityBackUM_' + bet.id + '').text(pnl.toFixed(2));
      $('#profitLiabilityLayUM_' + bet.id + '').text(pnl.toFixed(2));
    }

    if (bet.backlay == 'backBook' || bet.backlay == 'layBook') {
      // if (booktype === 1) {
      var odds = bet.odds;
      var pnl = (parseFloat(odds) / 100) * parseFloat(bet.stake);
      bet.profit = pnl.toFixed(2);
      // } else {
      //   var odds = bet.odds;
      //   var pnl = (parseFloat(odds) - 1) * parseFloat(bet.stake);
      //   bet.profit = pnl.toFixed(2);
      // }
    }

    if (bet.yesno == 'yes' || bet.yesno == 'no') {
      var rate = bet.rate;
      var pnl = (parseFloat(rate) * parseFloat(bet.stake)) / 100;
      bet.profit = pnl.toFixed(2);
    }
    //// console.log(bet);
    this.calculateLiability();
    this.calcProfit(bet)


  }

  placeBet(isMobile?: boolean) {
    if (!this.authService.getLoggedIn()) {
      // Relogin()
      this.toastr.info('Token was expired. Please login to continue.');
      return false;
    }

    this.setBetTimeout();
    if (isMobile) {
      this.placeBetMobile(this.placeMarketData);
      return;
    }

    this.placedButton = true;

    if (this.backBetSlipDataArray.length >= 1) {
      _.forEach(this.backBetSlipDataArray, (item, key) => {
        if (item.backBetSlipData.length >= 1) {
          $('#loading_place_bet').css('display', 'block');
          _.forEach(item.backBetSlipData, (item2) => {
            this.placeBetFunc(item2, key);
          });
        }
        if (item.yesBetSlipData.length >= 1) {
          // $('.spinner-text').html('Placing bet please wait...');
          _.forEach(item.yesBetSlipData, (item2) => {
            this.placeBetFancy(item2, key);
          });
        }
        if (item.backBookBetSlipData.length >= 1) {
          // $('#loading_place_bet').css('display','block');

          _.forEach(item.backBookBetSlipData, (item2) => {
            this.placeBookBetFunc(item2, key);
          });
        }
      });
    }

    if (this.layBetSlipDataArray.length >= 1) {
      _.forEach(this.layBetSlipDataArray, (item, key) => {
        if (item.layBetSlipData.length >= 1) {
          $('#loading_place_bet').css('display', 'block');

          _.forEach(item.layBetSlipData, (item2) => {
            this.placeBetFunc(item2, key);
          });
        }
        if (item.noBetSlipData.length >= 1) {
          // $('.spinner-text').html('Placing bet please wait...');
          _.forEach(item.noBetSlipData, (item2) => {
            //// console.log(item2)
            if (parseInt(item2.rate) == 0 || parseInt(item2.score) == 0) {
              // $interval.cancel(this.stopTime);
              return false;
            }
            this.placeBetFancy(item2, key);
          });
        }
        if (item.layBookBetSlipData.length >= 1) {
          // $('#loading_place_bet').css('display','block');

          _.forEach(item.layBookBetSlipData, (item2) => {
            this.placeBookBetFunc(item2, key);
          });
        }
      });
    }
  }

  fancybetSlip = function (
    betType,
    betSlipIndex,
    runnerName,
    selectionId,
    matchName,
    odds,
    mktid,
    mtid,
    fancyRate,
    fancyId,
    sportId,
    matchBfId,
    bfId
  ) {
    //// console.log(
    //   betType,
    //   ',',
    //   betSlipIndex,
    //   ',',
    //   runnerName,
    //   ',',
    //   selectionId,
    //   ',',
    //   matchName,
    //   ',',
    //   odds,
    //   ',',
    //   mktid,
    //   ',',
    //   mtid,
    //   ',',
    //   fancyRate,
    //   ',',
    //   fancyId,
    //   ',',
    //   sportId,
    //   ',',
    //   matchBfId
    // );
    this.Odds = parseInt(odds).toFixed(0);
    this.fancyRate = parseInt(fancyRate).toFixed(0);
    //// console.log(this.Odds,this.fancyRate);
    this.oneClicked = localStorage.getItem('oneclick');
    $('#fancyBetMarketList .lay-1').removeClass('select');
    $('#fancyBetMarketList .back-1').removeClass('select');
    $('#fancyBetMarketList .fancy-quick-tr').css('display', 'none');

    $('#inputStake_NO_' + fancyId + '').val('');
    $('#inputStake_YES_' + fancyId + '').val('');
    $('#placeBet_YES_' + fancyId + '').addClass('disable');
    $('#placeBet_NO_' + fancyId + '').addClass('disable');
    $('#after .to-win').css('display', 'inline');

    if (this.oneClicked == null) {
      if (betType == 'no') {
        //// console.log('#lay_' + fancyId);
        $('#lay_' + fancyId).addClass('select');
        $('#fancyBetBoard_' + fancyId + '_lay').css('display', 'block');
      } else {
        //// console.log('#back_' + fancyId);
        $('#back_' + fancyId).addClass('select');
        $('#fancyBetBoard_' + fancyId + '_back').css('display', 'block');
      }
    } else {
      this.oneclickbetdata = {
        fancyId: fancyId,
        matchBfId: matchBfId,
        matchId: mtid,
        marketId: mktid,
        rate: this.fancyRate,
        runnerName: runnerName,
        score: this.Odds,
        stake: this.oneClickStake[this.selected_Stake_btn],
        yesno: betType,
        mktBfId: bfId,
      };
      this.OneclickFancyBet(this.oneclickbetdata);
    }
  };

  fancyStakechange(stake, fancyId) {
    //// console.log(stake);
    if (stake == null || stake == undefined) {
      $('#placeBet_YES_' + fancyId + '').addClass('disable');
    } else {
      $('#placeBet_YES_' + fancyId + '').removeClass('disable');
    }
    if (stake == null || stake == undefined) {
      $('#placeBet_NO_' + fancyId + '').addClass('disable');
    } else {
      $('#placeBet_NO_' + fancyId + '').removeClass('disable');
    }
  }

  placeFancyBet(
    betType,
    betSlipIndex,
    runnerName,
    selectionId,
    matchName,
    fancyRate,
    mktid,
    mtid,
    odds,
    fancyId,
    sportId,
    matchBfId,
    bfId
  ) {
    //// console.log(betType, betSlipIndex, runnerName, matchName, odds, mktid, mtid,isInplay, fancyRate, fancyId,sportId,matchBfId,bfId);
    if (!this.authService.getLoggedIn()) {
      // Relogin()
      this.toastr.info('Token was expired. Please login to continue.');
      return false;
    }
    this.odds = parseInt(odds).toFixed(0);
    this.fancyRate = parseInt(fancyRate).toFixed(0);
    var stake;
    if (betType == 'no') {
      stake = $('#inputStake_NO_' + fancyId + '').val();
      $('#placeBet_NO_' + fancyId + '').attr('disabled');
    } else {
      stake = $('#inputStake_YES_' + fancyId + '').val();
      $('#placeBet_YES_' + fancyId + '').attr('disabled');
    }

    // Odds is rate and runs is score
    let betData1 = {
      marketId: mktid,
      marketName: runnerName,
      odds: +odds,
      runs: +fancyRate,
      stake: +stake,
      betType: betType,
      gameType: 'fancy',
    };
    // $('#fancyBetBar_' + fancyId + '').css('display', 'table-row');
    $('#fancyBetMarketList .fancy-overly-singleline').css('display', 'block');

    // $timeout(function () {
    this.betsService.placeBet(betData1).subscribe(
      (response: GenericResponse<any>) => {

        if (response.errorCode == 0) {
          if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
            let getResp = response.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResultPlaceFancyBet(getResp, betData1, fancyId, betType);
            }, (getResp.delay * 1000) + 500);
          } else {
            this.toastr.success(response.errorDescription);
            setTimeout(() => {
              if (response.result[1]) {
                // console.log("click")
              }
              this.userService.getBalance();
              this.getOpenBetsByEvent();
              this.getFancyExposure();
            }, 500);
            $('#fancyBetBar_' + fancyId + '').css('display', 'none');
            $('#betslip_open').addClass('close');
            $('#header_' + fancyId).text(response.errorDescription);
            $('#fancyBetMessage_' + fancyId + ' .quick_bet-message').removeClass(
              'error'
            );
            $('#fancyBetMessage_' + fancyId + ' .quick_bet-message').addClass(
              'success'
            );
            $('#fancyBetMessage_' + fancyId + '').css('display', 'table-row');
            setTimeout(() => {
              $(
                '#fancyBetMessage_' + fancyId + ' .quick_bet-message'
              ).removeClass('success');
              $('#fancyBetMessage_' + fancyId + '').css('display', 'none');
            }, 3000);
            $('#placeBet_YES_' + fancyId + '').removeAttr('disabled');
            $('#placeBet_NO_' + fancyId + '').removeAttr('disabled');
            this.removefancybetslip(fancyId, betType);
            $('#fancyBetMarketList .fancy-overly-singleline').css(
              'display',
              'none'
            );
          }
        } else {
          this.toastr.error(response.errorDescription);
          this.cancelBetslip()

          // $('#header_' + fancyId).text(response.errorDescription);
          $('#fancyBetBar_' + fancyId + '').css('display', 'none');
          $('#fancyBetMessage_' + fancyId + ' .quick_bet-message').removeClass(
            'success'
          );
          $('#fancyBetMessage_' + fancyId + ' .quick_bet-message').addClass(
            'error'
          );
          setTimeout(() => {
            $(
              '#fancyBetMessage_' + fancyId + ' .quick_bet-message'
            ).removeClass('error');
            $('#fancyBetMessage_' + fancyId + '').css('display', 'none');
          }, 3000);
          $('#fancyBetMessage_' + fancyId + '').css('display', 'table-row');
          $('#placeBet_YES_' + fancyId + '').removeAttr('disabled');
          $('#placeBet_NO_' + fancyId + '').removeAttr('disabled');
          this.removefancybetslip(fancyId, betType);
          $('#fancyBetMarketList .fancy-overly-singleline').css(
            'display',
            'none'
          );
        }
      },
      function myError(error) {
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
        if (error.status == 400) {
          this.toastr.error('Unable to Place Bet!');
          this.cancelBetslip()

        }
      }
    );
    // }, 3000);
  }


  requestResultPlaceFancyBet(data, betData1, fancyId, betType) {

    //// console.log(data)
    this.betsService.requestResult(data.reqId).subscribe(
      (response: GenericResponse<any>) => {

        if (response.errorCode == 0) {
          if (response.result[0]?.result == "pending") {
            setTimeout(() => {
              this.requestResultPlaceFancyBet(data, betData1, fancyId, betType);
            }, 500)
          } else {
            this.toastr.success(response.errorDescription);
            setTimeout(() => {
              this.userService.getBalance();
              this.getOpenBetsByEvent();
              this.getFancyExposure();
            }, 500);
            $('#fancyBetBar_' + fancyId + '').css('display', 'none');
            $('#betslip_open').addClass('close');
            $('#header_' + fancyId).text(response.errorDescription);
            $('#fancyBetMessage_' + fancyId + ' .quick_bet-message').removeClass(
              'error'
            );
            $('#fancyBetMessage_' + fancyId + ' .quick_bet-message').addClass(
              'success'
            );
            $('#fancyBetMessage_' + fancyId + '').css('display', 'table-row');
            setTimeout(() => {
              $(
                '#fancyBetMessage_' + fancyId + ' .quick_bet-message'
              ).removeClass('success');
              $('#fancyBetMessage_' + fancyId + '').css('display', 'none');
            }, 3000);
            $('#placeBet_YES_' + fancyId + '').removeAttr('disabled');
            $('#placeBet_NO_' + fancyId + '').removeAttr('disabled');
            this.removefancybetslip(fancyId, betType);
            $('#fancyBetMarketList .fancy-overly-singleline').css(
              'display',
              'none'
            );
          }
        } else {
          this.toastr.error(response.errorDescription);
          this.cancelBetslip()

          // $('#header_' + fancyId).text(response.errorDescription);
          $('#fancyBetBar_' + fancyId + '').css('display', 'none');
          $('#fancyBetMessage_' + fancyId + ' .quick_bet-message').removeClass(
            'success'
          );
          $('#fancyBetMessage_' + fancyId + ' .quick_bet-message').addClass(
            'error'
          );
          setTimeout(() => {
            $(
              '#fancyBetMessage_' + fancyId + ' .quick_bet-message'
            ).removeClass('error');
            $('#fancyBetMessage_' + fancyId + '').css('display', 'none');
          }, 500);
          $('#fancyBetMessage_' + fancyId + '').css('display', 'table-row');
          $('#placeBet_YES_' + fancyId + '').removeAttr('disabled');
          $('#placeBet_NO_' + fancyId + '').removeAttr('disabled');
          this.removefancybetslip(fancyId, betType);
          $('#fancyBetMarketList .fancy-overly-singleline').css(
            'display',
            'none'
          );
        }

      },
      function myError(error) {
        $('#placebet_btn').removeClass('disable');
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
      }
    );

  }

  placeBetFunc(betData, index) {
    $('#loading_place_bet').css('display', 'block');

    // $('.loading').css('display','block');
    // betData["source"] = 'web';

    // betData["info"] = 'os:' + jscd.os + ', os_version:' + jscd.osVersion + ', browser:' + jscd.browser + ', browser_version:' + jscd.browserMajorVersion;

    try {
      let matchOdds;
      if (this.marketdata.racing) {
        matchOdds = this.currentMatchData[0];
      } else {
        matchOdds = this.currentMatchData.find((m) =>
          m.marketName.toLowerCase().includes('match odds')
        );
      }
      let selection = matchOdds.runners.find(
        (s) => s.selectionId == betData.selectionId
      );


      if (
        betData.backlay.toLowerCase() == 'back' &&
        selection.ex.availableToBack[0].price + 0.1 < +betData.odds
      ) {
        this.toastr.error(
          `Unmatched Bet of ${betData.odds} price is not allowed. price difference of 0.1 from current price is allowed for unmatched. Please try again.`
        );
        $('#loading_place_bet').css('display', 'none');
        this.cancelBetslip()

        return;
      } else if (
        betData.backlay.toLowerCase() == 'lay' &&
        selection.ex.availableToLay[0].price - 0.1 > +betData.odds
      ) {
        this.toastr.error(
          `Unmatched Bet of ${betData.odds} price is not allowed. price difference of 0.1 from current price is allowed for unmatched. Please try again.`
        );
        $('#loading_place_bet').css('display', 'none');
        this.cancelBetslip()

        return;
      }
    } catch (error) { }
    let betData1 = {
      marketId: betData.marketId,
      selId: betData.selectionId,
      odds: +betData.odds,
      stake: +betData.stake,
      betType: betData.backlay,
      gameType: '',
    };
    // console.log(betData1, "");
    $('#placebet_btn').removeClass('disable');
    $('#placebet_btn').addClass('disable');
    $('#placebet_btn').prop('disabled', true);
    this.disablePlaceBet = true;
    this.betsService.placeBet(betData1).subscribe(
      (response: GenericResponse<any>) => {
        if (response.errorCode == 0) {

          if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
            let getResp = response.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              if (response.result[1]) {
                // console.log("click")
              }
              this.requestResultPlaceBetFunc(getResp, betData1, betData, index);
            }, (getResp.delay * 1000) + 500);
          } else {
            // this.$emit("callExp", {})

            // if($location.path()=== "/multi-market"){
            //     this.$emit("callMultiMarketExp", {})
            // }

            if (response.result[0].unmatched == 1) {
              this.toastr.success('Unmatched Bet placed');
            } else {
              this.toastr.success('Bet placed successfully');
            }
            // $("#betslip_open").addClass("close");
            setTimeout(() => {
              if (response.result[1]) {
                // console.log("click")
                this.BookDataList = response.result[1];
                // console.log(this.BookDataList)
                if (this.BookDataList) {
                  _.forEach(Object.keys(this.BookDataList), (item, index) => {
                    var mktexposure = +this.BookDataList[item];
                    let id = '#exposure_' + response.result[0].marketId.replace('.', '_') + '_' + item;
                    if (mktexposure > 0) {
                      $(id).removeClass('minusval');
                      $(id).text(mktexposure.toFixed(2)).addClass('proft');
                    } else {
                      $(id).removeClass('profit');
                      $(id)
                        .text(mktexposure === 0 ? '0' : mktexposure.toFixed(2))
                        .addClass('minusval');
                    }
                  });
                  localStorage.setItem(
                    'Exposure_' + response,
                    JSON.stringify(response.result[1])
                  );
                }
                else {
                  this.ExposureBook(betData1.marketId);
                }

              }
              else {
                this.ExposureBook(betData1.marketId);
              }
              if (response.result[2]) {
                this.matchedData = Array.from(
                  response.result[2].filter((bet) => bet.eventId == this.matchid && bet.unmatched == 0)
                );
                // console.log(response.result)
              } else {
                this.getOpenBetsByEvent();
              }
              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();

              }
              // this.userService.getBalance();
              // this.getOpenBetsByEvent();
              // this.ExposureBook(betData1.marketId);
            }, 500);
            $('#placebet_btn').removeClass('disable');
            $('#placebet_btn').prop('disabled', false);
            $('.matchOddTable .select').removeClass('select');
            this.removeAllBetSlip();
            // this.getMultiExposureBook()

            this.placedButton = false;
            $('#loading_place_bet').css('display', 'none');

            this.disablePlaceBet = false;
            if (betData.backlay == 'back' && this.backBetSlipDataArray.length) {
              var i =
                this.backBetSlipDataArray[index].backBetSlipData.indexOf(betData);
              var slipIndex = this.backBetSlipList.indexOf(
                betData.runnerName + i + 'back'
              );
              if (i != -1) {
                this.backBetSlipDataArray[index].backBetSlipData.splice(i, 1);
                this.backBetSlipList.splice(slipIndex, 1);
              }
              if (
                this.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
                this.backBetSlipDataArray[index].backBookBetSlipData.length == 0 &&
                this.backBetSlipDataArray[index].yesBetSlipData.length == 0
              ) {
                this.backBetSlipDataArray.splice(index, 1);
              }
            } else if (
              betData.backlay == 'lay' &&
              this.layBetSlipDataArray.length
            ) {
              var i =
                this.layBetSlipDataArray[index].layBetSlipData.indexOf(betData);
              var slipIndex = this.layBetSlipList.indexOf(
                betData.runnerName + i + 'lay'
              );
              if (i != -1) {
                this.layBetSlipDataArray[index].layBetSlipData.splice(i, 1);
                this.layBetSlipList.splice(slipIndex, 1);
              }
              if (
                this.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
                this.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
                this.layBetSlipDataArray[index].noBetSlipData.length == 0
              ) {
                this.layBetSlipDataArray.splice(index, 1);
              }
            }
          }
        } else {
          this.removeAllBetSlip();
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          $('.matchOddTable .select').removeClass('select');

          this.toastr.error(response.errorDescription);
          this.cancelBetslip()


          this.placedButton = false;
          $('#loading_place_bet').css('display', 'none');
          this.disablePlaceBet = false;
          if (betData.backlay == 'back' && this.backBetSlipDataArray.length) {
            var i =
              this.backBetSlipDataArray[index].backBetSlipData.indexOf(betData);
            var slipIndex = this.backBetSlipList.indexOf(
              betData.runnerName + i + 'back'
            );
            if (i != -1) {
              this.backBetSlipDataArray[index].backBetSlipData.splice(i, 1);
              this.backBetSlipList.splice(slipIndex, 1);
            }
            if (
              this.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
              this.backBetSlipDataArray[index].backBookBetSlipData.length == 0 &&
              this.backBetSlipDataArray[index].yesBetSlipData.length == 0
            ) {
              this.backBetSlipDataArray.splice(index, 1);
            }
          } else if (
            betData.backlay == 'lay' &&
            this.layBetSlipDataArray.length
          ) {
            var i =
              this.layBetSlipDataArray[index].layBetSlipData.indexOf(betData);
            var slipIndex = this.layBetSlipList.indexOf(
              betData.runnerName + i + 'lay'
            );
            if (i != -1) {
              this.layBetSlipDataArray[index].layBetSlipData.splice(i, 1);
              this.layBetSlipList.splice(slipIndex, 1);
            }
            if (
              this.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
              this.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
              this.layBetSlipDataArray[index].noBetSlipData.length == 0
            ) {
              this.layBetSlipDataArray.splice(index, 1);
            }
          }
        }


      },
      function myError(error) {
        $('#placebet_btn').removeClass('disable');
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
      }
    );
  }

  requestResultPlaceBetFunc(data, betData1, betData, index) {

    //// console.log(data)
    this.betsService.requestResult(data.reqId).subscribe(
      (response: GenericResponse<any>) => {

        if (response.errorCode == 0) {

          if (response.result[0]?.result == "pending") {

            setTimeout(() => {
              this.requestResultPlaceBetFunc(data, betData1, betData, index);
            }, 500)
          } else {
            // this.$emit("callExp", {})

            // if($location.path()=== "/multi-market"){
            //     this.$emit("callMultiMarketExp", {})
            // }

            if (response.result[0].unmatched == 1) {
              this.toastr.success('Unmatched Bet placed');
            } else {
              this.toastr.success('Bet placed successfully');
            }
            // $("#betslip_open").addClass("close");
            setTimeout(() => {
              if (response.result[1]) {
                // console.log("click")
                this.BookDataList = response.result[1];
                // console.log(this.BookDataList)

                if (this.BookDataList) {
                  _.forEach(Object.keys(this.BookDataList), (item, index) => {
                    var mktexposure = +this.BookDataList[item];
                    let id = '#exposure_' + response.result[0].marketId.replace('.', '_') + '_' + item;
                    if (mktexposure > 0) {
                      $(id).removeClass('minusval');
                      $(id).text(mktexposure.toFixed(2)).addClass('proft');
                    } else {
                      $(id).removeClass('profit');
                      $(id)
                        .text(mktexposure === 0 ? '0' : mktexposure.toFixed(2))
                        .addClass('minusval');
                    }
                  });
                  localStorage.setItem(
                    'Exposure_' + response,
                    JSON.stringify(response.result[1])
                  );
                }
                else {
                  this.ExposureBook(betData1.marketId);
                }

              }
              else {
                this.ExposureBook(betData1.marketId);
              }
              if (response.result[2]) {
                this.matchedData = Array.from(
                  response.result[2].filter((bet) => bet.eventId == this.matchid && bet.unmatched == 0)
                );
                // console.log(response.result)
              } else {
                this.getOpenBetsByEvent();
              }
              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();

              }
              // this.userService.getBalance();
              // this.getOpenBetsByEvent();
              // this.ExposureBook(betData1.marketId);
            }, 500);
            $('#placebet_btn').removeClass('disable');
            $('#placebet_btn').prop('disabled', false);
            $('.matchOddTable .select').removeClass('select');
            this.removeAllBetSlip();
            // this.getMultiExposureBook()

            this.placedButton = false;
            $('#loading_place_bet').css('display', 'none');

            this.disablePlaceBet = false;
            if (betData.backlay == 'back' && this.backBetSlipDataArray.length) {
              var i =
                this.backBetSlipDataArray[index].backBetSlipData.indexOf(betData);
              var slipIndex = this.backBetSlipList.indexOf(
                betData.runnerName + i + 'back'
              );
              if (i != -1) {
                this.backBetSlipDataArray[index].backBetSlipData.splice(i, 1);
                this.backBetSlipList.splice(slipIndex, 1);
              }
              if (
                this.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
                this.backBetSlipDataArray[index].backBookBetSlipData.length == 0 &&
                this.backBetSlipDataArray[index].yesBetSlipData.length == 0
              ) {
                this.backBetSlipDataArray.splice(index, 1);
              }
            } else if (
              betData.backlay == 'lay' &&
              this.layBetSlipDataArray.length
            ) {
              var i =
                this.layBetSlipDataArray[index].layBetSlipData.indexOf(betData);
              var slipIndex = this.layBetSlipList.indexOf(
                betData.runnerName + i + 'lay'
              );
              if (i != -1) {
                this.layBetSlipDataArray[index].layBetSlipData.splice(i, 1);
                this.layBetSlipList.splice(slipIndex, 1);
              }
              if (
                this.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
                this.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
                this.layBetSlipDataArray[index].noBetSlipData.length == 0
              ) {
                this.layBetSlipDataArray.splice(index, 1);
              }
            }
          }
        } else {
          this.removeAllBetSlip();
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          $('.matchOddTable .select').removeClass('select');

          this.toastr.error(response.errorDescription);
          this.cancelBetslip()


          this.placedButton = false;
          $('#loading_place_bet').css('display', 'none');
          this.disablePlaceBet = false;
          if (betData.backlay == 'back' && this.backBetSlipDataArray.length) {
            var i =
              this.backBetSlipDataArray[index].backBetSlipData.indexOf(betData);
            var slipIndex = this.backBetSlipList.indexOf(
              betData.runnerName + i + 'back'
            );
            if (i != -1) {
              this.backBetSlipDataArray[index].backBetSlipData.splice(i, 1);
              this.backBetSlipList.splice(slipIndex, 1);
            }
            if (
              this.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
              this.backBetSlipDataArray[index].backBookBetSlipData.length == 0 &&
              this.backBetSlipDataArray[index].yesBetSlipData.length == 0
            ) {
              this.backBetSlipDataArray.splice(index, 1);
            }
          } else if (
            betData.backlay == 'lay' &&
            this.layBetSlipDataArray.length
          ) {
            var i =
              this.layBetSlipDataArray[index].layBetSlipData.indexOf(betData);
            var slipIndex = this.layBetSlipList.indexOf(
              betData.runnerName + i + 'lay'
            );
            if (i != -1) {
              this.layBetSlipDataArray[index].layBetSlipData.splice(i, 1);
              this.layBetSlipList.splice(slipIndex, 1);
            }
            if (
              this.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
              this.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
              this.layBetSlipDataArray[index].noBetSlipData.length == 0
            ) {
              this.layBetSlipDataArray.splice(index, 1);
            }
          }
        }

      },
      function myError(error) {
        $('#placebet_btn').removeClass('disable');
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
      }
    );

  }

  placeBetMobile(betData) {
    if (this.sportId == 52) {
      betData.marketId = betData.marketId.replace('bm_', '')
    }

    $(`#inline-pendding${betData.selectionId}`).css('display', 'block');
    $(`#inline-pendding1${betData.selectionId}`).css('display', 'block');
    let betData1 = {
      marketId: betData.marketId,
      selId: betData.selectionId,
      odds: betData.odds,
      stake: +betData.stake,
      eventId: this.matchid,
      uid: this.currentUser.userName,
      betType: '',
      gameType: betData.gameType,
    };

    try {
      let matchOdds;
      if (this.marketdata.racing) {
        matchOdds = this.currentMatchData[0];
      } else {
        matchOdds = this.currentMatchData.find((m) =>
          m.marketName.toLowerCase().includes('match odds')
        );
      }
      let selection = matchOdds.runners.find(
        (s) => s.selectionId == betData.selectionId
      );

      // if (
      //   betData.backlay.toLowerCase() == 'back' &&
      //   selection.ex.availableToBack[0].price + 0.1 < +betData.odds
      // ) {
      //   this.toastr.error(
      //     `Unmatched Bet of ${betData.odds} price is not allowed. price difference of 0.1 from current price is allowed for unmatched. Please try again.`
      //   );
      //   $(`#inline-pendding${betData.selectionId}`).css('display', 'none');
      //   this.cancelBetslip()

      //   return;
      // } else if (
      //   betData.backlay.toLowerCase() == 'lay' &&
      //   selection.ex.availableToLay[0].price - 0.1 > +betData.odds
      // )
      //  {
      //   this.toastr.error(
      //     `Unmatched Bet of ${betData.odds} price is not allowed. price difference of 0.1 from current price is allowed for unmatched. Please try again.`
      //   );
      //   $(`#inline-pendding${betData.selectionId}`).css('display', 'none');
      //   this.cancelBetslip()

      //   return;
      // }
    } catch (error) { }

    if (betData?.gameType == 'premium') {
      betData1.gameType = 'premium';
    } else if (betData.backlay == 'backBook' || betData.backlay == 'layBook') {
      betData1.gameType = 'book';
    } else if (betData.backlay == 'back' || betData.backlay == 'lay') {
      betData1.gameType = 'exchange';
    }
    switch (betData.backlay) {
      case 'back':
      case 'backBook':
        betData1.betType = 'back';
        break;
      case 'lay':
      case 'layBook':
        betData1.betType = 'lay';
        break;
    }


    //// console.log(betData1);
    $('#placebet_btn').removeClass('disable');
    $('#placebet_btn').addClass('disable');
    $('#placebet_btn').prop('disabled', true);
    this.disablePlaceBet = true;
    // console.log(betData1, "betData1");

    if (betData1.gameType == 'premium') {
      this.betsService.placeBetsPremium(betData1).subscribe(
        (response: GenericResponse<any>) => {

          if (response.errorCode == 0) {
            if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
              let getResp = response.result[0];
              // getResp.delay = getResp.delay + 1;

              setTimeout(() => {
                this.requestResultPlaceBetMobile(getResp, betData1);
              }, (getResp.delay * 1000) + 500);
            } else {
              // this.$emit("callExp", {})

              // if($location.path()=== "/multi-market"){
              //     this.$emit("callMultiMarketExp", {})
              // }

              this.toastr.success(response.errorDescription);
              $('#loading_place_bet').css('display', 'none');
              $(`#inline-pendding${this.placeMarketData?.selectionId}`).css(
                'display',
                'none'
              );
              // $("#betslip_open").addClass("close");
              setTimeout(() => {
                if (response.result[1]) {
                  // console.log("click")
                  if (response.result[0].gameType == 'premium') {
                    this.BookDataList = response.result[1];
                    // console.log(this.BookDataList)

                    if (this.BookDataList) {
                      _.forEach(Object.keys(this.BookDataList), (item, index) => {
                        var mktexposure = +this.BookDataList[item];
                        let id = '#exposure_' + response.result[0].marketId.replace('.', '_') + '_' + item;
                        if (mktexposure > 0) {
                          $(id).removeClass('minusval');
                          $(id).text(mktexposure.toFixed(2)).addClass('proft');
                        } else {
                          $(id).removeClass('profit');
                          $(id)
                            .text(mktexposure === 0 ? '0' : mktexposure.toFixed(2))
                            .addClass('minusval');
                        }
                      });
                      localStorage.setItem(
                        'Exposure_' + response,
                        JSON.stringify(response.result[1])
                      );
                    }
                  }
                  else {
                    this.ExposureBook(betData1.marketId);
                  }
                  if (response.result[0].gameType == 'book') {
                    // console.log(response.result[1])
                    _.forEach(response.result[1], (value, item) => {
                      value = +value;

                      if (value < 0) {
                        $('#bmExp_' + item)
                          .text('' + value.toFixed(2) + '')
                          .addClass('minusval');
                      } else {
                        $('#bmExp_' + item)
                          .text('' + value.toFixed(2) + '')
                          .addClass('plusval');
                        $('#fancyBetBookBtn_' + item).css('display', 'block');
                      }
                      // }
                    });

                  }
                  else {
                    this.getBMExposureBook(betData1.marketId);
                  }
                }
                else {
                  this.ExposureBook(betData1.marketId);
                  this.getBMExposureBook(betData1.marketId);
                }
                if (response.result[2]) {
                  this.matchedData = Array.from(
                    response.result[2].filter((bet) => bet.eventId == this.matchid && bet.unmatched == 0)
                  );
                  // console.log(response.result)
                } else {
                  this.userService.getBets();
                }
                if (response.result[3]) {
                  this.userService.setBalance(response.result[3][0]);
                } else {
                  this.userService.getBalance();

                }
                // this.userService.getBalance();
                // this.userService.getBets();
                // this.ExposureBook(betData1.marketId);
                // this.getBMExposureBook(betData1.marketId);
              }, 500);
              $('#placebet_btn').removeClass('disable');
              $('#placebet_btn').prop('disabled', false);
              $('.matchOddTable .select').removeClass('select');
              this.removeAllBetSlip();
              // this.getMultiExposureBook()
              this.placedButton = false;
              this.disablePlaceBet = false;
              this.placeMarketData = null;
            }
          } else {
            this.removeAllBetSlip();
            $('#loading_place_bet').css('display', 'none');
            $(`#inline-pendding${this.placeMarketData?.selectionId}`).css(
              'display',
              'none'
            );
            $(`#inline-pendding1${this.placeMarketData?.selectionId}`).css(
              'display',
              'none'
            );
            $('#placebet_btn').removeClass('disable');
            $('#placebet_btn').prop('disabled', false);
            $('.matchOddTable .select').removeClass('select');

            this.toastr.error(response.errorDescription);
            this.placedButton = false;
            this.disablePlaceBet = false;
            this.placeMarketData = null;
            this.cancelBetslip()

          }

        },
        function myError(error) {
          $('#placebet_btn').removeClass('disable');
          if (error.status == 401) {
            // $.removeCookie("authtoken");
            // window.location.href="index.html"
          }
        }
      );
    } else {
      this.betsService.placeBet(betData1).subscribe(
        (response: GenericResponse<any>) => {

          if (response.errorCode == 0) {
            if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
              let getResp = response.result[0];
              // getResp.delay = getResp.delay + 1;

              setTimeout(() => {
                this.requestResultPlaceBetMobile(getResp, betData1);
              }, (getResp.delay * 1000) + 500);
            } else {
              // this.$emit("callExp", {})

              // if($location.path()=== "/multi-market"){
              //     this.$emit("callMultiMarketExp", {})
              // }

              this.toastr.success(response.errorDescription);
              $('#loading_place_bet').css('display', 'none');
              $(`#inline-pendding${this.placeMarketData?.selectionId}`).css(
                'display',
                'none'
              );

              // $("#betslip_open").addClass("close");
              setTimeout(() => {
                if (response.result[1]) {
                  // console.log("click")
                  if (response.result[0].gameType == 'exchange') {
                    this.BookDataList = response.result[1];
                    // console.log(this.BookDataList)

                    if (this.BookDataList) {
                      _.forEach(Object.keys(this.BookDataList), (item, index) => {
                        var mktexposure = +this.BookDataList[item];
                        let id = '#exposure_' + response.result[0].marketId.replace('.', '_') + '_' + item;
                        if (mktexposure > 0) {
                          $(id).removeClass('minusval');
                          $(id).text(mktexposure.toFixed(2)).addClass('proft');
                        } else {
                          $(id).removeClass('profit');
                          $(id)
                            .text(mktexposure === 0 ? '0' : mktexposure.toFixed(2))
                            .addClass('minusval');
                        }
                      });
                      localStorage.setItem(
                        'Exposure_' + response,
                        JSON.stringify(response.result[1])
                      );
                    }
                  }
                  else {
                    this.ExposureBook(betData1.marketId);
                  }
                  if (response.result[0].gameType == 'book') {
                    // console.log(response.result[1])
                    _.forEach(response.result[1], (value, item) => {
                      value = +value;

                      if (value < 0) {
                        $('#bmExp_' + item)
                          .text('' + value.toFixed(2) + '')
                          .addClass('minusval');
                      } else {
                        $('#bmExp_' + item)
                          .text('' + value.toFixed(2) + '')
                          .addClass('plusval');
                        $('#fancyBetBookBtn_' + item).css('display', 'block');
                      }
                      // }
                    });

                  }
                  else {
                    this.getBMExposureBook(betData1.marketId);
                  }
                }
                else {
                  this.ExposureBook(betData1.marketId);
                  this.getBMExposureBook(betData1.marketId);
                }
                if (response.result[2]) {
                  this.matchedData = Array.from(
                    response.result[2].filter((bet) => bet.eventId == this.matchid && bet.unmatched == 0)
                  );
                  // console.log(response.result)
                } else {
                  this.userService.getBets();
                }
                if (response.result[3]) {
                  this.userService.setBalance(response.result[3][0]);
                } else {
                  this.userService.getBalance();

                }
                // this.userService.getBalance();
                // this.userService.getBets();
                // this.ExposureBook(betData1.marketId);
                // this.getBMExposureBook(betData1.marketId);
              }, 500);
              $('#placebet_btn').removeClass('disable');
              $('#placebet_btn').prop('disabled', false);
              $('.matchOddTable .select').removeClass('select');
              this.removeAllBetSlip();
              // this.getMultiExposureBook()
              this.placedButton = false;
              this.disablePlaceBet = false;
              this.placeMarketData = null;
            }
          } else {
            this.removeAllBetSlip();
            $('#loading_place_bet').css('display', 'none');
            $(`#inline-pendding${this.placeMarketData?.selectionId}`).css(
              'display',
              'none'
            );
            $(`#inline-pendding1${this.placeMarketData?.selectionId}`).css(
              'display',
              'none'
            );
            $('#placebet_btn').removeClass('disable');
            $('#placebet_btn').prop('disabled', false);
            $('.matchOddTable .select').removeClass('select');

            this.toastr.error(response.errorDescription);
            this.cancelBetslip()

            this.placedButton = false;
            this.disablePlaceBet = false;
            this.placeMarketData = null;
          }

        },
        function myError(error) {
          $('#placebet_btn').removeClass('disable');
          if (error.status == 401) {
            // $.removeCookie("authtoken");
            // window.location.href="index.html"
          }
        }
      );
    }

  }
  requestResultPlaceBetMobile(data, betData1) {

    //// console.log(data)
    this.betsService.requestResult(data.reqId).subscribe(
      (response: GenericResponse<any>) => {

        if (response.errorCode == 0) {
          if (response.result[0]?.result == "pending") {
            setTimeout(() => {
              this.requestResultPlaceBetMobile(data, betData1);
            }, 500)
          } else {
            // this.$emit("callExp", {})

            // if($location.path()=== "/multi-market"){
            //     this.$emit("callMultiMarketExp", {})
            // }

            this.toastr.success(response.errorDescription);
            $('#loading_place_bet').css('display', 'none');
            $(`#inline-pendding${this.placeMarketData?.selectionId}`).css(
              'display',
              'none'
            );
            $(`#inline-pendding1${this.placeMarketData?.selectionId}`).css(
              'display',
              'none'
            );
            // $("#betslip_open").addClass("close");
            setTimeout(() => {
              if (response.result[1]) {
                let marketBook = [];
                marketBook.push(response.result[1]);
                if (response.result[0].gameType == 'exchange') {
                  this.BookDataList = response.result[1];
                  this.BookDataList1[response.result[0].marketId] = marketBook;

                  console.log(this.BookDataList1, "BookDataList")

                  if (this.BookDataList) {
                    _.forEach(Object.keys(this.BookDataList), (item, index) => {
                      var mktexposure = +this.BookDataList[item];
                      let id = '#exposure_' + response.result[0].marketId.replace('.', '_') + '_' + item;
                      if (mktexposure > 0) {
                        $(id).removeClass('minusval');
                        $(id).text(mktexposure.toFixed(2)).addClass('proft');
                      } else {
                        $(id).removeClass('profit');
                        $(id)
                          .text(mktexposure === 0 ? '0' : mktexposure.toFixed(2))
                          .addClass('minusval');
                      }
                    });
                    localStorage.setItem(
                      'Exposure_' + response,
                      JSON.stringify(response.result[1])
                    );
                  }
                }
                else {
                  this.ExposureBook(betData1.marketId);
                }
                if (response.result[0].gameType == 'book') {

                  this.BMbookdata[response.result[0].marketId.replace('bm2_', 'bm_')] = marketBook;
                  console.log(this.BMbookdata, " this.BMbookdata");
                  _.forEach(response.result[1], (value, item) => {
                    value = +value;

                    if (value < 0) {
                      $('#bmExp_' + item)
                        .text('' + value.toFixed(2) + '')
                        .addClass('minusval');
                    } else {
                      $('#bmExp_' + item)
                        .text('' + value.toFixed(2) + '')
                        .addClass('plusval');
                      $('#fancyBetBookBtn_' + item).css('display', 'block');
                    }
                    // }
                  });

                }
                else {
                  this.getBMExposureBook(betData1.marketId);
                }
              }
              else {
                this.ExposureBook(betData1.marketId);
                this.getBMExposureBook(betData1.marketId);
              }
              if (response.result[2]) {
                this.matchedData = Array.from(
                  response.result[2].filter((bet) => bet.eventId == this.matchid && bet.unmatched == 0)
                );
                // console.log(response.result)
              } else {
                this.userService.getBets();
              }
              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();

              }
              // this.userService.getBalance();
              // this.userService.getBets();
              // this.ExposureBook(betData1.marketId);
              // this.getBMExposureBook(betData1.marketId);
            }, 500);
            $('#placebet_btn').removeClass('disable');
            $('#placebet_btn').prop('disabled', false);
            $('.matchOddTable .select').removeClass('select');
            this.removeAllBetSlip();
            // this.getMultiExposureBook()
            this.cancelBetslip()

            this.placedButton = false;
            this.disablePlaceBet = false;
            this.placeMarketData = null;
          }
        } else {
          this.removeAllBetSlip();
          $('#loading_place_bet').css('display', 'none');
          $(`#inline-pendding${this.placeMarketData?.selectionId}`).css(
            'display',
            'none'
          );
          $(`#inline-pendding1${this.placeMarketData?.selectionId}`).css(
            'display',
            'none'
          );
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          $('.matchOddTable .select').removeClass('select');
          this.toastr.error(response.errorDescription);
          this.cancelBetslip()
          this.placedButton = false;
          this.disablePlaceBet = false;
          this.placeMarketData = null;
        }
      },
      function myError(error) {
        $('#placebet_btn').removeClass('disable');
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
      }
    );

  }

  placeBetFancy(betData, index) {
    if (!this.authService.getLoggedIn()) {
      // Relogin()
      this.toastr.info('Token was expired. Please login to continue.');
      return false;
    }
    // $('.loading').css('display','block');
    // betData["source"] = 'web';
    // betData["info"] = 'os:' + jscd.os + ', os_version:' + jscd.osVersion + ', browser:' + jscd.browser + ', browser_version:' + jscd.browserMajorVersion;

    let betData1 = {
      marketId: betData.marketId,
      selId: betData.selectionId,
      odds: betData.odds,
      stake: +betData.stake,
      betType: betData.backlay,
      gameType: 'fancy',
    };
    //// console.log(betData1);
    this.betsService.placeBet(betData1).subscribe(
      function mySuccess(response: GenericResponse<any>) {
        if (response.errorCode == 0) {
          if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
            let getResp = response.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResultPlaceBetFunc(getResp, betData1, betData, index);
            }, (getResp.delay * 1000) + 500);
          } else {
            this.$emit('callFancyExp', {});

            if (betData.yesno == 'yes') {
              //// console.log(betData)
              var i =
                this.backBetSlipDataArray[index].yesBetSlipData.indexOf(betData);
              var slipIndex = this.yesBetSlipList.indexOf(
                betData.runnerName + i + 'yes'
              );
              if (i != -1) {
                this.backBetSlipDataArray[index].yesBetSlipData.splice(i, 1);
                this.yesBetSlipList.splice(slipIndex, 1);
              }
              if (
                this.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
                this.backBetSlipDataArray[index].backBookBetSlipData.length ==
                0 &&
                this.backBetSlipDataArray[index].yesBetSlipData.length == 0
              ) {
                this.backBetSlipDataArray.splice(index, 1);
              }
            } else {
              var i =
                this.layBetSlipDataArray[index].noBetSlipData.indexOf(betData);
              var slipIndex = this.noBetSlipList.indexOf(
                betData.runnerName + i + 'no'
              );

              if (i != -1) {
                this.layBetSlipDataArray[index].noBetSlipData.splice(i, 1);
                this.noBetSlipList.splice(slipIndex, 1);
              }
              if (
                this.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
                this.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
                this.layBetSlipDataArray[index].noBetSlipData.length == 0
              ) {
                this.layBetSlipDataArray.splice(index, 1);
              }
            }
            this.toastr.success(response.errorDescription);
            $('#loading_place_bet').css('display', 'none');
            if (response.result[1]) {
              // console.log("click")
            }
            this.userService.getBalance();
            this.userService.getBets();
            // $("#betslip_open").addClass("close");
            this.placedButton = false;
          }

        } else {
          $('#loading_place_bet').css('display', 'none');

          this.toastr.error(response.errorDescription);
          this.cancelBetslip()
          this.placedButton = false;

        }
      },
      function myError(error) {
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
      }
    );
  }

  requestResultlPlaceBetFancy(data, betData1, betData, index) {

    //// console.log(data)
    this.betsService.requestResult(data.reqId).subscribe(
      function mySuccess(response: GenericResponse<any>) {
        if (response.errorCode == 0) {
          if (response.result[0]?.result == "pending") {

            setTimeout(() => {
              this.requestResultPlaceBetFunc(data, betData1, betData, index);
            }, 500)
          } else {
            this.$emit('callFancyExp', {});

            if (betData.yesno == 'yes') {
              //// console.log(betData)
              var i =
                this.backBetSlipDataArray[index].yesBetSlipData.indexOf(betData);
              var slipIndex = this.yesBetSlipList.indexOf(
                betData.runnerName + i + 'yes'
              );
              if (i != -1) {
                this.backBetSlipDataArray[index].yesBetSlipData.splice(i, 1);
                this.yesBetSlipList.splice(slipIndex, 1);
              }
              if (
                this.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
                this.backBetSlipDataArray[index].backBookBetSlipData.length ==
                0 &&
                this.backBetSlipDataArray[index].yesBetSlipData.length == 0
              ) {
                this.backBetSlipDataArray.splice(index, 1);
              }
            } else {
              var i =
                this.layBetSlipDataArray[index].noBetSlipData.indexOf(betData);
              var slipIndex = this.noBetSlipList.indexOf(
                betData.runnerName + i + 'no'
              );

              if (i != -1) {
                this.layBetSlipDataArray[index].noBetSlipData.splice(i, 1);
                this.noBetSlipList.splice(slipIndex, 1);
              }
              if (
                this.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
                this.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
                this.layBetSlipDataArray[index].noBetSlipData.length == 0
              ) {
                this.layBetSlipDataArray.splice(index, 1);
              }
            }
            this.toastr.success(response.errorDescription);
            $('#loading_place_bet').css('display', 'none');
            if (response.result[1]) {
              // console.log("click")
            }
            this.userService.getBalance();
            this.userService.getBets();
            // $("#betslip_open").addClass("close");
            this.placedButton = false;
          }

        } else {
          $('#loading_place_bet').css('display', 'none');

          this.toastr.error(response.errorDescription);
          this.cancelBetslip()

          this.placedButton = false;

        }
      },
      function myError(error) {
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
      }
    );

  }

  placeBookBetFunc(betData, index) {
    // $('.loading').css('display','block');
    // betData["source"] = 'web';

    // betData["info"] = 'os:' + jscd.os + ', os_version:' + jscd.osVersion + ', browser:' + jscd.browser + ', browser_version:' + jscd.browserMajorVersion;
    if (betData.backlay == 'backBook') {
      var i =
        this.backBetSlipDataArray[index].backBookBetSlipData.indexOf(betData);
      var slipIndex = this.backBookBetSlipList.indexOf(
        betData.runnerName + i + 'backBook'
      );
      if (i != -1) {
        this.backBetSlipDataArray[index].backBookBetSlipData.splice(i, 1);
        this.backBookBetSlipList.splice(slipIndex, 1);
      }
      if (
        this.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
        this.backBetSlipDataArray[index].backBookBetSlipData.length == 0 &&
        this.backBetSlipDataArray[index].yesBetSlipData.length == 0
      ) {
        this.backBetSlipDataArray.splice(index, 1);
      }
    } else {
      var i =
        this.layBetSlipDataArray[index].layBookBetSlipData.indexOf(betData);
      var slipIndex = this.layBookBetSlipList.indexOf(
        betData.runnerName + i + 'layBook'
      );
      if (i != -1) {
        this.layBetSlipDataArray[index].layBookBetSlipData.splice(i, 1);
        this.layBookBetSlipList.splice(slipIndex, 1);
      }
      if (
        this.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
        this.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
        this.layBetSlipDataArray[index].noBetSlipData.length == 0
      ) {
        this.layBetSlipDataArray.splice(index, 1);
      }
    }

    let betData1 = {
      marketId: betData.marketId,
      selId: betData.selectionId,
      odds: betData.odds,
      stake: +betData.stake,
      betType: betData.backlay == 'backBook' ? 'back' : 'lay',
      gameType: 'book',
    };
    //// console.log(betData1);

    //// console.log(betData)
    $('#placebet_btn').removeClass('disable');
    $('#placebet_btn').addClass('disable');
    $('#placebet_btn').prop('disabled', true);
    this.betsService
      .placeBet(betData1)
      .subscribe((response: GenericResponse<any>) => {
        if (response.errorCode == 0) {
          if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
            let getResp = response.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResultlPlaceBookBetFunc(getResp, betData1, betData, index);
            }, (getResp.delay * 1000) + 500);
          } else {
            // this.$emit("callBMExp", {})
            if (betData.backlay == 'back') {
              betData.backlay = 'backBook';
            } else {
              betData.backlay = 'layBook';
            }

            this.toastr.success(response.errorDescription);
            $('#loading_place_bet').css('display', 'none');
            $('#placebet_btn').prop('disabled', false);
            $('#placebet_btn').removeClass('disable');
            setTimeout(() => {
              if (response.result[1]) {
                // console.log("click")

                // console.log(response.result[1])
                _.forEach(response.result[1], (value, item) => {
                  value = +value;
                  // $('#fancyBetBookBtn_' + fancy.sid).css('display', 'block');
                  // if (value[0][1] == 0) {
                  //   value[0][1] = 0;
                  // } else {
                  // $('#fancyBetBookBtn_' + fancy.sid).css('display', 'block');
                  if (value < 0) {
                    $('#bmExp_' + item)
                      .text('' + value.toFixed(2) + '')
                      .addClass('minusval');
                  } else {
                    $('#bmExp_' + item)
                      .text('' + value.toFixed(2) + '')
                      .addClass('plusval');
                    $('#fancyBetBookBtn_' + item).css('display', 'block');
                  }
                  // }
                });


              }
              else {
                this.getBMExposureBook(betData.marketId);
              }
              if (response.result[2]) {
                this.matchedData = Array.from(
                  response.result[2].filter((bet) => bet.eventId == this.matchid && bet.unmatched == 0)
                );
                // console.log(response.result)
              } else {
                this.userService.getBets();
              }
              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();

              }
              // this.userService.getBalance();
              // this.userService.getBets();
              // this.getBMExposureBook(betData.marketId);
            }, 500);
            // $("#betslip_open").addClass("close");
            this.placedButton = false;
          }

        } else {
          $('#loading_place_bet').css('display', 'none');
          $('#placebet_btn').prop('disabled', false);
          $('#placebet_btn').removeClass('disable');
          this.toastr.error(response.errorDescription);
          this.cancelBetslip()

          this.placedButton = false;

        }
      }, err => {
        $('#loading_place_bet').css('display', 'none');
        $('#placebet_btn').prop('disabled', false);
        $('#placebet_btn').removeClass('disable');
        this.placedButton = false;
      });
  }

  requestResultlPlaceBookBetFunc(data, betData1, betData, index) {

    //// console.log(data)
    this.betsService.requestResult(data.reqId).subscribe((response: GenericResponse<any>) => {

      if (response.errorCode == 0) {
        if (response.result[0]?.result == "pending") {

          setTimeout(() => {
            this.requestResultlPlaceBookBetFunc(data, betData1, betData, index);
          }, 500)
        } else {
          // this.$emit("callBMExp", {})
          if (betData.backlay == 'back') {
            betData.backlay = 'backBook';
          } else {
            betData.backlay = 'layBook';
          }

          this.toastr.success(response.errorDescription);
          $('#loading_place_bet').css('display', 'none');
          $('#placebet_btn').prop('disabled', false);
          $('#placebet_btn').removeClass('disable');
          setTimeout(() => {
            if (response.result[1]) {
              // console.log("click")

              // console.log(response.result[1])
              _.forEach(response.result[1], (value, item) => {
                value = +value;
                // $('#fancyBetBookBtn_' + fancy.sid).css('display', 'block');
                // if (value[0][1] == 0) {
                //   value[0][1] = 0;
                // } else {
                // $('#fancyBetBookBtn_' + fancy.sid).css('display', 'block');
                if (value < 0) {
                  $('#bmExp_' + item)
                    .text('' + value.toFixed(2) + '')
                    .addClass('minusval');
                } else {
                  $('#bmExp_' + item)
                    .text('' + value.toFixed(2) + '')
                    .addClass('plusval');
                  $('#fancyBetBookBtn_' + item).css('display', 'block');
                }
                // }
              });


            }
            else {
              this.getBMExposureBook(betData.marketId);
            }
            if (response.result[2]) {
              this.matchedData = Array.from(
                response.result[2].filter((bet) => bet.eventId == this.matchid && bet.unmatched == 0)
              );
              // console.log(response.result)
            } else {
              this.userService.getBets();
            }
            if (response.result[3]) {
              this.userService.setBalance(response.result[3][0]);
            } else {
              this.userService.getBalance();
            }
            // this.userService.getBalance();
            // this.userService.getBets();
            // this.getBMExposureBook(betData.marketId);
          }, 500);
          // $("#betslip_open").addClass("close");
          this.placedButton = false;
        }

      } else {
        $('#loading_place_bet').css('display', 'none');
        $('#placebet_btn').prop('disabled', false);
        $('#placebet_btn').removeClass('disable');
        this.toastr.error(response.errorDescription);
        this.cancelBetslip()

        this.placedButton = false;

      }
    }, err => {
      $('#loading_place_bet').css('display', 'none');
      $('#placebet_btn').prop('disabled', false);
      $('#placebet_btn').removeClass('disable');
      this.placedButton = false;
    });

  }

  closeBetSlip(index, type, parentIndex) {
    //// console.log(index, type)
    if (type == 'back') {
      this.backBetSlipList.splice(index, 1);
      this.backBetSlipDataArray[parentIndex].backBetSlipData.splice(index, 1);
      if (this.ExpoMktid != undefined) {
        this.bets.stake = 0;
        this.bets.profit = 0;
      }
      this.calcExposure(this.ExpoMktid, this.bets, 'remove');

    } else if (type == 'lay') {
      this.layBetSlipList.splice(index, 1);
      this.layBetSlipDataArray[parentIndex].layBetSlipData.splice(index, 1);
      if (this.ExpoMktid != undefined) {
        this.bets.stake = 0;
        this.bets.profit = 0;
      }
      this.calcExposure(this.ExpoMktid, this.bets, 'remove');


    }
    if (type == 'backBook') {
      this.backBookBetSlipList.splice(index, 1);
      this.backBetSlipDataArray[parentIndex].backBookBetSlipData.splice(
        index,
        1
      );
    } else if (type == 'layBook') {
      this.layBookBetSlipList.splice(index, 1);
      this.layBetSlipDataArray[parentIndex].layBookBetSlipData.splice(index, 1);
    }

    if (type == 'yes') {
      this.yesBetSlipList.splice(index, 1);
      this.backBetSlipDataArray[parentIndex].yesBetSlipData.splice(index, 1);
    } else if (type == 'no') {
      this.noBetSlipList.splice(index, 1);
      this.layBetSlipDataArray[parentIndex].noBetSlipData.splice(index, 1);
    }

    if (type == 'back' || type == 'yes' || type == 'backBook') {
      if (
        this.backBetSlipDataArray[parentIndex].backBetSlipData.length == 0 &&
        this.backBetSlipDataArray[parentIndex].yesBetSlipData.length == 0 &&
        this.backBetSlipDataArray[parentIndex].backBookBetSlipData.length == 0
      ) {
        //// console.log(this.backBetSlipDataArray.length)
        this.backBetSlipDataArray.splice(parentIndex, 1);
      }
    } else if (type == 'Teenback') {
      this.backTeenSlipDataArray.splice(index, 1);
      this.cards = [];
      this.placeTPData = null;
    } else {
      if (
        this.layBetSlipDataArray[parentIndex].layBetSlipData.length == 0 &&
        this.layBetSlipDataArray[parentIndex].noBetSlipData.length == 0 &&
        this.layBetSlipDataArray[parentIndex].layBookBetSlipData.length == 0
      ) {
        //// console.log(this.backBetSlipDataArray.length)
        this.layBetSlipDataArray.splice(parentIndex, 1);
      }
    }
    this.calculateLiability();

  }

  removefancybetslip(betslipid, betstype) {
    if (betstype == 'no') {
      $('#fancyBetBoard_' + betslipid + '_lay').css('display', 'none');
      $('#fancyBetMarketList .lay-1').removeClass('select');
    } else {
      $('#fancyBetMarketList .back-1').removeClass('select');
      $('#fancyBetBoard_' + betslipid + '_back').css('display', 'none');
    }
    if (betstype == '') {
      $('#fancyBetMessage_' + betslipid).css('display', 'none');
      // $("#fancyBetMarketList .back-1").removeClass("select");
      //    $("#fancyBetBoard_"+betslipid+"_back").css("display","none");
      //    $("#fancyBetMarketList .lay-1").removeClass("select");
      //    $("#fancyBetBoard_"+betslipid+"_lay").css("display","none");
    }
  }

  cancelBetslip(remove?: string, betData?: any) {
    // console.log(betData, "cancelBetslip");

    $('.back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3').removeClass('select');
    if (this.placeMarketData != null) {
      this.calcExposure(
        this.placeMarketData.marketId,
        this.placeMarketData,
        'remove'
      );


    }

    if (remove == undefined) {
      if (this.ExpoMktid != undefined) {
        this.bets.stake = 0;
        this.bets.profit = 0;
      }
      this.calcProfit(this.bets)

    }
    if (betData) {
      betData.odds = 0;
      betData.stake = 0;
      betData.profit = 0;
      betData.loss = 0;
      betData['remove'] = true;
      this.calcProfit(betData)
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

  ExposureBook(mktid) {
    // this.BookDataList=[]
    if (this.marketId == undefined) {
      this.mktid = mktid;
    } else {
      this.mktid = this.bfId;
    }

    this.userService.listBooks(mktid).subscribe(
      (response: GenericResponse<any>) => {
        if (response.errorCode === 0) {
          //// console.log(response);
          this.BookDataList = response.result[0];
          this.BookDataList1[mktid] = response.result;

          //// console.log(this.BookDataList, "BookDataList")
          // localStorage.setItem('exposureData',JSON.stringify(this.BookDataList))
          if (this.BookDataList) {
            _.forEach(Object.keys(this.BookDataList), (item, index) => {
              var mktexposure = +this.BookDataList[item];
              let id = '#exposure_' + mktid.replace('.', '_') + '_' + item;
              if (mktexposure > 0) {
                $(id).removeClass('minusval');
                $(id).text(mktexposure.toFixed(2)).addClass('proft');
              } else {
                $(id).removeClass('profit');
                $(id)
                  .text(mktexposure === 0 ? '0' : mktexposure.toFixed(2))
                  .addClass('minusval');
              }
            });
            localStorage.setItem(
              'Exposure_' + mktid,
              JSON.stringify(response.result[0])
            );
          }
        }
        //this.Value1=this.Value[0];
      },
      function myError(error) {
        if (error.status == 401) {
          // $.removeCookie("authtoken");
          // window.location.href="index.html"
        }
      }
    );
  }

  selectStake(stake, fancyId, selectiontype) {
    if (selectiontype == 'no') {
      this.inputStakeNO = stake;
      $('#inputStake_NO_' + fancyId).val(stake);
      $('#placeBet_NO_' + fancyId + '').removeClass('disable');
    } else {
      this.inputStakeYES = stake;
      $('#inputStake_YES_' + fancyId).val(stake);
      $('#placeBet_YES_' + fancyId + '').removeClass('disable');
    }
  }

  oddsDiffCalculate(currentOdds) {
    let diff;
    if (currentOdds < 2) {
      diff = 0.01;
    } else if (currentOdds < 3) {
      diff = 0.02;
    } else if (currentOdds < 4) {
      diff = 0.05;
    } else if (currentOdds < 6) {
      diff = 0.1;
    } else if (currentOdds < 10) {
      diff = 0.2;
    } else if (currentOdds < 20) {
      diff = 0.5;
    } else if (currentOdds < 30) {
      diff = 1.0;
    } else {
      diff = 2.0;
    }
    return diff;
  }

  cmDown(bet) {
    if (+bet.odds <= 1.01) {
      bet.odds = 1.01;
    }

    let currentOdds = parseFloat(bet.odds);

    let diff = this.oddsDiffCalculate(currentOdds);

    let newOdds: any = currentOdds - diff;
    newOdds = newOdds.toFixed(2);

    if (bet.backlay == 'back') {
      bet.odds = newOdds;

      var stake = bet.stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) - 1) * parseFloat(stake);
      // if (isNaN(pnl)) {
      //  pnl='0.00';
      // }
      bet.profit = pnl.toFixed(2);

      //// console.log(this.backBetSlipDataArray)
    } else if (bet.backlay == 'lay') {
      bet.odds = newOdds;

      var stake = bet.stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) - 1) * parseFloat(stake);
      // if (isNaN(pnl)) {
      //  pnl='0.00';
      // }
      bet.profit = pnl.toFixed(2);

      //// console.log(this.layBetSlipDataArray)
    }
    this.calcExposure(this.ExpoMktid, this.bets);
    this.calcProfit(bet)




  }

  cmUp(bet) {
    let currentOdds = parseFloat(bet.odds);

    let diff = this.oddsDiffCalculate(currentOdds);

    let newOdds = currentOdds + diff;
    newOdds = newOdds.toFixed(2);

    if (bet.backlay == 'back' || bet.backlay == 'BACK') {
      bet.odds = newOdds;

      var stake = bet.stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) - 1) * parseFloat(stake);
      // if (isNaN(pnl)) {
      //  pnl='0.00';
      // }
      bet.profit = pnl.toFixed(2);

      //// console.log(backBetSlipDataArray)
    } else if (bet.backlay == 'lay' || bet.backlay == 'LAY') {
      bet.odds = newOdds;

      var stake = bet.stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) - 1) * parseFloat(stake);
      bet.profit = pnl.toFixed(2);

      //// console.log(layBetSlipDataArray)
    } else if (bet.backlay == 'backBook') {
      bet.odds = newOdds;

      var stake = bet.stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) * parseFloat(stake)) / 100;
      // if (isNaN(pnl)) {
      //  pnl='0.00';
      // }
      bet.profit = pnl.toFixed(2);
    } else if (bet.backlay == 'layBook') {
      bet.odds = newOdds;

      var stake = bet.stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) * parseFloat(stake)) / 100;
      // if (isNaN(pnl)) {
      //  pnl='0.00';
      // }
      bet.profit = pnl.toFixed(2);
    }
    this.calcExposure(this.ExpoMktid, this.bets);
    this.calcProfit(bet)



  }

  cUp(bet, index, parentIndex) {
    let currentOdds = parseFloat(bet.odds);

    let diff = this.oddsDiffCalculate(currentOdds);

    let newOdds = currentOdds + diff;
    newOdds = newOdds.toFixed(2);

    if (bet.backlay == 'back' || bet.backlay == 'BACK') {
      this.backBetSlipDataArray[parentIndex].backBetSlipData[index].odds =
        newOdds;

      var stake =
        this.backBetSlipDataArray[parentIndex].backBetSlipData[index].stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) - 1) * parseFloat(stake);
      // if (isNaN(pnl)) {
      //  pnl='0.00';
      // }
      this.backBetSlipDataArray[parentIndex].backBetSlipData[index].profit =
        pnl.toFixed(2);

      //// console.log(backBetSlipDataArray)
    } else if (bet.backlay == 'lay' || bet.backlay == 'LAY') {
      this.layBetSlipDataArray[parentIndex].layBetSlipData[index].odds =
        newOdds;

      var stake =
        this.layBetSlipDataArray[parentIndex].layBetSlipData[index].stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) - 1) * parseFloat(stake);
      this.layBetSlipDataArray[parentIndex].layBetSlipData[index].profit =
        pnl.toFixed(2);

      //// console.log(layBetSlipDataArray)
    }
    this.calcExposure(this.ExpoMktid, this.bets);
    this.calcProfit(bet)





  }

  activeSportsBook(isSportBook) {
    this.isSportBook = isSportBook;
  }


  cDown(bet, index, parentIndex) {
    // var currentOdds=parseFloat($(this).val())
    //// console.log(val)
    //// console.log(backlay)
    //// console.log(index)
    //// console.log(parentIndex)

    if (+bet.odds <= 1.01) {
      bet.odds = 1.01;
    }

    let currentOdds = parseFloat(bet.odds);

    let diff = this.oddsDiffCalculate(currentOdds);

    let newOdds: any = currentOdds - diff;
    newOdds = newOdds.toFixed(2);

    if (bet.backlay == 'back') {
      this.backBetSlipDataArray[parentIndex].backBetSlipData[index].odds =
        newOdds;

      var stake =
        this.backBetSlipDataArray[parentIndex].backBetSlipData[index].stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) - 1) * parseFloat(stake);
      // if (isNaN(pnl)) {
      //  pnl='0.00';
      // }
      this.backBetSlipDataArray[parentIndex].backBetSlipData[index].profit =
        pnl.toFixed(2);

      //// console.log(this.backBetSlipDataArray)
    } else if (bet.backlay == 'lay') {
      this.layBetSlipDataArray[parentIndex].layBetSlipData[index].odds =
        newOdds;

      var stake =
        this.layBetSlipDataArray[parentIndex].layBetSlipData[index].stake;
      if (stake == '') {
        stake = 0;
      }
      var pnl = (parseFloat(newOdds) - 1) * parseFloat(stake);
      // if (isNaN(pnl)) {
      //  pnl='0.00';
      // }
      this.layBetSlipDataArray[parentIndex].layBetSlipData[index].profit =
        pnl.toFixed(2);

      //// console.log(this.layBetSlipDataArray)
    }
    this.calcExposure(this.ExpoMktid, this.bets);
    this.calcProfit(bet)

  }

  GetFancyBook(template: TemplateRef<any>, marketName, marketId, fancyId) {
    this.selectedFancyName = marketName;
    this.fancyDatabookList = [];
    this.fullmarketService
      .getFancyBook(marketId, fancyId, marketName)
      .subscribe((books: GenericResponse<any>) => {
        //// console.log(books);
        let matrix = (<string>Object.values(books.result[0])[0])
          .replace(/\{|\}/g, '')
          .split(',')
          .map((f) => {
            return f.split(':').map((b: any) => (b = +b));
          });
        for (let i = 0; i < matrix.length; i++) {
          let run = matrix[i][0];
          let row = [];
          if (i === 0) {
            row[0] = run + ' and below';
          } else if (i === matrix.length - 1) {
            row[0] = matrix[i - 1][0] + 1 + ' and above';
          } else if (matrix[i - 1][0] + 1 === matrix[i][0]) {
            row[0] = matrix[i][0];
          } else {
            row[0] = matrix[i - 1][0] + 1 + '-' + matrix[i][0];
          }
          row[1] = matrix[i][1];
          this.fancyDatabookList.push(row);
        }
      });
    this.modalRef = this.modalService.show(template);
  }

  getScoreId() {
    this.fullmarketService.GetScoreId(this.matchid).subscribe((resp: any) => {
      this.score_id = resp.result[0]?.score_id;
      // console.log(this.score_id);

      if (this.score_id) {
        this.GetIframeScoreUrl();
        this.scoreHeight;
      } else {
        this.scoreHeight = 0;


      }
    })
  }

  getScore() {
    if (this.matchid != undefined) {
      this.fullmarketService.getScore(this.matchid).subscribe((res: any) => {
        console.log(res);

        if (res) {
          if (this.sportId == 1) {
            this.fullScore = res;

          } else if (this.sportId == 2) {
            this.fullScore = res;
          } else if (this.sportId == 4) {
            if ('currentDay' in res) {
              this.fullScore = res;
              this.fullScore.cricketScore2 = true;
              console.log(this.fullScore, "this.fullScore");

            } else {
              this.fullScore = res.score;
              // this.fullScore.cricketScore2 = false;
            }
            // this.matcheventId = res.eventId;
          }
        }
      });
    }
  }

  GetIframeScoreUrl() {
    // if (this.sportId == 4) {
    //   this.scoreUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //     `https://access.streamingtv.fun/cricket_score/?scoreId=` + this.score_id + '&matchDate=' + this.marketdata.startDate
    //   );
    //   this.scoreHeight = 281;


    // }
    // if (this.sportId == 1) {
    //   this.scoreUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //     `https://access.streamingtv.fun/soccer_score/?scoreId=` + this.score_id + '&matchDate=' + this.marketdata.startDate
    //   );
    //   this.scoreHeight = 60;


    // }
    // if (this.sportId == 2) {
    //   this.scoreUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //     `https://access.streamingtv.fun/tennis_score/?scoreId=` + this.score_id + '&matchDate=' + this.marketdata.startDate
    //   );
    //   this.scoreHeight = 160;

    // }


    this.scoreUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.satsports.net/score_widget/index.html?id=` + this.score_id + '&aC=bGFzZXJib29rMjQ3'
    );
    this.scoreHeight = 180;

    console.log(this.scoreUrl);

    this.fullScore.cricketScore2 = false;


  }

  listBet() {
    this.userService.getBets();
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
  }

  getAvgOdds(event) {
    if (event) {
      let countMap = {};
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


  marketsNewExposure(bet) {
    this.currentMatchData.forEach((market, mktIndex) => {
      // console.log(this.currentMatchData);
      if (bet) {
        this.newMktExposure = _.cloneDeep((this.BookDataList1[market.marketId]));
        if (!this.newMktExposure) {
          this.newMktExposure = [];
        }
        if (bet.stake != null && market.marketId == bet.marketId && bet.gameType == 'exchange') {
          let selectionPnl = {};
          if (this.newMktExposure.length == 0) {
            _.forEach(market.runners, (runner) => {
              selectionPnl[runner.selectionId] = 0;
            })
            this.newMktExposure.push(selectionPnl);
          }
          _.forEach(this.newMktExposure[0], (value, selId) => {
            if (bet.backlay == "back" && bet.selectionId == selId) {
              if (bet.profit != null) {
                value = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                this.newMktExposure[0][selId] = value;
              }
            }
            if (bet.backlay == "back" && bet.selectionId != selId) {
              value = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
              this.newMktExposure[0][selId] = value;
            }
            if (bet.backlay == "lay" && bet.selectionId == selId) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                value = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
                this.newMktExposure[0][selId] = value;
              }
            }
            if (bet.backlay == "lay" && bet.selectionId != selId) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                value = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                this.newMktExposure[0][selId] = value;
              }
            }
          })
          market['newpnl'] = this.newMktExposure;
          if (this.newMktExposure) {
            _.forEach(Object.keys(this.newMktExposure[0]), (item, index) => {
              var mktexposure = +this.newMktExposure[0][item];
              let id = '#exposure_' + market.marketId.replace('.', '_') + '_' + item;
              if (mktexposure > 0) {
                $(id).removeClass('minusval');
                $(id).text(mktexposure.toFixed(2)).addClass('proft');
              } else {
                $(id).removeClass('profit');
                $(id)
                  .text(mktexposure === 0 ? '0' : mktexposure.toFixed(2))
                  .addClass('minusval');
              }
            });
            localStorage.setItem(
              'Exposure_' + market.marketId,
              JSON.stringify(this.newMktExposure)
            );
          }
          //// console.log(this.newMktExposure);
        }
      }
      else {
        market['newpnl'] = null;

        if (market.marketId == bet.marketId) {
          let newMktExposure = [];
          if (newMktExposure) {
            _.forEach(Object.keys(newMktExposure[0]), (item, index) => {
              var mktexposure = +newMktExposure[0][item];
              let id = '#exposure_' + market.marketId.replace('.', '_') + '_' + item;
              if (mktexposure > 0) {
                $(id).removeClass('minusval');
                $(id).text(mktexposure.toFixed(2)).addClass('proft');
              } else {
                $(id).removeClass('profit');
                $(id)
                  .text(mktexposure === 0 ? '0' : mktexposure.toFixed(2))
                  .addClass('minusval');
              }
            });
            localStorage.setItem(
              'Exposure_' + market.marketId,
              JSON.stringify(newMktExposure)
            );
          }
        }



      }

    })
  }

  marketsnewbookExposure(bet) {
    this.bookmakingData[0]?.forEach((market, mktIndex) => {
      // console.log(this.bookmakingData);
      if (bet) {
        this.newbookExposure = _.cloneDeep((this.BMbookdata[bet.marketId]));
        if (!this.newbookExposure) {
          this.newbookExposure = [];
        }
        let bookId = bet.marketId.replace('bm_', '')
        if (bet.stake != null && market.mid == bookId && bet.gameType == 'bookmaker') {
          let selectionPnl = {};
          if (this.newbookExposure.length == 0) {
            selectionPnl[market.sid] = 0;
            this.newbookExposure.push(selectionPnl);
          }
          _.forEach(this.newbookExposure[0], (value, selId) => {
            if (bet.backlay == "backBook" && bet.selectionId == selId) {
              if (bet.profit != null) {
                value = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                this.newbookExposure[0][selId] = value;
              }
            }
            if (bet.backlay == "backBook" && bet.selectionId != selId) {
              value = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
              this.newbookExposure[0][selId] = value;
            }
            if (bet.backlay == "layBook" && bet.selectionId == selId) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                value = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
                this.newbookExposure[0][selId] = value;
              }
            }
            if (bet.backlay == "layBook" && bet.selectionId != selId) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                value = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                this.newbookExposure[0][selId] = value;
              }
            }
          })
          market['newpnl'] = this.newbookExposure;
          if (this.newbookExposure) {
            _.forEach(this.newbookExposure[0], (value, item) => {
              $('#bmExp_' + item).removeClass('minusval');
              $('#bmExp_' + item).removeClass('plusval');
              value = +value;
              if (value == 0) {
                $('#bmExp_' + item)
                  .text('' + value.toFixed(2) + '')
                  .addClass('minusval');
              }
              else if (value < 0) {
                $('#bmExp_' + item)
                  .text('' + value.toFixed(2) + '')
                  .addClass('minusval');
              } else {
                $('#bmExp_' + item)
                  .text('' + value.toFixed(2) + '')
                  .addClass('plusval');
                $('#fancyBetBookBtn_' + item).css('display', 'block');
              }
              if (value == 0) {

              }
              // }
            });
          }
          // console.log(this.newbookExposure);
        }
      }
      else {
        market['newpnl'] = null;
        if (this.newbookExposure) {
          _.forEach(this.newbookExposure[0], (value, item) => {
            $('#bmExp_' + item).removeClass('minusval');
            $('#bmExp_' + item).removeClass('plusval');
            value = +value;
            if (value < 0) {
              $('#bmExp_' + item)
                .text('' + value.toFixed(2) + '')
                .addClass('minusval');
            } else {
              $('#bmExp_' + item)
                .text('' + value.toFixed(2) + '')
                .addClass('plusval');
              $('#fancyBetBookBtn_' + item).css('display', 'block');
            }
            // }
          });
        }




      }

    })
  }



  calcProfit(betData) {
    let betData1 = {
      backlay: betData.backlay,
      selectionId: this.selectionId,
      marketId: betData.marketId,
      matchId: this.mtid,
      odds: betData.odds,
      runnerName: this.runnerName,
      stake: +betData.stake,
      bfId: betData.bfId,
      sportId: this.sportId,
      profit: betData.profit,
      gameType: betData.gameType,
      loss: betData.loss
    };
    this.betSlipData = betData1;
    if (betData1.stake && betData1.odds && betData1.gameType == 'exchange') {
      if (betData1.backlay == "back") {
        betData1.profit = (
          ((parseFloat(betData1.odds) - 1) * betData1.stake).toFixed(2));
        betData1.loss = (betData1.stake);
      } else {
        betData1.loss = (
          ((parseFloat(betData1.odds) - 1) * betData1.stake).toFixed(2));
        betData1.profit = (betData1.stake);
      }
      // console.log(betData1, "betData1")


    }
    if (betData1.stake && betData1.odds && betData1.gameType == 'bookmaker') {
      if (betData1.backlay == "backBook") {
        betData1.profit = (((parseFloat(betData1.odds) * betData1.stake) / 100).toFixed(2));
        betData1.loss = (betData1.stake);
      } else {
        betData1.loss = (((parseFloat(betData1.odds) * betData1.stake) / 100).toFixed(2));
        betData1.profit = (betData1.stake);
      }

    }
    this.marketsNewExposure(betData1)
    this.marketsnewbookExposure(betData1)



  }


  convertToFloat(value) {
    return parseFloat(value).toFixed(2);
  }

  setBetTimeout() {
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
      }, 1000);
    }
  }

  get isRace() {
    return (
      this.sportId == 7 ||
      this.sportId == 4339 ||
      this.sportId == 7.1 ||
      this.sportId == 7.2 ||
      this.sportId == 4339.1 ||
      this.sportId == 4339.2
    );
  }

  get isKabaddi() {
    return (
      this.sportId == 52 ||
      this.sportId == 85
    );
  }

  toggleTv() {
    this.showTv = !this.showTv;
  }

  cancelBet(betId) {
    this.betsService.cancelBet(betId).subscribe((res: GenericResponse<any>) => {
      //// console.log(res);
      this.userService.getBets();
    });
  }

  openRulesModal(modalTemp: TemplateRef<any>) {
    this.rulesModalRef = this.modalService.show(modalTemp);
  }

  openBookmakerRulesModal(bookmakerModalTemp: TemplateRef<any>) {
    this.bookmakerRulesRef = this.modalService.show(bookmakerModalTemp);
  }

  openFancyRulesModal(fancyModalTemp: TemplateRef<any>) {
    this.fancyRulesRef = this.modalService.show(fancyModalTemp);
  }

  trackByIndex(index) {
    return index;
  }

  trackByFn(index, item) {
    return item.sid;
  }

  trackByFnMO(index, item) {
    return item.marketId;
  }

  trackByFnRunner(index, item) {
    return item.selectionId;
  }

  trackByBookSid(index, item) {
    return item.sid;
  }

  trackByCon(trackByCon, item: IOpenBets) {
    return item.consolidateId;
  }

  trackBySportBook(index, item) {
    return item.id;
  }

  ngOnDestroy() {
    if (this.marketDatatimeout) {
      clearTimeout(this.marketDatatimeout);
    }
    this.subSink.unsubscribe();
    this.shareDataService.setUnSubValue(false);
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }
}
