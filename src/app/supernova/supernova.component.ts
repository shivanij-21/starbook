import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common.service';
import { GamesService } from '../services/games.service';
import { OddsServiceService } from '../services/odds-service.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-supernova',
  templateUrl: './supernova.component.html',
  styleUrls: ['./supernova.component.scss']
})
export class SupernovaComponent implements OnInit {
  SNcasinoList: any = [];
  providerList = [];
  providerCode:string="SN"
  gameCode:string;
  token:string;
  @ViewChild('tab1', { read: ElementRef }) public tab: ElementRef<any>;



  providerListINR = [
    { "providerName": "Supernowa", "providerCode": "SN", "isBig": true },
    { "providerName": "AE Sexy Casino", "providerCode": "AWC", "isBig": true },
    { "providerName": "Xprogramming", "providerCode": "XPG", "isBig": false },
    { "providerName": "Only Play", "providerCode": "GT", "isBig": false },
    { "providerName": "Ezugi", "providerCode": "EZ", "isBig": false },
    { "providerName": "One Touch", "providerCode": "OT", "isBig": false },
    { "providerName": "Power Games", "providerCode": "PG", "isBig": true },
    { "providerName": "Pragmatic Play", "providerCode": "PP", "isBig": true },
  ];
  snGameAssetsINR = [
    { "name": "Roulette", "code": "RT", "providerCode": "SN", "thumb": "http://files.worldcasinoonline.com/Document/Game/Roulette_1654169469599.867.jpg" },
    { "name": "RNG Worli Matka", "code": "VWM", "providerCode": "SN", "thumb": "http://files.worldcasinoonline.com/Document/Game/5-RNG-Worli-Matka_1654174294949.6729.jpg" },
    { "name": "Heads Or Tails", "code": "HT", "providerCode": "PG", "thumb": "http://files.worldcasinoonline.com/Document/Game/Heads-or-Tails_1654170471388.5208.jpg" },
    { "name": "Crypto Binary", "code": "CRP", "providerCode": "PG", "thumb": "http://files.worldcasinoonline.com/Document/Game/Crypto-Binary_1654170413783.7327.jpg" },
    { "name": "Black Jack", "code": "11", "providerCode": "XPG", "thumb": "http://files.worldcasinoonline.com/Document/Game/Black-jack_1661774286603.564.jpg" },
    { "name": "Baccarat", "code": "MX-LIVE-002", "providerCode": "AWC", "thumb": "http://files.worldcasinoonline.com/Document/Game/Baccarat_1654173322546.122.jpg" },
    { "name": "Dragon Tiger", "code": "MX-LIVE-006", "providerCode": "AWC", "thumb": "http://files.worldcasinoonline.com/Document/Game/Dragon Tiger_1654173328911.0254.jpg" },
    { "name": "Sic Bo", "code": "MX-LIVE-007", "providerCode": "AWC", "thumb": "http://files.worldcasinoonline.com/Document/Game/Sic Bo_1654172481618.346.jpg" },
    { "name": "Holdâ€™em Poker", "code": "1", "providerCode": "OT", "thumb": "http://files.worldcasinoonline.com/Document/Game/Holdem-Poker_32_11zon_1661528900527.018.jpg" },
    { "name": "Wild Wild West 2120", "code": "234165", "providerCode": "OT", "thumb": "http://files.worldcasinoonline.com/Document/Game/Wild-Wild-West-2120_5_11zon_1662032499741.5344.jpg" },
    { "name": "Disco Lady", "code": "vs243discolady", "providerCode": "PP", "thumb": "http://files.worldcasinoonline.com/Document/Game/Disco-Lady_1662552356508.9814.jpg" },
    { "name": "Mega Wheel", "code": "801", "providerCode": "PP", "thumb": "http://files.worldcasinoonline.com/Document/Game/Mega-Wheel_1662051227502.8633.jpg" },
    { "name": "Cosmic Cash", "code": "vs40cosmiccash", "providerCode": "PP", "thumb": "http://files.worldcasinoonline.com/Document/Game/Cosmic-Cash_1662551274682.7146.jpg" },
    { "name": "Sweet Bonanza", "code": "vs20fruitsw", "providerCode": "PP", "thumb": "http://files.worldcasinoonline.com/Document/Game/Sweet-Bonanza-Candyland_100_11zon_1662560012257.6707.jpg" },
    { "name": "Lucky Coin", "code": "headsortails", "providerCode": "GT", "thumb": "http://files.worldcasinoonline.com/Document/Game/Lucky-coin_1661614581987.3235.jpg" },
    { "name": "VIP Fortune Baccarat ", "code": "106", "providerCode": "EZ", "thumb": "http://files.worldcasinoonline.com/Document/Game/vip fortune baccarat_14_11zon_1661787817959.455.png" },
    { "name": "Unlimited Turkish Blackjack", "code": "5051", "providerCode": "EZ", "thumb": "http://files.worldcasinoonline.com/Document/Game/UNLIMITED TURKISH BLACKJACK-min_1662462550467.8113.png" }
  ];


  constructor(
    private oddsService: OddsServiceService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private games: GamesService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.providerCode = params.providerCode;      
      this.supernowaGameAssetsList(this.providerCode);
    })
    this.commonService.apis$.subscribe((res) => {
      this.listProviders()
    }
    )
  }

  supernowaGameAssetsList(providerCode){
    this.oddsService.supernowaGameAssetsList(providerCode).subscribe((resp: any) => {      
      if (resp.status.code == "SUCCESS") {
        this.SNcasinoList = resp.games;
      }
    })
  }
  listProviders(){
    this.oddsService.listProviders().subscribe((resp: any) => {
      this.providerList = resp.result;

    })
  }
  openExtLobby(params){
      this.token = this.tokenService.getToken();
      this.gameCode = params.code;
      this.providerCode = params.providerCode;
      let backurldomain = window.origin;
      let authData= {"token":this.token,"gameCode":this.gameCode, "providerCode": this.providerCode,"backUrl": backurldomain }
      this.games.supernowaAuth(authData).subscribe((resp: any)=>{
        if(resp.status.code == "SUCCESS"){
          window.open(resp.launchURL, "_self");
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
