import { DatePipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ReportsService } from '../reports.service';
import { IBetHistory } from '../types/bet-history';

@Component({
  selector: 'app-exch-games-bets',
  templateUrl: './exch-games-bets.component.html',
  styleUrls: ['./exch-games-bets.component.scss'],
})
export class ExchGamesBetsComponent implements OnInit {
  fromDate;
  toDate;
  yesterday;
  betStatusList = [
    { id: 4, name: 'All' },
    { id: 1, name: 'Settled' },
    { id: 3, name: 'Voided' },
  ];
  selectedBetStatus = this.betStatusList[0];
  betHistory: IBetHistory[];
  month: Date;
  constructor(
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    @Inject(DOCUMENT) private _document: Document,
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
      this.getBetHistory();
    });
  }

  getBetHistory() {
    this.reportsService
      .getBetHistory(
        this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss'),
        this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss'),
        this.selectedBetStatus.id
      )
      .subscribe((res: GenericResponse<IBetHistory>) => {
        if (res.errorCode === 0) {
          this.betHistory = res.result.filter((bet) =>
            bet.sportName.toLowerCase().includes('exchange')
          );
          this.betHistory.sort((a, b) => {
            return Date.parse(b.betTime) - Date.parse(a.betTime);
          });
        } else {
          this.betHistory = [];
        }
      });
  }

  showIp(event: Event, id) {
    event.preventDefault();

    (<HTMLElement>event.target).style.display = 'none';
    let el = this._document.getElementById(id);
    el.style.display = 'block';
  // console.log(event.target, el);
  }
}
