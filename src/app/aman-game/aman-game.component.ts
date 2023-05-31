import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-aman-game',
  templateUrl: './aman-game.component.html',
  styleUrls: ['./aman-game.component.scss']
})
export class AmanGameComponent implements OnInit {

  siteName: string = environment.siteName;
  token: any;
  amanUrl: any;
  opentable: any;
  refresh: any = '1234';
  constructor(private tokenService: TokenService, private sanitizer: DomSanitizer, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.opentable = params.opentable;
    })
  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();
    let operatorId = "9463";
    let url = 'https://m2.fawk.app/#/splash-screen/' + this.token + '/' + operatorId + '?' + 'opentable=' + this.opentable + '&' + 'refresh=' + this.refresh;
    this.amanUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}


