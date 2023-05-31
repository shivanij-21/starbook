import { Component, OnInit } from '@angular/core';
import { IStake, SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
})
export class StakeComponent implements OnInit {
  stakeList: IStake[];
  result = '';
  constructor(
    private settingsService: SettingsService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.settingsService.stakeList$.subscribe((stakeList) => {
      this.stakeList = stakeList;
    })
  }

  editStakeSettings() {
    let stakeSettingData = [];

    this.stakeList.forEach((element, index) => {
      stakeSettingData.push(element.stake);
    });
    this.userService.stakeSetting(stakeSettingData.toString()).subscribe((resp: any) => {
      // console.log(resp)
      if (resp.errorCode == 0) {
        this.settingsService.setStakeList(this.stakeList);
        // this.toastr.success('Stake value saved');
      } else {
        // this.toastr.error('Something went wrong');
      }
      this.result = 'success';

    })

  }
}
