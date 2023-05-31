import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../services/games.service';
import { OddsServiceService } from '../services/odds-service.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-supernowa-change',
  templateUrl: './supernowa-change.component.html',
  styleUrls: ['./supernowa-change.component.scss']
})
export class SupernowaChangeComponent implements OnInit {
  supernowaUrl: SafeResourceUrl;
  gameCode: string;
  providerCode: string;
  token: string;

  constructor(private tokenService: TokenService, private sanitizer: DomSanitizer, private route: ActivatedRoute,private oddservice: OddsServiceService,) { 
    $('#page_loading').css('display', 'block');
  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();
      this.route.params.subscribe(params => {
        this.gameCode = params.gameCode;
        this.providerCode = params.providerCode;
        let backurldomain = window.origin;
        let authData = { "token": this.token, "gameCode": this.gameCode, "providerCode": this.providerCode, "backUrl": backurldomain }
        this.oddservice.supernowaAuth(authData).subscribe((resp: any) => {
          // console.log(resp);
          if (resp.status.code == "SUCCESS") {
            this.supernowaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp.launchURL);
          }
          $('#page_loading').css('display', 'none');
        },
          error => {
            $('#page_loading').css('display', 'none');
            console.log(error);
          })
      })
  }

}
