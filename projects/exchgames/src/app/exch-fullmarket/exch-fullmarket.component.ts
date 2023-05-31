import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'jquery';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBetData } from 'src/app/fullmarket/types/bet-data';
import { IBetslipData } from 'src/app/fullmarket/types/betslip-data';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { IOpenBets } from 'src/app/shared/types/open-bets';
import { ExchGamesService } from '../services/exchgames.service';
import { EmptyCards } from './types/empty-cards';
import {
  IExchData,
  IExchGameResult,
  IExchMarket,
  IExchResult,
  IGameDataObject,
} from './types/exch-data';

@Component({
  selector: 'app-exch-fullmarket',
  templateUrl: './exch-fullmarket.component.html',
  styleUrls: ['./exch-fullmarket.component.scss'],
})
export class ExchFullmarketComponent implements OnInit, OnDestroy {
  exchName = '';
  progress = 0;
  stakeList = [
    { id: 1, stake: 500 },
    { id: 2, stake: 1000 },
    { id: 3, stake: 5000 },
    { id: 4, stake: 10000 },
    { id: 5, stake: 20000 },
    { id: 6, stake: 25000 },
    { id: 7, stake: 50000 },
    { id: 8, stake: 100000 },
  ];
  playerStatusMap = {
    IN_PLAY: '',
    STOOD: 'Stand',
    LOSER: 'Loser',
    WINNER: 'Winner',
    HIT: 'Dealing',
  };
  statusMap = {
    SUSPENDED_GAME_SETTLING: 'Game Over Settiling in Progress',
    SUSPENDED_GAME_PLAYING: 'Dealing',
    SUSPENDED_GAME_ROUND_OVER: 'Round Over',
  };
  holdemRoundList = [
    { id: 1, name: 'Deal' },
    { id: 2, name: 'Preflop' },
    { id: 3, name: 'Flop' },
    { id: 4, name: 'Turn' },
    { id: 5, name: 'River' },
  ];
  exchData: IExchData;
  market: IExchMarket;
  market2: IExchMarket;

  gameData: IGameDataObject;
  runnerGameData = {};
  subSink = new Subscription();
  selectedTab: number = 1;
  selectedTabBacc: number = 1;


  placeBetData: IBetslipData;
  isShowBetSlip: boolean = false;
  round: number;

  isShowResults: boolean = false;
  gameId: number;
  marketId: number;
  resultMarketId: number;

  lastFiveResults: IExchResult;
  result: IExchGameResult;
  resultByMarket: IExchGameResult;
  matchedData: IOpenBets[];
  eventId: number;
  listBetsCalled: boolean = false;
  previousRound: number;
  previousMarket: number;
  marketLiability: number = 0;
  exposureCalled: boolean = false;
  cancelCall$ = new Subject();
  constructor(
    private activatedRoute: ActivatedRoute,
    private exchGamesService: ExchGamesService,
    private userService: UserService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    combineLatest(this.activatedRoute.params, this.commonService.apis$, (params, apis) => ({ params, apis }))
      .subscribe(pair => {
        this.isShowResults = false;
        this.subSink.unsubscribe();
        this.subSink = new Subscription();
        this.subSink.add(() => {
          this.gameData = null;
          this.market = null;
          this.runnerGameData = {};
          this.exchData = null;
          this.exchName = '';
          this.progress = 0;
          this.round = 0;
          this.cancelCall$.next();
        });

        this.getOpenBets();

        this.exchName = pair.params.exchName;

        this.getGameData(true);
        let gameDataInterval = interval(1000).subscribe(() => {
          if (!this.isShowResults) {
            this.getGameData();
          }
        });

        this.subSink.add(gameDataInterval);
      });
  }

  clearData() { }

  getGameData(firstCall?: boolean) {
    this.exchGamesService
      .getGameData(this.exchName, firstCall)
      .pipe(
        takeUntil(this.cancelCall$)
      )
      .subscribe((res: IExchData) => {
        // //console.log(res);
        if (res && res.channel?.game?.markets?.markets && res.channel?.game.markets.markets[0]) {
          this.exchData = res;
          this.market = res.channel?.game.markets.markets[0];
          if (res.channel?.game.markets.markets[1]) {
            this.market2 = res.channel?.game.markets.markets[1];
          } else {
            this.market2 = null;
          }

          this.marketId = this.market?.id;
          this.gameData = res.channel?.game.gameData;
          this.eventId = this.exchData?.channel?.game?.id;
          this.gameId = this.exchData?.channel?.id;
          this.round = this.exchData?.channel?.game?.round;


          if ((this.exchName == 'blackjack' || this.exchName == 'blackjack-turbo') && this.round == 1) {
            this.gameData = EmptyCards;
          }

          if (this.previousMarket != this.marketId) {
            this.marketLiability = 0;
            this.userService.getBets();
            setTimeout(() => {
              this.userService.getBalance();
            }, 1000);
            this.getExposure(this.previousMarket, 1);
            this.previousMarket = this.market?.id;
          }

          if (this.gameData) {
            this.gameData?.objects?.forEach((obj) => {
              this.runnerGameData[obj.name] = obj;
            });
            if (!this.listBetsCalled) {
              this.userService.getBets();
              this.listBetsCalled = true;
            }
            if (!this.exposureCalled) {
              this.getExposure();
              this.exposureCalled = true;
            }
            if (
              this.exchData?.channel?.game?.markets?.markets[0].status !=
              'ACTIVE'
            ) {
              this.placeBetData = null;
            }

            if (this.previousRound != this.round) {
              this.getExposure();
              this.userService.getBalance();
              this.previousRound = this.round;
            }
          }
          this.progress = res.channel?.game?.bettingWindowPercentageComplete;

          // console.log(this.gameData)
          // console.log(this.runnerGameData)

        }
      });
  }

  betSlip(
    betType,
    runnerName,
    selectionId,
    matchName,
    odds,
    mtid,
    mktid,
    sportId
  ) {
    // console.log(
    //   betType,
    //   runnerName,
    //   selectionId,
    //   matchName,
    //   odds,
    //   mtid,
    //   mktid,
    //   sportId
    // );

    this.selectTab(1);
    this.selectTabBacc(1);


    this.placeBetData = {
      backlay: betType,
      selectionId: selectionId,
      marketId: mktid,
      matchId: mtid,
      odds: odds,
      runnerName: runnerName,
      stake: 0,
      profit: 0,
      sportId: sportId,
      gameType: '' ,
      loss:0
    };
    this.isShowBetSlip = true;
  }

  updateStake(stake: number) {
    this.placeBetData.stake = stake;
    if (
      this.placeBetData.backlay == 'back' ||
      this.placeBetData.backlay == 'lay'
    ) {
      var odds = this.placeBetData.odds;
      // console.log(this.placeBetData);
      let pnl = ((parseFloat(odds) - 1) * this.placeBetData.stake).toFixed(2);
      this.placeBetData.profit = +pnl;
    }
  }

  removeAllBetSlip() {
    this.placeBetData = null;
  }

  placeBet() {
    $('#pendding').show();
    let betData: IBetData = {
      marketId: this.placeBetData.marketId,
      selId: +this.placeBetData.selectionId,
      odds: +this.placeBetData.odds,
      stake: +this.placeBetData.stake,
      betType: this.placeBetData.backlay,
      gid: this.gameId,
      gameType: 'exchange',
    };
    this.exchGamesService
      .placeBetsExG(betData)
      .subscribe((res: GenericResponse<any>) => {
        // //console.log(res);
        if (res && res.errorCode == 0) {
          if (res.result[0]?.reqId && res.result[0]?.result == "pending") {
            let getResp = res.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResult(getResp);
            }, (getResp.delay * 1000) + 500);
          } else {
            this.toastr.success(res.errorDescription);
            setTimeout(() => {
              this.userService.getBets();
              this.userService.getBalance();
              this.getExposure();
            }, 1000);
            this.marketLiability = res.result[0].marketLiability;
            localStorage.setItem('marketLiability_' + this.marketId, JSON.stringify(this.marketLiability));
          }
        } else {
          if (res) {
            this.toastr.error(res.errorDescription);
          }
        }
        this.placeBetData = null;
        $('#pendding').hide();
      });
  }

  requestResult(data) {

    // console.log(data)
    this.exchGamesService.requestResult(data.reqId).subscribe((res: GenericResponse<any>) => {
      // //console.log(res);
      if (res && res.errorCode == 0) {
        this.toastr.success(res.errorDescription);
        setTimeout(() => {
          this.userService.getBets();
          this.userService.getBalance();
          this.getExposure();
        }, 500);
        this.marketLiability = res.result[0].marketLiability;
        localStorage.setItem('marketLiability_' + this.marketId, JSON.stringify(this.marketLiability));
      } else {
        if (res) {
          this.toastr.error(res.errorDescription);
        }
      }
      this.placeBetData = null;
      $('#pendding').hide();
    });
  }


  selectTab(tabNo: number) {
    this.selectedTab = tabNo;
  }
  selectTabBacc(tabNo: number) {
    this.selectedTabBacc = tabNo;
  }

  showGames() {
    this.isShowResults = false;

    let marketLiability = localStorage.getItem('marketLiability_' + this.marketId);
    if (marketLiability) {
      this.marketLiability = JSON.parse(marketLiability);
    }
    this.gameData = null;
    this.market = null;
    this.runnerGameData = {};
    this.getGameData(true);
  }

  showResults() {
    this.marketLiability = 0;
    this.isShowResults = true;
    this.getResults();
  }

  getResults() {
    this.exchGamesService.exchResults(this.gameId).subscribe((res: string) => {
      if (res) {
        this.lastFiveResults = JSON.parse(res);
        // console.log(JSON.parse(res));

        this.market = null;
        this.market2 = null;


        this.result = this.lastFiveResults?.channel?.games?.games[4];
        this.showGameResult(this.result.id);
      }
    });
  }

  getResultByMarketId() {
    if (this.resultMarketId) {
      this.exchGamesService
        .resultByMarketId(this.resultMarketId)
        .subscribe((res: any) => {
          if (res && res.errorCode === 1) {
            this.toastr.error(res.errorDescription);
          } else {
            this.result = JSON.parse(res);
            this.showGameResult();
            // console.log(this.result);
          }
        });
    }
  }

  showGameResult(gameId?: number) {
    if (gameId) {
      this.result = this.lastFiveResults?.channel?.games?.games.find(
        (g) => g.id == gameId
      );
    }

    this.gameData = this.result.gameData;
    this.market = this.result.markets.markets[0];
    // console.log(this.result);

    if (this.gameData) {
      this.gameData?.objects.forEach((obj) => {
        this.runnerGameData[obj.name] = obj;
      });
      if (
        this.exchData?.channel?.game?.markets?.markets[0].status != 'ACTIVE'
      ) {
        this.placeBetData = null;
      }
      this.round = this.exchData?.channel?.game?.round;
    }
  }

  getOpenBets() {
    let openBetsSub = this.userService.openBets$.subscribe((bets) => {
      this.matchedData = Array.from(
        bets.filter((bet) => +bet.eventId == +this.eventId)
      );
      if (this.matchedData.length) {
        this.isShowBetSlip = true;
      }
    });
    this.subSink.add(openBetsSub);
  }

  getExposure(marketId?: number, clear?: number) {
    if (marketId && clear) {
      localStorage.removeItem('marketLiability_' + marketId);
      $('[id^=exp_]').text('');
      let exposureBook = localStorage.getItem('Xposure_' + marketId);
      if (exposureBook) {
        exposureBook = JSON.parse(exposureBook);
        Object.keys(exposureBook).forEach((item) => {
          $('#exp_' + item)
            .text('')
          localStorage.removeItem('Xposure_' + marketId);
        });
      }
      return;
    }
    this.exchGamesService
      .listBooks(this.marketId)
      .subscribe((res: GenericResponse<any>) => {
        if (res && res.errorCode == 0) {
          let exposureBook = res.result[0];
          if (this.exchName.toLowerCase().includes('blackjack')) {
            // let key = Object.keys(exposureBook)[0];
            // let values = Object.values(exposureBook);
            // $('#exp_' + key)
            //       .html(`<span class="${+values[0] > 0? 'positive': 'negative'}">${(<number>+values[0]).toFixed(2)}, <span class="${+values[1] > 0? 'positive': 'negative'}">${(<number>+values[1]).toFixed(2)}`)
            //       .removeClass('positive')
            //       .removeClass('negative');

            // $('#exp_' + key).css('display', 'inline-block');
            Object.keys(exposureBook).forEach((item) => {
              let value = +exposureBook[item];
              $('#exp_' + item)
                .removeClass('positive')
                .removeClass('negative')
                .html(`<span class="${value > 0 ? 'positive' : 'negative'}">${value.toFixed(2)}`)
              $('#exp_' + item).css('display', 'inline-block');
            });

            let marketLiability = localStorage.getItem('marketLiability_' + this.marketId);
            if (marketLiability) {
              this.marketLiability = JSON.parse(marketLiability);
            }
            localStorage.setItem(
              'Xposure_' + this.marketId,
              JSON.stringify(exposureBook)
            );
          } else {
            Object.keys(exposureBook).forEach((item) => {
              let value = +exposureBook[item];
              if (value < 0) {
                $('#exp_' + item)
                  .text('' + value.toFixed(2) + '')
                  .removeClass('positive')
                  .addClass('negative');
              } else {
                $('#exp_' + item)
                  .text('' + value.toFixed(2) + '')
                  .removeClass('negative')
                  .addClass('positive');
              }
              $('#exp_' + item).css('display', 'inline-block');
              // }
            });

            let marketLiability = localStorage.getItem('marketLiability_' + this.marketId);
            if (marketLiability) {
              this.marketLiability = JSON.parse(marketLiability);
            }
            localStorage.setItem(
              'Xposure_' + this.marketId,
              JSON.stringify(exposureBook)
            );
          }

        }
      });
  }

  trackByIdRunner(index, item) {
    if (item) {
      return item.id;
    }
  }

  trackByCon(index, item: IOpenBets) {
    return item.consolidateId;
  }

  trackByRunnerGame(index, item) {
    // console.log(item);

    return item.id;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();

    this.market = null;
    this.market2 = null;

  }
}
