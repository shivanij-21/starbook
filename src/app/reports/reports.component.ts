import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { IBalance } from '../shared/balance';
import { ICurrentUser } from '../shared/types/current-user';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  siteName = environment.siteName;

  currentUser: ICurrentUser;
  isHide: boolean = false;
  url: boolean = true;
  balanceData: IBalance;

  subSink = new Subscription();
  sunButton: boolean;
  moonButton: boolean;
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private titleService: Title,
    private router: Router,
    private mediaMatcher: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonService,
    private tokenService: TokenService
  ) {
    if (this.tokenService.getTheme()) {
      this.toggleDarkTheme()
    } else {
      this.removeTheme()

    }

    this.isHide = window.innerWidth < 800 ? true : false;
    this.mobileQuery = this.mediaMatcher.matchMedia('(min-width: 800px)');
    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();

      this.isHide = !this.mobileQuery.matches;
    // console.log(this.isHide);
    };
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    if (this.router.url.includes('/changepass')) {
      this.isHide = true;
    }

    this.commonService.apis$.subscribe(() => {
      this.userService.getBalance();
      this.userService.getBets();
    });

    this.userService.balance$.subscribe((res) => {
      this.balanceData = res;
    });
    this.titleService.setTitle('Exchange|Reports');
    this.subSink.add(
      this.authService.currentUser$.subscribe((currentUser) => {
        this.currentUser = currentUser;
      })
    );
  }

  
  // toggleDarkTheme(): void {
  //   document.body.classList.toggle('dark-theme');
  // }

    toggleDarkTheme() {
    let bodytag = document.getElementsByTagName("BODY")[0];
    bodytag.classList.add('light-theme');
    this.tokenService.setTheme('light-theme')
    this.sunButton = true
    this.moonButton = false

  }

  removeTheme() {
    this.tokenService.removeTheme();
    let bodytag = document.getElementsByTagName("BODY")[0];
    bodytag.classList.remove('light-theme');
    this.moonButton = true
    this.sunButton = false
  }
  toggleSidebar() {
    this.isHide = !this.isHide;
  }

  getBalance() {
    this.userService.getBalance();
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    this.subSink.unsubscribe();
  }
}
