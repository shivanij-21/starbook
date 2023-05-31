import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../reports.service';
import { TokenService } from 'src/app/services/token.service';
import * as _ from 'lodash';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sncasino-profitloss',
  templateUrl: './sncasino-profitloss.component.html',
  styleUrls: ['./sncasino-profitloss.component.scss']
})
export class SncasinoProfitlossComponent implements OnInit {

  userInfo: any;

  ProfitLoss = [];
  totalPnl = 0;
  srNo: any;
  stype = '';

  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;

  loader: boolean = false;
  month;
  fromDate;
  toDate;
  yesterday;
  today: Date;

  constructor(
    private reportService: ReportsService,
    private commonService: CommonService,
    private tokenService: TokenService,
    private datePipe: DatePipe,

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
  }

  ngOnInit() {
    this.commonService.apis$.subscribe((res) => {
      this.UserDescription();
      this.GetProfitLoss();
    });
  }

  UserDescription() {
    this.userInfo = this.tokenService.getUserInfo();
  }

  selectTab(input) {
    if (input == 'today') {
      this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

    } else {
      this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

    }
    this.GetProfitLoss();
  }

  changeSport(stype) {
    this.stype = stype;
    this.GetProfitLoss();
  }

  GetProfitLoss() {
    this.ProfitLoss = [];
    this.srNo = null;
    this.totalPnl = 0;
    this.loader = true;
    $('#loading').css('display', 'block');


    this.reportService.SNCasinoProfitLoss(
      this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss'),
      this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss'),
    ).subscribe(
      (resp: any) => {
        if (this.stype == '') {
          this.ProfitLoss = resp.result;
        } else {
          this.ProfitLoss = [];
        }

        _.forEach(this.ProfitLoss, (market) => {
          this.totalPnl = this.totalPnl + market.PL;
          market['totalStakes'] = 0;
          market['backTotal'] = 0;
          market['layTotal'] = 0;
          market['mktPnl'] = 0;

          _.forEach(market.bets, (bet) => {
            market.totalStakes += +bet.stake;
            if (bet.betType === 'back' || bet.betType === 'yes') {
              market.backTotal += +bet.pl;
            } else if (bet.betType === 'lay' || bet.betType === 'no') {
              market.layTotal += +bet.pl;
            }
            market.mktPnl += +bet.pl;
          });
          // this.totalComm = this.totalComm + element.commission;
          // this.eventName = this.bets + element.eventName
        });
        // this.totalPnl = resp.total;

        //console.log(this.ProfitLoss)
        this.loader = false;
        $('#loading').css('display', 'none');
      },
      (err) => {
        if (err.status == 401) {
          //this.toastr.error("Error Occured");
        }
      }
    );
  }

  toggleDetail(srNo) {
    this.srNo = srNo;
  }

  getFromDateAndTime() {
    // return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1
      }-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;
  }
  getToDateAndTime() {
    // return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1
      }-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }

  getBetType(bet) {
    let betType = '';
    if (bet.type == 'back' || bet.type == 'yes') {
      betType = 'back';
    } else {
      betType = 'lay';
    }
    return betType;
  }

}
