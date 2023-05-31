import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl: string = environment.baseUrl;
  constructor(private httpClient: HttpClient, private commonService: CommonService) {
    this.commonService.apis$.subscribe((res) => {
      this.baseUrl = res.ip
    })
  }
  getImg() {
    return this.httpClient.get(`${this.baseUrl}/img.png/`);
  }
}
