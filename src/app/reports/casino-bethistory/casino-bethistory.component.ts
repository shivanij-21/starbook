import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ReportsService } from '../reports.service';


@Component({
  selector: 'app-casino-bethistory',
  templateUrl: './casino-bethistory.component.html',
  styleUrls: ['./casino-bethistory.component.scss']
})
export class CasinoBethistoryComponent implements OnInit {

  BETSTATUS = "1";
  stype = '';
  bets = []
  betId: number;

  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;

  loader: boolean = false;
  betstatus: any;
  bettingHistory: any = [];
  month;
  fromDate;
  toDate;
  yesterday;
  today: Date;


  constructor(
    private reportService: ReportsService,
    private commonService: CommonService,
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
      this.GetBetHistory();
    });
  }

  selectTab(input) {
    if (input == 'today') {
      this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    } else {
      this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

    }
    this.GetBetHistory();
  }

  changeSport(stype) {
    this.stype = stype;
    this.GetBetHistory();
  }

  GetBetHistory() {
    this.bets = [];
    this.loader = true;
    let STYPE = this.stype;
    $('#loading').css('display', 'block');
    this.reportService.CasinoBetHistory(
      this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss'),
      this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss'), this.BETSTATUS).subscribe(
      (resp: any) => {
        this.betstatus = this.BETSTATUS
        this.bettingHistory = resp.result;
        console.log(this.bettingHistory);
        this.loader = false;
        $('#loading').css('display', 'none');
      },
    );
  }

  getFromDateAndTime() {
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }

  getBetType(bet) {
    let betType = "";
    if (bet.type == "Lagai(B)") {
      betType = 'back';
      bet.betType = 'back';

    } else {
      betType = 'lay';
      bet.betType = 'lay';
    }
    return betType;
  }

  toggleTx(betId) {
    this.betId = betId;

  }

}
