import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ReportsService } from '../reports.service';
import { IProfitLoss } from './types/pnl';
import { ISportPnl } from './types/sport-pnl';

class BetWiseTotal {
  totalPL: number = 0;
  commission: number = 0;
  netPL: number = 0;

  month: Date;
  constructor() {}
}

@Component({
  selector: 'app-pnl',
  templateUrl: './pnl.component.html',
  styleUrls: ['./pnl.component.scss'],
})
export class PnlComponent implements OnInit {
  fromDate;
  toDate;
  yesterday;
  month;

  sportsMap = new Map<string, ISportPnl>();
  sportWiseTotal: number = 0;
  totalMkt;

  profitLoss: any;
  marketsMap = new Map<string, IProfitLoss>();
  betwiseTotal = new BetWiseTotal();
  selectedSportPnl: ISportPnl;
  selectedMarketPnl: IProfitLoss;
  marketTotal: number = 0;
  constructor(
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(new Date().getDate() - 1);
    this.fromDate = new Date(date);
    this.toDate = new Date();
    this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    this.month = new Date(new Date().setDate(new Date().getDate() - 30));
  }

  ngOnInit(): void {
    this.commonService.apis$.subscribe(() => {
      this.getProfitLoss();
    });
  }

  getProfitLoss() {
    this.reportsService
      .getProfitLoss(
        this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss'),
        this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss')
      )
      .subscribe((res: GenericResponse<any>) => {
        if (res.errorCode === 0) {
          this.selectedSportPnl = null;
          this.selectedMarketPnl = null;
          this.sportsMap = new Map<string, ISportPnl>();
          res.result.forEach((pnl: IProfitLoss) => {
            let sportPnl = this.sportsMap.get(pnl.sportName);
            if (sportPnl) {
              this.sportsMap.set(pnl.sportName, {
                sportName: pnl.sportName,
                totalPL: sportPnl.totalPL + +pnl.netPL,
                markets: [...sportPnl.markets, pnl],
              });
            } else {
              this.sportsMap.set(pnl.sportName, {
                sportName: pnl.sportName,
                totalPL: +pnl.netPL,
                markets: [pnl],
              });
            }
            // this.sportsMap.set(pnl.sportName, pnl);
          });

          this.sportWiseTotal = 0;
          Array.from(this.sportsMap.values()).forEach((sport) => {
            this.sportWiseTotal += +sport.totalPL;
          });
        // console.log(this.sportsMap);
        }
      });
  }

  get sportWisePnl() {
    return Array.from(this.sportsMap.values());
  }

  openDetail(sportPnl?: ISportPnl, marketPnl?: IProfitLoss) {
    this.selectedSportPnl = sportPnl ? sportPnl : null;
    if (sportPnl) {
      this.selectedSportPnl = sportPnl;
      this.marketTotal = 0;
      this.selectedSportPnl.markets.forEach((pnl: IProfitLoss) => {
        this.marketTotal += +pnl.netPL;
      });
    } else {
      this.selectedSportPnl = null;
    }
    if (marketPnl) {
      this.selectedMarketPnl = marketPnl;
    // console.log(marketPnl);
      this.betwiseTotal = new BetWiseTotal();
      this.selectedMarketPnl.bets.forEach((bet) => {
        this.betwiseTotal.totalPL += +bet.pl;
        this.betwiseTotal.commission += +bet.commission;
        this.betwiseTotal.netPL += +bet.netPl;
      });
    }
  }

  getPreviousPage(sportPnl?: ISportPnl, marketPnl?: IProfitLoss) {
    this.selectedSportPnl = sportPnl ? sportPnl : null;
    this.selectedMarketPnl = null;
  }
}
