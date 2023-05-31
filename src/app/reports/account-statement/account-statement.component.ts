import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ReportsService } from '../reports.service';
import { IAccountStatement } from '../types/account-statement';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss'],
})
export class AccountStatementComponent implements OnInit {
  fromDate;
  toDate;

  today;
  yesterday;

  accountStatement: IAccountStatement[];

  selectedRow: IAccountStatement;
  month;
  constructor(
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {
    this.today = new Date();
    this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    this.month = new Date(new Date().setDate(new Date().getDate() - 30));
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(new Date().getDate() - 1);
    this.fromDate = new Date(date);
    this.toDate = new Date();

    // this.fromDate = datePipe.transform(
    //   new Date().setDate(new Date().getDate() - 1),
    //   'yyyy-MM-dd HH:mm:ss'
    // );

    // this.toDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }
  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.getAccountStatement();
    });
  }

  getAccountStatement() {
    // console.log(
    // 'From date',
    //   this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss')
    // );

    this.reportsService
      .getAccountStatement(
        this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss'),
        this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss')
      )
      .subscribe((res: GenericResponse<IAccountStatement>) => {
        // //console.log(res);
        this.accountStatement = res.result.reverse();;
             this.accountStatement?.forEach((user) => {
          if (user.narration.includes("Deposit")&& !user.narration.includes('Poker') ) {
            user.narration = 'Deposit by Upline';
          }
          if (user.narration.includes("Withdrawal") && !user.narration.includes('Poker')) {
            user.narration = 'Withdraw from Upline';
          }
        });

        // let marketsIdMap = {};
        // this.accountStatement.forEach((stat) => {
        //   if (marketsIdMap[stat.marketId]) {
        //     marketsIdMap[stat.marketId].credit += stat.credit
        //     marketsIdMap[stat.marketId].debit += stat.debit
        //     marketsIdMap[stat.marketId].bets.push(stat);
        //     marketsIdMap[stat.marketId].runningBalance = stat.runningBalance;
        //   } else {
        //     marketsIdMap[stat.marketId] = {
        //       ...stat,
        //       bets: [stat]
        //     };
        //   }
        // })
        // console.log(marketsIdMap);
        // this.accountStatement = Object.values(marketsIdMap);

        this.accountStatement.sort((a, b) => {
          return +b.vouchertId - +a.vouchertId;
        });
      });
  }

  getSubOrders(item: IAccountStatement) {
    // console.log(item);

    this.selectedRow = item;
  }

  getPreviousPage() {
    this.selectedRow = null;
  }
}
