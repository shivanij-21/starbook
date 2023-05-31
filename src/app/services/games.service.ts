import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../services/common.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  baseUrl: string;
  raceUrl;
  premiumApi


  constructor(private httpClient: HttpClient, private commonService: CommonService) {
    this.commonService.apis$.subscribe((res) => {
      this.baseUrl = res.ip;
      this.raceUrl = res.racingApi;
      this.premiumApi = res.premiumApi;

    })
  }

  listCasinoProduct() {
    return this.httpClient.get(`${this.baseUrl}/listCasinoProduct`);
  }

  listGames() {
    return this.httpClient.get(`${this.baseUrl}/listGames`);
  }

  activatedHorseGames() {
    return this.httpClient.get(`${this.baseUrl}/listHorseRaces`);
  }

  activatedGreyhoundGames() {
    return this.httpClient.get(`${this.baseUrl}/listGreyhoundRaces`);
  }

  horseRacingGamesToday() {
    return this.httpClient.get(`https://apiallsports.xyz/listMeetings/today/7`);
  }

  slotlist(){
    return this.httpClient.get(`https://slots.vrnl.net/pad=201/api/games`);
  }
  openGames(params){
    return this.httpClient.post(`https://slots.vrnl.net/pad=201/api/openGame`, params);

  }

  greyhoundGamesToday() {
    return this.httpClient.get(`https://apiallsports.xyz/listMeetings/today/4339`);
  }
  

  horseRacingGamesTomorrow() {
    return this.httpClient.get(`https://apiallsports.xyz/listMeetings/tomorrow/7`);
  }

  greyhoundGamesTomorrow() {
    return this.httpClient.get(`https://apiallsports.xyz/listMeetings/tomorrow/4339`);
  }

  listCasinoTable() {
    return this.httpClient.get(`${this.baseUrl}/listCasinoTable`)
  }
  getSportsBook(eventId: string) {
    return this.httpClient.get(`${this.premiumApi}/api/sports_book/${eventId}`);
  }
  supernowaAuth(params) {
    return this.httpClient.post(`https://sn.vrnl.net/pad=111/api/auth`, params);
  }
  supernowaGameAssetsList(providerCode:string) {
    return this.httpClient.get(`https://sn.vrnl.net/pad=111/api/games/${providerCode}`);
  }
  listProviders() {
    return this.httpClient.get(`https://api.cricbuzzer.io/pad=89/listProviders`);
  }
  pokerAuth(params){
    return this.httpClient.post(`https://poker.vrnl.net/pad=300/api/auth`, params);
  }
  pokerQuit(params){
    return this.httpClient.post(`https://poker.vrnl.net/pad=300/api/quit`, params);
  }
  betgamesdata(data){
    return this.httpClient.post(`https://betgames.cricbuzzer.io/pad=401/auth`, data);
  }
  awclist(){
    return this.httpClient.get(`${this.baseUrl}/listAWCCasinoPlatforms`);
  }
  awcAuth(params){
    return this.httpClient.post(`https://awc.vrnl.net/pad=500/api/auth`, params);
  }
}
