import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ExchGamesService } from '../services/exchgames.service';
import { UserService } from 'src/app/services/user.service';
import { IBalance } from 'src/app/shared/balance';
import { ICurrentUser } from 'src/app/shared/types/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { CommonService } from 'src/app/services/common.service';
import { IApis } from 'src/app/shared/types/apis';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {

  siteName = environment.siteName;

  rootUrl: string = '/';

  balanceData: IBalance;
  currentUser: ICurrentUser;
  subSink = new Subscription();
  constructor(
    public userService: UserService,
    private authService: AuthService,
    private gamesService: ExchGamesService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.rootUrl = window.location.origin;
    this.authService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });

    this.commonService.getApis().subscribe((res: IApis) => {
      this.commonService.apis$.next(res);
    });
    this.commonService.apis$.subscribe((res) => {
      // this.gamesService.listGames().subscribe((res: any) => {
      // // //console.log(res);
      // });
      this.userService.getBalance();
      this.userService.getBets();
      this.authService.ping().subscribe(() => {});
    });
    this.userService.balance$.subscribe((balanceData) => {
      this.balanceData = balanceData;
    });

    let pingInterval = interval(5000).subscribe(() => {
      this.authService.ping().subscribe((res: GenericResponse<IBalance>) => {
        if (res && res.errorCode == 0) {
          this.userService.setBalance(res.result[0]);
        }
      });
    });
    this.subSink.add(pingInterval);
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
