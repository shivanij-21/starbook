import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],
})
export class ChangepasswordComponent implements OnInit, OnDestroy {
  changeForm;
  timeoutRef: any;
  nextCall$ = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private tokenService: TokenService,

  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Change Password');
    this.changeForm = this.formBuilder.group({
      pwd: ['', Validators.required],
      newpwd: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  getProfile() {
    let accountInfo = this.tokenService.getUserInfo();
    if (accountInfo) {
      if (accountInfo.newUser == 1) {
        this.router.navigateByUrl('/changepassword');
      }
    }
  }

  changePassword() {
    if (
      this.changeForm.value.newpwd.localeCompare(
        this.changeForm.value.confirmPassword
      ) == 0
    ) {
      delete this.changeForm.value.confirmPassword;
      // console.log('valueform', this.changeForm.value);
      this.authService
        .changePassword(this.changeForm.value)
        .subscribe((res: GenericResponse<any>) => {
          // //console.log(res);
          if (res.errorCode == 0) {
            this.toastr.success('Password updated');
            // console.log('password changed');
            this.logout();
            let accountInfo = this.tokenService.getUserInfo();
            if (accountInfo) {
              accountInfo.newUser = 0;
              this.tokenService.setUserInfo(accountInfo);
            }
          } else {
            document.getElementById('CompareValidator1').style.visibility =
              'visible';
            document.getElementById(
              'RegularExpressionValidator1'
            ).style.visibility = 'hidden';
          }
        });
    } else {
      document.getElementById('RegularExpressionValidator1').style.visibility =
        'visible';
      document.getElementById('CompareValidator1').style.visibility = 'hidden';
      // console.log('Not Same');
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutRef);
  }
}
