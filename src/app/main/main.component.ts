import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from '../services/common.service';
import { interval, Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DataFormatService } from '../services/data-format.service';
import { GamesService } from '../services/games.service';
import { SettingsService } from '../services/settings.service';
import { ShareDataService } from '../services/share-data.service';
import { UserService } from '../services/user.service';
import { GenericResponse } from '../shared/types/generic-response';
import { IMarket } from '../shared/types/my-markets';
import { IPingResponse } from '../shared/types/ping-res';
import { IRaces } from '../shared/types/races';
import { IApis } from '../shared/types/apis';
import { finalize } from 'rxjs/operators';
import { OddsServiceService } from '../services/odds-service.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  isSidebarOpen: boolean = true;
  subSink: Subscription;

  @Input() autoModalShown: TemplateRef<any>;
  showRulesAgree: boolean = false;
  intervalSub: Subscription;
  interval$: Observable<number>;

  rules: string;
  myMarkets: IMarket[];

  gamesListInterval: boolean = false;
  winnerMarket: any;
  showCasino = false;
  isGetGameInTransit: boolean;
  isHorseTodayInTransit: boolean;
  isGrayTodayInTransit: boolean;
  isHorseTommInTransit: boolean;
  isGrayTommInTransit: boolean;
  isPingInTransit: boolean;
  isheader: boolean = false;
  apiAfterCalling: boolean = false;
  subscriptions: Subscription;
  isPoker = environment.isPoker;


  constructor(
    private modalService: BsModalService,
    private gamesService: GamesService,
    private dataFormatService: DataFormatService,
    private authService: AuthService,
    private userService: UserService,
    private titleService: Title,
    private router: Router,
    private settingsService: SettingsService,
    private shareDataService: ShareDataService,
    private commonService: CommonService,
    private oddsService: OddsServiceService

  ) {
    if (this.router.url.indexOf('/full-market') > -1) {

    }
    this.router.events.subscribe((event: NavigationStart) => {
      if (event instanceof NavigationStart) {
        if (event.url.indexOf('/full-market') > -1) {
          this.isheader = true;
        } else {
          this.isheader = false;
        }
      }
    })


  }


  ngOnInit(): void {
    this.commonService.apis$.subscribe(() => {
      this.getActivatedGames();
      this.getGames(null);
      this.userService.getBalance();
      this.userService.getBets();
      this.apiAfterCalling = true;

    });
    this.subSink = new Subscription();

    this.shareDataService.unSubGames$.subscribe((unsub) => {
      this.gamesListInterval = unsub;
    });

    this.intervalSub = interval(60000).subscribe(() => {
      if (!this.gamesListInterval) {
        this.getGames('game');
      }
    });

    let pingInterval = interval(20000).subscribe(() => {
      if (!this.isPingInTransit) {
        this.isPingInTransit = true;
        this.authService
          .ping()
          .pipe(finalize(() => (this.isPingInTransit = false)))
          .subscribe((res: GenericResponse<IPingResponse>) => {
            if (res && res.errorCode === 0) {
              this.userService.setBalance(res.result[0]);
              this.userService.setPingValue(res.result[0]);
            }
          });
      }
    });

    this.rules = this.authService.getCurrentUser().rules;
    if (!this.settingsService.getRulesAgreement() && this.rules) {
      this.showRulesAgree = true;
    }

    this.subSink.add(this.intervalSub);
    this.subSink.add(pingInterval);

    this.dataFormatService.sportsData$.subscribe((sportsData) => {
      this.winnerMarket = this.dataFormatService.highlightwisedata(
        4,
        'winner'
      )[0];

      // console.log(this.winnerMarket)
    });

    this.router.events.subscribe((e) => {
      if (this.modalRef) {
        this.modalRef.hide();
      }
    });
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.showCasino = isLoggedIn;
    });
  }



  getGames(isgame) {
    if (this.apiAfterCalling == true) {


      this.subscriptions = new Subscription();

      if (!isgame) {
        this.gamesService.horseRacingGamesToday().subscribe((res: IRaces[]) => {
          this.dataFormatService.getOtherGames(res, 1);
        });

        this.gamesService.greyhoundGamesToday().subscribe((res: IRaces[]) => {
          this.dataFormatService.getOtherGames(res, 1);
        });

        this.gamesService.horseRacingGamesTomorrow().subscribe((res: IRaces[]) => {
          this.dataFormatService.getOtherGames(res, 2);
        });

        this.gamesService.greyhoundGamesTomorrow().subscribe((res: IRaces[]) => {
          this.dataFormatService.getOtherGames(res, 2);
        });
      }

      this.gamesService.listGames().subscribe((res: GenericResponse<any>) => {
        if (res.errorCode === 0) {
          _.forEach(res.result, function (item) {
            if (item.sportsName == "Virtual Cricket") {
              item.sportsName = "cricket";
              item.sportId = "4";
              item.eventTypeId = "4";
              item['isVirtual'] = true;
            }
            if (item.sportsName == "Election") {
              item['isKabaddi'] = true;
              // item['isBm'] = true;
              item['isFancy'] = true;
            }

            // console.log(item);
          })
          this.getMatchOdds(res.result);

          // this.dataFormatService.getSportsData(res.result);
        }
      });
      this.intervalSub = new Subscription();
    }
  }

  getActivatedGames() {
    this.gamesService
      .activatedHorseGames()
      .subscribe((res: GenericResponse<string>) => {
        // console.log(res.result);
        if (res) {
          this.dataFormatService.setActivatedRaces({
            sportId: 7,
            countries: res.result,
          });

          this.getGames(null);
        }
      });
    this.gamesService
      .activatedGreyhoundGames()
      .subscribe((res: GenericResponse<string>) => {
        // console.log(res.result);
        if (res) {
          this.dataFormatService.setActivatedRaces({
            sportId: 4339,
            countries: res.result,
          });
          this.getGames(null);
        }
      });
  }

  openModal(template: TemplateRef<any>) {
    this.getMyMarkets();
    this.modalRef = this.modalService.show(template);
  }

  getMyMarkets() {
    this.userService.myMarkets().subscribe((res: GenericResponse<IMarket>) => {
      // //console.log(res);
      if (res.errorCode === 0) {
        this.myMarkets = res.result
          .filter((market) => market.liability != 0)
          .map((r) => {
            if (+r.sportId == -2) {
              r.sportId = '4';
            }
            if (+r.sportId == 7) {
            }
            return r;
          });
      }
    });
  }


  getMatchOdds(matches: any[],) {
    var ids = [];
    matches.forEach((match, index) => {
      if (match?.markets[0]?.marketName == 'Match Odds' || match?.markets[0]?.marketName == 'Moneyline') {
        ids.push(match.markets[0].marketId);
      }

    });
    // console.log(ids);

    if (ids.length) {
      this.oddsService.getMatchOdds(4, ids.join(',')).subscribe((resp: any) => {
        // console.log(resp)
        matches.forEach((match, index) => {
          resp.forEach((market, index) => {
            if (match.eventId == market.eventId) {
              match['runners'] = market.runners;
              match['status'] = market.status;
            }
          });
        });
        this.dataFormatService.getSportsData(matches);
      }, err => {
        this.dataFormatService.getSportsData(matches);
      });
    }
    // if (ids.length) {
    //   this.oddsService.getMatchOdds1(4, ids.join(',')).subscribe((resp: any) => {
    //     // console.log(resp)
    //     matches.forEach((match, index) => {
    //       resp.forEach((market, index) => {
    //         if (match.eventId == market.eventId) {
    //           match['runners'] = market.runners;
    //           match['status'] = market.status;
    //         }
    //       });
    //     });
    //     this.dataFormatService.getSportsData(matches);
    //   }, err => {
    //     this.dataFormatService.getSportsData(matches);
    //   });
    // }
  }


  onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  iAgree() {
    this.showRulesAgree = false;
    this.settingsService.setRulesAgreement(true);
  }

  onActivate(event) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
  }

  ngOnDestroy() {
    if (this.subSink) {
      this.subSink.unsubscribe();
    }
  }
}
