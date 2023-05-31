import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

export const AUTH_TOKEN = 'authtoken_web';
export const USER_INFO = 'UserInfo';
export const THEME = 'theme';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) { }

  setToken(token: string) {
    this.cookieService.put(AUTH_TOKEN, token);
  }

  setUserInfo(userInfo) {
    this.cookieService.put(USER_INFO, JSON.stringify(userInfo));
    localStorage.setItem(USER_INFO, JSON.stringify(userInfo));

  }

  getUserInfo() {
    if (this.getLocalUserInfo()) {
      return this.getLocalUserInfo();
    } else {
      return this.cookieService.get(USER_INFO) ? JSON.parse(this.cookieService.get(USER_INFO)) : null;
    }
  }

  getLocalUserInfo() {
    return localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : null;
  }

  setTheme(theme){
    localStorage.setItem(THEME, theme);
  }
  getTheme() {
    return localStorage.getItem(THEME);
  }
  removeTheme(){
    localStorage.removeItem(THEME);
  }

  getToken() {
    return this.cookieService.get(AUTH_TOKEN);
  }

  removeToken() {
    this.cookieService.remove(AUTH_TOKEN);
  }

  setMaintanance(value) {
    this.cookieService.put('isMaintanance', value);
  }
  getMaintanance() {
    return this.cookieService.get('isMaintanance');
  }
  removeMaintanance() {
    this.cookieService.remove('isMaintanance');
  }
}
