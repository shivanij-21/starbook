import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { DataFormatService } from 'src/app/services/data-format.service';
import { OddsServiceService } from 'src/app/services/odds-service.service';

@Component({
  selector: 'app-inplay',
  templateUrl: './inplay.component.html',
  styleUrls: ['./inplay.component.scss'],
})
export class InplayComponent implements OnInit, OnDestroy {
  inplay;
  inplayListData;
  inplayRunnerData = {};

  collapseMap = {};
  matchDataHome: any;
  sportsDataVal: boolean = false;
  intervalSub: Subscription;
  constructor(
    private dataformatService: DataFormatService,
    private oddsService: OddsServiceService
  ) { }

  ngOnInit(): void {
    this.dataformatService.sportsData$.subscribe((sportsData) => {
      this.inplayListData = this.dataformatService
        .inplaylistwise(sportsData, 0)
        .map((inplay) => {
          if (!(inplay.bfId in this.collapseMap)) {
            this.collapseMap[inplay.bfId] = true;
          }
          return inplay;
        }).reverse();

      if (sportsData && !this.sportsDataVal) {
        this.inplayListData.forEach((sport: any) => {
          this.getOdds(sport);
        });
        this.sportsDataVal = true;
      }
    });
    this.intervalSub = new Subscription();
    this.intervalSub = interval(60000).subscribe(() => {
      this.inplayListData.forEach((sport: any) => {
        this.getOdds(sport.bfId);
      });
    });
  }

  getOdds(sport) {
    if (sport.bfId == 52 || sport.bfId == 85) {
      return;
    }
    var ids = [];
    sport.inplayData?.forEach((match) => {
      ids.push(match.bfId);
    })
    if (ids?.length) {
      this.oddsService
        .getMatchOdds(sport.bfId, ids.join(','))
        .subscribe((res: any[]) => {
          res?.forEach((market) => {
            this.inplayRunnerData[market.eventId] = market;
          });
        });
    }
    // if (ids?.length) {
    //   this.oddsService
    //     .getMatchOdds1(sport.bfId, ids.join(','))
    //     .subscribe((res: any[]) => {
    //       res?.forEach((market) => {
    //         this.inplayRunnerData[market.eventId] = market;
    //       });
    //     });
    // }
  }

  trackByFn(item, index) {
    return item.matchId;
  }

  ngOnDestroy() {
    this.intervalSub.unsubscribe();
  }
}
