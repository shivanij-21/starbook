import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
import { DataFormatService } from '../services/data-format.service';
import { GamesService } from '../services/games.service';
import { IEvent } from '../shared/types/event';
import { GenericResponse } from '../shared/types/generic-response';

@Component({
  selector: 'app-live-broadcast',
  templateUrl: './live-broadcast.component.html',
  styleUrls: ['./live-broadcast.component.scss'],
})
export class LiveBroadcastComponent implements OnInit, OnDestroy {
  events: IEvent[];

  sportsMatchList = [];
  sportsData = {};
  subscriptions = new Subscription();
  selectedMatch: any;
  tvBaseUrl = "https://streamingtv.fun/live_tv/index.html";
  tvUrl: SafeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('');

  height = 337;
  constructor(
    private dataFormatService: DataFormatService,
    private gamesService: GamesService,
    private domSanitizer: DomSanitizer,
    private commonService: CommonService

  ) {

    if (
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      ))
    ) {
      this.height = 220;
    } else {
    }
  }

  ngOnInit(): void {

    this.commonService.apis$.subscribe((res) => {
      this.gamesService.listGames().subscribe((res: GenericResponse<any>) => {
        if (res.errorCode === 0) {
          this.dataFormatService.getSportsData(res.result);
        }
      });
      let intervalSub = interval(15000).subscribe(() => {
        this.gamesService.listGames().subscribe((res: GenericResponse<any>) => {
          if (res.errorCode === 0) {
            this.dataFormatService.getSportsData(res.result);
          }
        });
      });
      this.subscriptions.add(intervalSub);

      this.getGamesList();
    });

  }

  getGamesList() {
    this.dataFormatService.sportsData$.subscribe((sportsData) => {
      this.sportsMatchList = Object.values(
        this.dataFormatService.getSportsList(sportsData, 1)
      );
    });
  }

  getStream(match) {
    this.selectedMatch = match;
    this.tvUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      `${this.tvBaseUrl}?eventId=${match.bfId}`
    );
  }

  trackById(item, index) {
    return item.id;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
