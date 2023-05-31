import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../services/games.service';
import { OddsServiceService } from '../services/odds-service.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-supernowa-casino',
  templateUrl: './supernowa-casino.component.html',
  styleUrls: ['./supernowa-casino.component.scss']
})
export class SupernowaCasinoComponent implements OnInit {
  supernowaUrl:SafeResourceUrl;
  gameCode:string;
  token:string;
  providerCode: string;


  constructor(private tokenService: TokenService, private sanitizer: DomSanitizer, private route: ActivatedRoute,private games: GamesService,) { 
  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();
    this.route.params.subscribe(params => {
      this.gameCode = params.gameCode;
      this.providerCode = params.providerCode;
      let backurldomain = window.origin;
      let authData= {"token":this.token,"gameCode":this.gameCode, "providerCode": this.providerCode,"backUrl": backurldomain }
      this.games.supernowaAuth(authData).subscribe((resp: any)=>{
        console.log(authData);
        if(resp.status.code == "SUCCESS"){
          this.supernowaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp.launchURL);
        }
      })
    })
  }

}
