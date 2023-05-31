import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { ITicker } from '../header/types/ticker';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { ShareDataService } from '../services/share-data.service';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { GenericResponse } from '../shared/types/generic-response';

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.scss']
})
export class MarqueeComponent implements OnInit {
  tickers: ITicker[];
  ticker1: any = null;
  subSink = new Subscription();

  constructor(
    private userService: UserService,
    private commonService: CommonService
  ) { 
 
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
    
    let tickerInterval = interval(60000).subscribe((res) => {
      this.getTickerVrnl();
    });
    this.subSink.add(tickerInterval);

  }

  getTickerVrnl() {
    this.userService.getTickerVrnl().subscribe((res) => {
      this.ticker1 = res;
      // console.log(this.ticker1);

    });
  }

  openAnnouncementPopUp() {
    $('#announcementPopUp').css('display', 'flex')
  }
  closeAnnouncementPopUp() {
    $('#announcementPopUp').css('display', 'none')
  }
  
  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
