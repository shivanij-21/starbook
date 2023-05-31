import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  IStake,
  SettingsService,
  STAKE_LIST,
} from 'src/app/services/settings.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { ICurrentUser } from 'src/app/shared/types/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { IOpenBets } from 'src/app/shared/types/open-bets';
import { BetsService } from '../services/bets.service';
import { FullmarketService } from '../services/fullmarket.service';
import { IBetslipData } from '../types/betslip-data';
import { ICasinoBetData } from '../types/casino-betdata';
import { BetslipService } from './betslip.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-betslip',
  templateUrl: './betslip.component.html',
  styleUrls: ['./betslip.component.scss'],
})
export class BetslipComponent implements OnInit, OnChanges {
  @Input() tvUrl: boolean;
  @Input() sportId: number;
  @Input() betDelay: number;
  @Input() marketdata: any;
  @Input() matchid: any;
  @Input() marketId: any;
  @Input() bfId: any;
  @Input() tableId: any;
  @Input() currentMatchData: any;
  @Input() bookmakingData: any;
  @Input() isTeenpatti: boolean;
  @Input() matchedData: any[];
  @Input() unMatchedData: any[];
  @Input() BookDataList1: any = {};
  @Input() BMbookdata: any = [];

  @Input() backBetSlipDataArray: any[];
  @Input() layBetSlipDataArray: any[];
  @Input() backTeenSlipDataArray;

  @Input() events: Observable<any>;
  showTv: boolean = false;
  exposureBook: any;
  liabilities: number;
  liabilityBack: number;
  liabilityBackBook: number;
  liabilityYes: number;
  liabilityLay: number;
  liabilityLayBook: number;
  liabilityNo: number;
  stake: number;
  ExpoMktid: any;
  bets: any;
  backBetSlipList: any;
  layBetSlipList: any;

  backBookBetSlipList = [];
  layBookBetSlipList = [];
  yesBetSlipList: any;
  noBetSlipList: any;
  cards: any[];
  placeTPData: any;

  stakeList: IStake[];
  disablePlaceBet: boolean = false;
  placedButton: boolean;
  placeMarketData: any;
  mktid: any;
  matchedDataHolder: any[];
  unMatchedDataHolder: IOpenBets[];
  isAverageBets: any;
  timeRemaining: any;
  timeRemainingRef: any;

  subSink: Subscription;
  inputStakeNO: any;
  inputStakeYES: any;
  accountInfo: any;
  currentUser: ICurrentUser;
  betType: any;
  runnerName: any;
  selectionId: any;
  matchName: any;
  odds: any;
  mtid: any;
  fancyRate: any;
  fancyId: any;
  profit: string;
  loss: string
  BookDataList: any;

  betSlipData: any;
  newbookExposure: any;
  // BookDataList1: any = {};


  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
    private betsService: BetsService,
    private fullmarketService: FullmarketService,
    private betslipService: BetslipService,
    private tokenService: TokenService,

  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // //console.log(changes)

    if (changes.backBetSlipDataArray || changes.layBetSlipDataArray) {
      // //console.log(this.layBetSlipDataArray)
      if (this.betSlipData) {
        this.betSlipData.stake = 0;
        this.betSlipData.profit = 0;
        this.betSlipData.loss = 0;
        this.betSlipData.odds = 0;
        this.betSlipData['remove'] = true;
        this.calcProfit(this.betSlipData)
        this.calcBookProfit(this.betSlipData)
      }
    }

  }
  ngOnInit(): void {
    this.subSink = new Subscription();

    this.subSink.add(
      this.settingsService.stakeList$.subscribe((stakeList) => {
        this.stakeList = stakeList;
      })
    );
    window.addEventListener('storage', (event) => {
      if (event.key === STAKE_LIST) {
        this.stakeList = JSON.parse(event.newValue);
        //console.log(event.newValue);

      }
    });
    this.betslipService.events$.subscribe(({ func, data }) => {
      if (this[func]) {
        if (data) {
          this[func](...data['params']);
        } else {
          this[func]();
        }
      }
    });

    this.authService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.UserDescription()
    this.getOpenBets();
  }

  toggleTv() {
    this.showTv = !this.showTv;
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

      // //console.log(this.backBetSlipDataArray)
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

      // //console.log(this.layBetSlipDataArray)
    }
    this.calcExposure(this.ExpoMktid, this.bets);
    this.calcProfit(bet)
    this.calcBookProfit(bet)

  }

  cDown(bet, index, parentIndex) {
    // var currentOdds=parseFloat($(this).val())
    // //console.log(val)
    // //console.log(backlay)
    // //console.log(index)
    // //console.log(parentIndex)

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

      // //console.log(this.backBetSlipDataArray)
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

      // //console.log(this.layBetSlipDataArray)
    }
    this.calcExposure(this.ExpoMktid, this.bets);
    this.calcProfit(bet)
    this.calcBookProfit(bet)



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
        if (this.stake == null || undefined) {
          this.stake = 0;
        }
        this.liabilityBack = this.liabilityBack + this.stake;
      });
      _.forEach(item.yesBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null || undefined) {
          this.stake = 0;
        }
        this.liabilityYes = this.liabilityYes + this.stake;
      });
      _.forEach(item.backBookBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null || undefined) {
          this.stake = 0;
        }
        this.liabilityBackBook = this.liabilityBackBook + this.stake;
      });
    });
    _.forEach(this.layBetSlipDataArray, (item) => {
      _.forEach(item.layBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null || undefined) {
          this.stake = 0;
        }
        this.liabilityLay = this.liabilityLay + this.stake;
      });
      _.forEach(item.noBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null || undefined) {
          this.stake = 0;
        }
        this.liabilityNo = this.liabilityNo + this.stake;
      });
      _.forEach(item.layBookBetSlipData, (item) => {
        this.stake = item.stake;
        if (this.stake == null || undefined) {
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

  closeBetSlip(index, type, parentIndex) {
    // //console.log(index, type)
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
        // //console.log(this.backBetSlipDataArray.length)
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
        // //console.log(this.backBetSlipDataArray.length)
        this.layBetSlipDataArray.splice(parentIndex, 1);
      }
    }
    this.calculateLiability();
  }

  updateStake(bet, booktype) {
    if (!bet.stake || bet.stake == '') {
      bet.stake = 0.0;
    }
    if (bet.backlay == 'back' || bet.backlay == 'lay') {
      var odds = bet.odds;
      // //console.log(bet);
      if (bet.gameType === '-12') {
        odds = parseFloat(odds) / 100 + 1;
      }
      let pnl = ((parseFloat(odds) - 1) * parseFloat(bet.stake)).toFixed(2);
      bet.profit = pnl;
      // //console.log(bet.profit, bet);
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
    // //console.log(bet);
    this.calculateLiability();
  }

  stakeValue(stake, bet, booktype) {
    // //console.log(stake)

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
    this.calcProfit(bet)
    this.calcBookProfit(bet)


  }

  listBet() {
    this.userService.getBets();
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();
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
            // //console.log(item2)
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

    if (this.backTeenSlipDataArray) {
      if (this.backTeenSlipDataArray.length) {
        _.forEach(this.backTeenSlipDataArray, (item, key) => {
          $('#loading_place_bet').css('display', 'block');
          this.placeTpBet(item, key);
        });
      }
    }




  }

  placeBetMobile(betData) {
    $(`#inline-pendding${betData.selectionId}`).css('display', 'block');
    let betData1 = {
      marketId: betData.marketId,
      selId: betData.selectionId,
      odds: betData.odds,
      stake: +betData.stake,
      betType: '',
      gameType: '',
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

      if (
        betData.backlay.toLowerCase() == 'back' &&
        selection.ex.availableToBack[0].price + 0.1 < +betData.odds
      ) {
        this.toastr.error(
          `Unmatched Bet of ${betData.odds} price is not allowed. price difference of 0.1 from current price is allowed for unmatched. Please try again.`
        );
        $(`#inline-pendding${betData.selectionId}`).css('display', 'none');
        this.removeAllBetSlip();
        return;
      } else if (
        betData.backlay.toLowerCase() == 'lay' &&
        selection.ex.availableToLay[0].price - 0.1 > +betData.odds
      ) {
        this.toastr.error(
          `Unmatched Bet of ${betData.odds} price is not allowed. price difference of 0.1 from current price is allowed for unmatched. Please try again.`
        );
        $(`#inline-pendding${betData.selectionId}`).css('display', 'none');
        this.removeAllBetSlip();
        return;
      }
    } catch (error) { }
    if (betData?.gameType == 'premium') {
      betData1.gameType = 'premium';
      //console.log(betData1);

    }
    else if (betData.backlay == 'backBook' || betData.backlay == 'layBook') {
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
    // //console.log(betData1);
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
                //console.log("click")
                if (response.result[0].gameType == 'exchange') {
                  let BookDataList = response.result[1];
                  //console.log(BookDataList)

                  if (BookDataList) {
                    _.forEach(Object.keys(BookDataList), (item, index) => {
                      var mktexposure = +BookDataList[item];
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
                  //console.log(response.result[1])
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
                this.userService.sendBets(response.result[2]);

                // this.matchedData = Array.from(
                //   response.result[2].filter((bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 0)
                // );
              } else {
                this.userService.getBets()
              }
              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();

              }
              // this.userService.getBalance();
              // this.userService.getBets()
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
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          $('.matchOddTable .select').removeClass('select');

          this.toastr.error(response.errorDescription);
          this.removeAllBetSlip();
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


  requestResultPlaceBetMobile(data, betData1) {

    // //console.log(data)
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
            // $("#betslip_open").addClass("close");
            setTimeout(() => {
              if (response.result[1]) {
                let marketBook = [];
                marketBook.push(response.result[1]);
                if (response.result[0].gameType == 'exchange') {
                  let BookDataList = response.result[1];
                  this.BookDataList1[response.result[0].marketId] = marketBook;

                  //console.log(BookDataList)

                  if (BookDataList) {
                    _.forEach(Object.keys(BookDataList), (item, index) => {
                      var mktexposure = +BookDataList[item];
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
                  this.BMbookdata[response.result[0].marketId] = marketBook;

                  //console.log(response.result[1])
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
                this.userService.sendBets(response.result[2]);

                // this.matchedData = Array.from(
                //   response.result[2].filter((bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 0)
                // );
                // //console.log(response.result)
              } else {
                this.userService.getBets()
              }
              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();

              }
              // this.userService.getBalance();
              // this.userService.getBets()
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
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          $('.matchOddTable .select').removeClass('select');

          this.toastr.error(response.errorDescription);
          this.removeAllBetSlip();
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

      // if (
      //   betData.backlay.toLowerCase() == 'back' &&
      //   selection.ex.availableToBack[0].price + 0.1 < +betData.odds
      // ) {
      //   this.toastr.error(
      //     `Unmatched Bet of ${betData.odds} price is not allowed. price difference of 0.1 from current price is allowed for unmatched. Please try again.`
      //   );
      //   $('#loading_place_bet').css('display', 'none');
      //   this.removeAllBetSlip();

      //   return;
      // } else if (
      //   betData.backlay.toLowerCase() == 'lay' &&
      //   selection.ex.availableToLay[0].price - 0.1 > +betData.odds
      // ) {
      //   this.toastr.error(
      //     `Unmatched Bet of ${betData.odds} price is not allowed. price difference of 0.1 from current price is allowed for unmatched. Please try again.`
      //   );
      //   $('#loading_place_bet').css('display', 'none');
      //   this.removeAllBetSlip();
      //   return;
      // }
    } catch (error) { }

    // this.currentMatchData.forEach((market) => {
    //   if (market.marketId == market.marketId) {
    //     market.pnl = this.BookDataList[market.marketId];
    //     if (market.pnl) {
    //       market['pnl'] = market.pnl
    //     } else {
    //       this.ExposureBook(market.marketId);
    //     }
    //     if (market.newpnl) {
    //       market['newpnl'] = market.newpnl;
    //     }

    //   }
    // })

    let betData1 = {
      marketId: betData.marketId,
      selId: betData.selectionId,
      odds: +betData.odds,
      stake: +betData.stake,
      betType: betData.backlay,
      uid: this.currentUser.userName,
      gameType: betData.gameType,
    };
    //console.log(betData1);


    if (betData?.gameType == 'premium') {
      betData1.gameType = 'premium';
      //console.log(betData1);
    }
    else if (betData.backlay == 'backBook' || betData.backlay == 'layBook') {
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

    // //console.log(betData1);
    $('#placebet_btn').removeClass('disable');
    $('#placebet_btn').addClass('disable');
    $('#placebet_btn').prop('disabled', true);
    this.disablePlaceBet = true;
    if (betData1.gameType == 'premium') {
      this.betsService.placeBetsPremium(betData1).subscribe(
        (response: GenericResponse<any>) => {
          if (response.errorCode == 0) {

            if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
              let getResp = response.result[0];
              // getResp.delay = getResp.delay + 1;

              setTimeout(() => {
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
                  //console.log("click")
                  let BookDataList = response.result[1];
                  //console.log(BookDataList)

                  if (BookDataList) {
                    _.forEach(Object.keys(BookDataList), (item, index) => {
                      var mktexposure = +BookDataList[item];
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
                  this.userService.sendBets(response.result[2]);

                  // this.matchedData = Array.from(
                  //   response.result[2].filter((bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 0)
                  // );
                  // //console.log(response.result)
                } else {
                  this.userService.getBets()
                }
                if (response.result[3]) {
                  this.userService.setBalance(response.result[3][0]);
                } else {
                  this.userService.getBalance();

                }
                // this.userService.getBalance();
                // this.listBet();
                this.ExposureBook(betData1.marketId);
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
            this.removeAllBetSlip();
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
    } else {
      this.betsService.placeBet(betData1).subscribe(
        (response: GenericResponse<any>) => {
          if (response.errorCode == 0) {

            if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
              let getResp = response.result[0];
              // getResp.delay = getResp.delay + 1;

              setTimeout(() => {
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
                  //console.log("click")
                  let BookDataList = response.result[1];
                  //console.log(BookDataList)

                  if (BookDataList) {
                    _.forEach(Object.keys(BookDataList), (item, index) => {
                      var mktexposure = +BookDataList[item];
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
                  this.userService.sendBets(response.result[2]);

                  // this.matchedData = Array.from(
                  //   response.result[2].filter((bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 0)
                  // );
                  // //console.log(response.result)
                } else {
                  this.userService.getBets()
                }
                if (response.result[3]) {
                  this.userService.setBalance(response.result[3][0]);
                } else {
                  this.userService.getBalance();

                }
                // this.userService.getBalance();
                // this.listBet();
                this.ExposureBook(betData1.marketId);
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
            this.removeAllBetSlip('',this.betSlipData);
            $('#placebet_btn').removeClass('disable');
            $('#placebet_btn').prop('disabled', false);
            $('.matchOddTable .select').removeClass('select');

            this.toastr.error(response.errorDescription);
            // this.removeAllBetSlip();
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

  }
  requestResultPlaceBetFunc(data, betData1, betData, index) {

    // //console.log(data)
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
                //console.log("click")
                let BookDataList = response.result[1];
                //console.log(BookDataList)

                if (BookDataList) {
                  _.forEach(Object.keys(BookDataList), (item, index) => {
                    var mktexposure = +BookDataList[item];
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
                this.userService.sendBets(response.result[2]);
                // this.matchedData = Array.from(
                //   response.result[2].filter((bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 0)
                // );
                // //console.log(response.result)
              } else {
                this.userService.getBets()
              }
              if (response.result[3]) {
                this.userService.setBalance(response.result[3][0]);
              } else {
                this.userService.getBalance();

              }
              // this.userService.getBalance();
              // this.listBet();
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
          this.removeAllBetSlip();
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
    // //console.log(betData1);
    this.betsService.placeBet(betData1).subscribe(
      function mySuccess(response: GenericResponse<any>) {
        if (response.errorCode == 0) {
          if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
            let getResp = response.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResultlPlaceBetFancy(getResp, betData1, betData, index);
            }, (getResp.delay * 1000) + 500);
          } else {
            this.$emit('callFancyExp', {});

            if (betData.yesno == 'yes') {
              // //console.log(betData)
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
            this.userService.getBalance();
            this.userService.getBets();
            // $("#betslip_open").addClass("close");
            this.placedButton = false;

          }
        } else {
          $('#loading_place_bet').css('display', 'none');
          this.placedButton = false;

          this.toastr.error(response.errorDescription);
          this.removeAllBetSlip();
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

    // //console.log(data)
    this.betsService.requestResult(data.reqId).subscribe(
      function mySuccess(response: GenericResponse<any>) {
        if (response.errorCode == 0) {
          if (response.result[0]?.result == "pending") {
            setTimeout(() => {
              this.requestResultlPlaceBetFancy(data, betData1, betData, index);
            }, 500)
          } else {
            this.$emit('callFancyExp', {});

            if (betData.yesno == 'yes') {
              // //console.log(betData)
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
            this.userService.getBalance();
            this.userService.getBets();
            // $("#betslip_open").addClass("close");
            this.placedButton = false;

          }
        } else {
          $('#loading_place_bet').css('display', 'none');
          this.placedButton = false;

          this.toastr.error(response.errorDescription);
          this.removeAllBetSlip();

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

    // //console.log(betData)
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
      marketId: betData.sportId == 52 ? betData.bfId : betData.marketId,
      selId: betData.selectionId,
      odds: betData.odds,
      stake: +betData.stake,
      betType: betData.backlay == 'backBook' ? 'back' : 'lay',
      gameType: 'book',
    };
    // //console.log(betData1);

    // //console.log(betData)
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
                //console.log("click")

                //console.log(response.result[1])
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
                this.userService.sendBets(response.result[2]);

                // this.matchedData = Array.from(
                //   response.result[2].filter((bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 0)
                // );
                // //console.log(response.result)
              } else {
                this.userService.getBets()
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
          this.removeAllBetSlip();
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

    // //console.log(data)
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
              //console.log("click")

              //console.log(response.result[1])
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
              this.userService.sendBets(response.result[2]);

              // this.matchedData = Array.from(
              //   response.result[2].filter((bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 0)
              // );
              // //console.log(response.result)
            } else {
              this.userService.getBets()
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
        this.placedButton = false;
        this.removeAllBetSlip();


      }
    }, err => {
      $('#loading_place_bet').css('display', 'none');
      $('#placebet_btn').prop('disabled', false);
      $('#placebet_btn').removeClass('disable');
      this.placedButton = false;
    });

  }

  placeTpBet(betData, index) {
    this.setBetTimeout();

    let betData1: ICasinoBetData = {
      betType: betData.backlay,
      gameType: betData.matchname,
      selId: betData.runnerId,
      round: +betData.gameId.split('.')[1],
      odds: +betData.odds,
      stake: +betData.stake,
      cards: [],
    };
    // //console.log(betData1);
    this.betsService.placeTPBet(betData1).subscribe(
      (response: GenericResponse<any>) => {
        if (response.errorCode == 0) {
          if (response.result[0]?.reqId && response.result[0]?.result == "pending") {
            let getResp = response.result[0];
            // getResp.delay = getResp.delay + 1;

            setTimeout(() => {
              this.requestResultlPlaceTpBet(getResp, betData1, betData, index);
            }, (getResp.delay * 1000) + 500);
          } else {
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
              if (response.result[1]) {
                //console.log("click")
              }
              this.userService.getBalance();
              this.userService.getBets();
              this.ExposureBookTeenPatti(
                betData1.gameType,
                betData1.round,
                betData1.selId
              );
            }, 500);
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

          }
        } else {
          this.removeAllBetSlip();
          this.toastr.error(response.errorDescription);
          $('#loading_place_bet').css('display', 'none');
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);
          this.placedButton = false;

        }
      }
    );
  }

  requestResultlPlaceTpBet(data, betData1, betData, index) {

    // //console.log(data)
    this.betsService.requestResult(data.reqId).subscribe(
      (response: GenericResponse<any>) => {

        if (response.result[0]?.result == "pending") {
          setTimeout(() => {
            this.requestResultlPlaceTpBet(data, betData1, betData, index);
          }, 1000);
          return;
        }

        this.placedButton = false;
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
            if (response.result[1]) {
              //console.log("click")
            }
            this.userService.getBalance();
            this.userService.getBets();
            this.ExposureBookTeenPatti(
              betData1.gameType,
              betData1.round,
              betData1.selId
            );
          }, 500);
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
        } else {
          this.removeAllBetSlip();
          this.toastr.error(response.errorDescription);
          $('#loading_place_bet').css('display', 'none');
          $('#placebet_btn').removeClass('disable');
          $('#placebet_btn').prop('disabled', false);


        }
      }
    );

  }

  ExposureBookTeenPatti(tableName, roundId, selectionId) {
    this.fullmarketService
      .getTPExposureBook(tableName, roundId, selectionId)
      .subscribe((response: GenericResponse<any>) => {
        let TeenDataList = response.result[0];
        // //console.log(this.TeenDataList);
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
        });
      });
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
          // //console.log(response);
          let BookDataList = response.result[0];
          this.BookDataList1[mktid] = response.result;

          //console.log(BookDataList)

          // localStorage.setItem('exposureData',JSON.stringify(this.BookDataList))

          if (BookDataList) {
            _.forEach(Object.keys(BookDataList), (item, index) => {
              var mktexposure = +BookDataList[item];
              // if (mktexposure == 0) {
              //   mktexposure = null;
              // }
              // if (item.Value > 0) {
              //     $('#exposure_' + runName).text(mktexposure).css('color', 'green');
              // } else {
              //     $('#exposure_' + runName).text(mktexposure).css('color', 'red');
              // }
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
      // //console.log(this.ExpoMktid)
      if (this.ExpoMktid != undefined) {
        this.bets.stake = 0;
        this.bets.profit = 0;
      }
      this.calcExposure(this.ExpoMktid, this.bets, 'remove');
      // this.calcProfit(this.bets)

    }
    if (betData) {

      betData.odds = 0;
      betData.stake = 0;
      betData.profit = 0;
      betData.loss = 0;
      betData['remove'] = true;
      this.calcProfit(betData)
      this.calcBookProfit(betData)

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

  getBMExposureBook(marketId) {
    this.fullmarketService
      .getBookExposure(marketId)
      .subscribe((response: GenericResponse<any>) => {
        if (response.errorCode === 0) {
          //console.log(response.result[0])
          _.forEach(response.result[0], (value, item) => {
            this.BMbookdata = response.result
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
      });
  }

  getOpenBets() {
    let openBetsSub = this.userService.openBets$.subscribe((bets) => {
      //console.log(bets)
      //console.log(this.tableId)
      this.matchedDataHolder = Array.from(
        bets.filter((bet) => (bet.eventId == this.matchid || bet.eventName == this.tableId) && bet.unmatched == 0)
      );
      this.unMatchedDataHolder = Array.from(
        bets.filter((bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 1)
      );
      //console.log(this.matchedDataHolder)
      this.getAvgOdds(this.isAverageBets);
    });
    this.subSink.add(openBetsSub);
  }

  getOpenBetsByEvent() {
    this.userService
      .listBetsByEvent(this.matchid)
      .subscribe((res: GenericResponse<IOpenBets>) => {
        if (res && res.result) {
          this.matchedDataHolder = Array.from(
            res?.result.filter(
              (bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 0
            )
          );
          this.unMatchedDataHolder = Array.from(
            res?.result.filter(
              (bet) => (bet.eventId == this.matchid || bet.eventId == this.tableId) && bet.unmatched == 1
            )
          );
          this.getAvgOdds(this.isAverageBets);
        }
      });
  }

  getAvgOdds(isAverageBets) {
    if (isAverageBets) {
      let countMap = {};
      //console.log(this.matchedData, "matchdata");

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
      //console.log(this.currentMatchData);
      if (bet && !bet.remove) {
        let newMktExposure = _.cloneDeep((this.BookDataList1[market.marketId]));
        if (!newMktExposure) {
          newMktExposure = [];
        }
        if (bet.stake != null && market.marketId == bet.marketId && bet.gameType == 'exchange') {
          let selectionPnl = {};
          if (newMktExposure.length == 0) {
            _.forEach(market.runners, (runner) => {
              selectionPnl[runner.selectionId] = 0;
            })
            newMktExposure.push(selectionPnl);
          }
          _.forEach(newMktExposure[0], (value, selId) => {
            if (bet.backlay == "back" && bet.selectionId == selId) {
              if (bet.profit != null) {
                value = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                newMktExposure[0][selId] = value;
              }
            }
            if (bet.backlay == "back" && bet.selectionId != selId) {
              value = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
              newMktExposure[0][selId] = value;
            }
            if (bet.backlay == "lay" && bet.selectionId == selId) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                value = this.convertToFloat(parseFloat(value) - parseFloat(bet.loss));
                newMktExposure[0][selId] = value;
              }
            }
            if (bet.backlay == "lay" && bet.selectionId != selId) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                value = this.convertToFloat(parseFloat(value) + parseFloat(bet.profit));
                newMktExposure[0][selId] = value;
              }
            }
          })

          market['newpnl'] = newMktExposure;
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
          //console.log(newMktExposure);

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
    //console.log(this.currentMatchData)
  }

  marketsnewbookExposure(bet) {
    this.bookmakingData[0]?.forEach((market, mktIndex) => {
      //console.log(this.bookmakingData);
      if (bet) {
        this.newbookExposure = _.cloneDeep((this.BMbookdata));
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
          //console.log(this.newbookExposure);
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



  calcBookProfit(betData) {
    //console.log(betData);
    let betData1 = {
      backlay: betData.backlay,
      selectionId: betData.selectionId,
      marketId: betData.marketId,
      odds: betData.odds,
      runnerName: betData.runnerName,
      stake: +betData.stake,
      bfId: this.bfId,
      sportId: this.sportId,
      profit: betData.profit,
      gameType: 'exchange',
      loss: betData.loss
    };
    this.betSlipData = betData1;
    if (betData1.stake && betData1.odds && betData1.gameType == 'exchange') {
      if (betData.backlay == "back") {
        betData1.profit = (
          ((parseFloat(betData1.odds) - 1) * betData1.stake).toFixed(2));
        betData1.loss = (betData1.stake);
      } else {
        betData1.loss = (
          ((parseFloat(betData1.odds) - 1) * betData1.stake).toFixed(2));
        betData1.profit = (betData1.stake);
      }
      //console.log(betData1, "betData1")
    }
    this.marketsNewExposure(betData1)

  }

  calcProfit(betData) {
    //console.log(betData);
    let betData1 = {
      backlay: betData.backlay,
      selectionId: betData.selectionId,
      marketId: betData.marketId,
      odds: betData.odds,
      runnerName: betData.runnerName,
      stake: +betData.stake,
      bfId: this.bfId,
      sportId: this.sportId,
      profit: betData.profit,
      gameType: 'bookmaker',
      loss: betData.loss
    };
    this.betSlipData = betData1;
    if (betData1.stake && betData1.odds && betData1.gameType == 'bookmaker') {
      if (betData1.backlay == "backBook") {
        betData1.profit = (((parseFloat(betData1.odds) * betData1.stake) / 100).toFixed(2));
        betData1.loss = (betData1.stake);
      } else {
        betData1.loss = (((parseFloat(betData1.odds) * betData1.stake) / 100).toFixed(2));
        betData1.profit = (betData1.stake);
      }

    }
    this.marketsnewbookExposure(betData1)

  }


  convertToFloat(value) {
    return parseFloat(value).toFixed(2);
  }


  setBetTimeout() {
    if (!this.betDelay) {
      this.betDelay = 0;
    }
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

  fancyStakechange(stake, fancyId) {
    // //console.log(stake);
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

  cancelBet(betId) {
    this.betsService.cancelBet(betId).subscribe((res: GenericResponse<any>) => {
      // //console.log(res);
      this.toastr.success('Cancel unmatched bet');
      this.userService.getBets();
    });
  }

  trackByCon(trackByCon, item: IOpenBets) {
    return item.consolidateId;
  }
}
