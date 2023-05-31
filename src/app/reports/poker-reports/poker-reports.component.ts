import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-poker-reports',
  templateUrl: './poker-reports.component.html',
  styleUrls: ['./poker-reports.component.scss']
})
export class PokerReportsComponent implements OnInit {
    fromDate;
    toDate;
    yesterday;
    month: Date;
    pokerHistory=[];
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
        .PokerBetHistory(
          this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss'),
          this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss')
        )
        .subscribe((res: any) => {
          if (res.errorCode === 0) {
            this.pokerHistory = res.result;;
          } else {
            this.pokerHistory = [];
          }
        });
    }
  }
