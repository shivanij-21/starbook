import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ReportsService } from '../reports.service';
import { IActivityLog } from '../types/activity-log';

@Component({
  selector: 'app-activies',
  templateUrl: './activies.component.html',
  styleUrls: ['./activies.component.scss'],
})
export class ActiviesComponent implements OnInit {
  ActivityDataList = [];
  loginStatusMap = {
    1: 'Login Successful',
    2: 'Logout',
    0: 'Login Faled',
  };
  constructor(
    private reportsService: ReportsService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.getActivityLog();
    });
  }

  getActivityLog() {
    this.reportsService
      .getActivityLog()
      .subscribe((res: GenericResponse<IActivityLog>) => {
      // //console.log(res);
        if (res.errorCode === 0) {
          this.ActivityDataList = res.result
            .sort((a, b) => {
              return Date.parse(b.loginTime) - Date.parse(a.loginTime);
            })
            .slice(0, 15);
        } else {
          this.ActivityDataList = [];
        }
      });
  }
}
