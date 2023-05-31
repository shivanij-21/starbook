import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICurrentUser } from '../shared/types/current-user';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ILoginCreds } from '../shared/types/i-login-creds';
import { PChangeCreds } from '../shared/types/P-change-cred';
import { CommonService } from './common.service';
import { TokenService } from './token.service';

export const CURRENT_CLIENT = 'current_client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentAuthState = true;
  baseUrl: string;
  private _currentUserSub = new BehaviorSubject<ICurrentUser>(null);
  currentUser$ = this._currentUserSub.asObservable();

  private _isLoggedInSub = new BehaviorSubject<boolean>(true);
  isLoggedIn$ = this._isLoggedInSub.asObservable();

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private commonService: CommonService,
    private router: Router, private authService: TokenService
  ) {
    let isLoggedIn = tokenService.getToken();
    if (isLoggedIn) {
      this.setLoggedIn(true);
    } else {
      this.setLoggedIn(false);
    }
    let current_client = localStorage.getItem(CURRENT_CLIENT);
    if (current_client) {
      this._currentUserSub.next(JSON.parse(current_client));
    }

    commonService.apis$.subscribe(res => {
      this.baseUrl = res.ip;
    })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let isMaintanance = this.authService.getMaintanance();

    if (isMaintanance == '1') {
      // console.log(isMaintanance)
      this.router.navigate(['/maintenance']);
      return false;
    } else if (isMaintanance == '2') {
      // console.log(isMaintanance)
      // // this.authService.removeToken();
      // this.router.navigate(['/dashboard']);
      return true;
    } else {
      return true;
    }

  }

  login(loginData: ILoginCreds) {
    return this.httpClient.post(`${this.baseUrl}/login`, loginData);
  }

  logout() {
    return this.httpClient.get(`${this.baseUrl}/logout`);
  }

  setCurrentUser(user: ICurrentUser) {
    localStorage.setItem(CURRENT_CLIENT, JSON.stringify(user));
    this.cookieService.put(CURRENT_CLIENT, JSON.stringify(user));
    this._currentUserSub.next(user);
  }

  getCurrentUser() {
    return this._currentUserSub.value;
  }

  setLoggedIn(isLoggedIn: boolean) {
    if (this.currentAuthState !== isLoggedIn) {
      this._isLoggedInSub.next(isLoggedIn);
      this.currentAuthState = isLoggedIn;
    }
    else{

    }
  }

  getLoggedIn() {
    return this._isLoggedInSub.value;
  }

  ping() {
    return this.httpClient.get(`${this.baseUrl}/ping`);
  }
  changePassword(changeData: PChangeCreds) {
    return this.httpClient.post(`${this.baseUrl}/updateUser`, changeData);
  }
}
