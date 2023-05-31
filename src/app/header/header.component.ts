import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { OddsServiceService } from '../services/odds-service.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { IBalance } from '../shared/balance';
import { ICurrentUser } from '../shared/types/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { ITicker } from './types/ticker';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  siteName = environment.siteName;

  isDropdownOpen: boolean = false;
  currentUser: ICurrentUser;
  balanceData: IBalance;
  tickers: ITicker[];

  @Input() isOpen: boolean = true;
  @Output() isOpenEvent = new EventEmitter<boolean>();
  sunButton: boolean;
  moonButton: boolean;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  ticker1: any = null;
  subSink = new Subscription();
  accountInfo: any;
  selectedLatest: boolean;
  selectedTab: any;
  constructor(
    private shareDataService: ShareDataService,
    private userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private mediaMatcher: MediaMatcher,
    private commonService: CommonService,
    private oddsService: OddsServiceService,

  ) {
    if (this.tokenService.getTheme()) {
      this.toggleDarkTheme()
    } else {
      this.removeTheme()

    }

    this.isOpen = window.innerWidth > 800 ? true : false;
    this.mobileQuery = this.mediaMatcher.matchMedia('(min-width: 800px)');

    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
      this.isOpen = this.mobileQuery.matches;
      this.isOpenEvent.emit(this.isOpen);
    };
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }


  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.userService
        .getTicker()
        .subscribe((res: GenericResponse<ITicker>) => {
          if (res?.errorCode === 0) {
            this.tickers = res.result.map((t) => {
              t.ticker = atob(t.ticker);
              return t;
            });
          } else {
            this.tickers = [];
          }
        });

      this.getTickerVrnl();
    });
    this.userService.balance$.subscribe((balanceData) => {
      this.balanceData = balanceData;
    });
    this.authService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.QuitCasino(null);

    });

    if (this.currentUser.newUser == 1) {
      this.router.navigateByUrl('/changepassword');

    }

    let tickerInterval = interval(60000).subscribe((res) => {
      this.getTickerVrnl();
    });
    let changepassInterval = interval(3000).subscribe((res) => {
      if (this.currentUser.newUser == 1) {
        this.router.navigateByUrl('/changepassword');

      }
    });
    this.subSink.add(tickerInterval);
    this.subSink.add(changepassInterval);
    this.isOpenEvent.emit(this.isOpen);
  }

  UserDescription() {
    this.accountInfo = this.tokenService.getUserInfo();

  }

  getBalance() {
    // this.QuitCasino();
    this.userService.balance().subscribe((res: GenericResponse<IBalance>) => {
      this.balanceData = res.result[0];
    });
  }

  QuitCasino(click) {
    this.oddsService.QuitCasino(this.currentUser.userName, this.currentUser.userId).subscribe((resp: any) => {
      // console.log(resp);

      setTimeout(() => {
        if (click) {
          this.getBalance();
        }
      }, 300)
      // if (resp.errorCode == 0) {

      // }
    }, err => {
    })
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.isOpenEvent.emit(this.isOpen);
  }

  // toggleDarkTheme(): void {
  //   document.body.classList.toggle('dark-theme');
  // }


  toggleDarkTheme() {
    let bodytag = document.getElementsByTagName("BODY")[0];
    bodytag.classList.add('light-theme');
    $(".c-theme-btn").addClass("is-active");
    this.tokenService.setTheme('light-theme')
    this.sunButton = true
    this.moonButton = false

  }
  removeTheme() {
    this.tokenService.removeTheme();
    let bodytag = document.getElementsByTagName("BODY")[0];
    bodytag.classList.remove('light-theme');
    $(".c-theme-btn").removeClass("is-active");
    this.moonButton = true
    this.sunButton = false
  }

  logout() {
    this.authService.setLoggedIn(false);
    this.router.navigateByUrl('/login');
    this.authService
      .logout()
      .pipe(
        finalize(() => {
          this.tokenService.setToken(null);
        })
      )
      .subscribe(() => {
        this.tokenService.setToken(null);
        this.toastr.success('Logged Out Successfully');
      });
  }

  
  getTickerVrnl() {
    this.userService.getTickerVrnl().subscribe((res) => {
      this.ticker1 = res;
      // console.log(this.ticker1);

    });
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    this.subSink.unsubscribe();
  }
}
