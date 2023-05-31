import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { GamesService } from '../services/games.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-awclist',
  templateUrl: './awclist.component.html',
  styleUrls: ['./awclist.component.scss']
})
export class AwclistComponent implements OnInit {

  @ViewChild('tab1', { read: ElementRef }) public tab: ElementRef<any>;

  accountInfo: any;
  awccasinoList = [
    { "platform": "E1SPORT", "gameType": "ESPORTS", "gameCode": "E1-ESPORTS-001", "gameName": "eSports" },
    { "platform": "SV388", "gameType": "LIVE", "gameCode": "SV-LIVE-001", "gameName": "CockFight" },
    { "platform": "SEXYBCRT", "gameType": "LIVE", "gameCode": "MX-LIVE-001", "gameName": "Baccarat Classic" },
    { "platform": "KINGMAKER", "gameType": "SLOT", "gameCode": "KM-SLOT-001", "gameName": "Sugar Blast" },
    { "platform": "JILI", "gameType": "FH", "gameCode": "JILI-FISH-001", "gameName": "Royal Fishing" },
    { "platform": "HORSEBOOK", "gameType": "LIVE", "gameCode": "HRB-LIVE-001", "gameName": "Horsebook" },
    { "platform": "JDBFISH", "gameType": "FH", "gameCode": "JDB-FISH-002", "gameName": "CaiShenFishing" },
    { "platform": "JDB", "gameType": "SLOT", "gameCode": "JDB-SLOT-001", "gameName": "Burglar" },
    { "platform": "FC", "gameType": "EGAME", "gameCode": "FC-EGAME-001", "gameName": "MONEY TREE DOZER" },
    { "platform": "FASTSPIN", "gameType": "SLOT", "gameCode": "FastSpin-SLOT-001", "gameName": "Royale House" },
    { "platform": "LUCKYPOKER", "gameType": "TABLE", "gameCode": "LUCKYPOKER-TABLE-001", "gameName": "Gao Gae" },
    { "platform": "LUDO", "gameType": "TABLE", "gameCode": "LUDO-TABLE-001", "gameName": "LUDO" },
    { "platform": "PG", "gameType": "SLOT", "gameCode": "PG-SLOT-001", "gameName": "Honey Trap of Diao Chan" },
    { "platform": "PP", "gameType": "LIVE", "gameCode": "PP-LIVE-001", "gameName": "Baccarat 1" },
    { "platform": "PT", "gameType": "LIVE", "gameCode": "PT-LIVE-001", "gameName": "Baccarat" },
    { "platform": "RT", "gameType": "SLOT", "gameCode": "RT-SLOT-001", "gameName": "AncientScript" },
    { "platform": "SABA", "gameType": "VIRTUAL", "gameCode": "SABA-VIRTUAL-001", "gameName": "Virtual Sports" },
    { "platform": "FASTSPIN", "gameType": "SLOT", "gameCode": "FastSpin-SLOT-021", "gameName": "Oceanic Melodies" },
    { "platform": "SPADE", "gameType": "EGAME", "gameCode": "SG-EGAME-001", "gameName": "DerbyExpress" },
    { "platform": "VENUS", "gameType": "LIVE", "gameCode": "VN-LIVE-001", "gameName": "Baccarat Classic" },
    { "platform": "YESBINGO", "gameType": "BINGO", "gameCode": "YesBingo-BINGO-001", "gameName": "WinCaiShen" },
    { "platform": "YL", "gameType": "EGAME", "gameCode": "YL-EGAME-002", "gameName": "Gold Shark" },
  ];
  listawc: { platform: string; gameType: string; gameCode: string; gameName: string; };
  AWClists: any;
  awclists: any;
  data: any[];
  awcGames: any;
  awcPlatform: any;
  constructor(
    private game: GamesService,
    private tokenService: TokenService,
    private main: CommonService
  ) { }

  ngOnInit(): void {
    

    this.accountInfo = this.tokenService.getUserInfo();
    if (this.tokenService.getToken()) {
      this.main.apis$.subscribe((res) => {
        this.AWCList();
      });
    }
  }

  AWCList() {
    this.game.awclist().subscribe((resp: any) => {
      this.AWClists = resp.result
      this.AWClists.forEach(element => {
        if(element.Platform == 'KINGMAKER'){
          this.AWCFilter(element)
        }        
      });
      
    })
  }
  AWCFilter(filter) {
    this.awcGames = filter.Games
    this.awcPlatform = filter.Platform
    
  }

  openAWC(gameType: any, platform: any, gameCode: any) {
    let data = {
      "userName": this.accountInfo.userName,
      "gameType": gameType,
      "isMobile": true,
      "externalUrl": window.origin,
      "platform": platform,
      "gameCode": gameCode,
    }
    this.game.awcAuth(data).subscribe((resp: any) => {
      if (resp.errorCode == 0 && resp.url) {
        window.open(resp.url, "_self");
      } else {
        alert(resp.errorDescription);
      }

    })
  }


  public scrollRight(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft + 200), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft - 200), behavior: 'smooth' });
  }


}
