import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GamesService } from '../services/games.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-poker-casino',
  templateUrl: './poker-casino.component.html',
  styleUrls: ['./poker-casino.component.scss']
})
export class PokerCasinoComponent implements OnInit {
    pokerUrl:SafeResourceUrl;
    accountInfo: any;
  
    constructor(        
      private tokenService: TokenService,
      private games: GamesService,
      private sanitizer: DomSanitizer
      ) { }
  
    ngOnInit(): void {
      this.accountInfo = this.tokenService.getUserInfo();
      this.getPokerLobby();
    }
  
    ngOnDestroy():void{
      this.quitPoker();
    }
  
    getPokerLobby(){
      $('#page_loading').css('display', 'flex');
      let authData = {
        "userName":this.accountInfo.userName,
        "userId":this.accountInfo.userId
      }
      this.games.pokerAuth(authData).subscribe((resp: any)=>{
        console.log(resp);
        if(resp.errorCode==0){
          this.pokerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp.lobbyUrl);
        }
        $('#page_loading').css('display', 'none');
      })
    }
  
    quitPoker(){
      $('#page_loading').css('display', 'flex');
      let authData = {
        "userName":this.accountInfo.userName,
        "userId":this.accountInfo.userId
      }
      this.games.pokerQuit(authData).subscribe((resp: any)=>{
        console.log(resp);
        $('#page_loading').css('display', 'none');
      })
    }
  
  }
