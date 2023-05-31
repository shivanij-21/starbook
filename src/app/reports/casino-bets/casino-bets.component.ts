import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ReportsService } from '../reports.service';
import { IBetHistory } from '../types/bet-history';

@Component({
  selector: 'app-casino-bets',
  templateUrl: './casino-bets.component.html',
  styleUrls: ['./casino-bets.component.scss'],
})
export class CasinoBetsComponent implements OnInit {
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
    this.commonService.apis$.subscribe((res) => {
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
          this.betHistory = res.result.filter((bet) => bet.round);
        } else {
          this.betHistory = [];
        }
      });
  }
}
