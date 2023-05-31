import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { ICurrentUser } from '../shared/types/current-user';

@Component({
  selector: 'app-casinoiframe',
  templateUrl: './casinoiframe.component.html',
  styleUrls: ['./casinoiframe.component.scss']
})
export class CasinoiframeComponent implements OnInit {

  siteName: string = environment.siteName;
  opentable: any;
  refresh: any = '1234';

  iframe: any;
  iframeurl: any;
  unno: any = '9463';
  casinotoken: any;
  token: any;
  loader: boolean = false;
  context = "mobile";
  currentUser: ICurrentUser;

  constructor(private tokenService: TokenService, private sanitizer: DomSanitizer,
    private authService: AuthService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.opentable = params.opentable;
    })

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.context = "mobile";
    } else {
      this.context = "web";
    }

  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.token = this.tokenService.getToken();
    this.casinotoken = (btoa(this.token))
    // console.log (this.casinotoken)
    let url;

    // let url = 'https://d2.fawk.app/#/splash-screen/' + this.token + '/' + this.unno + '?' + 'opentable=' + this.opentable + '&' + 'refresh=' + this.refresh;
    if (this.context == 'web') {
      url = 'https://d2.fawk.app/#/splash-screen/' + this.token + '/' + this.unno;

    } else {
      url = 'https://m2.fawk.app/#/splash-screen/' + this.token + '/' + this.unno;

    }

    this.iframe = url;
    this.iframeurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframe);
    $('#page_loading').css('display', 'none');
    this.loader = true;
  }

}
