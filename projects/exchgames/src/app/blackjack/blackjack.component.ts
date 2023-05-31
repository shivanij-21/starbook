import { Component, OnInit } from '@angular/core';
import { ExchGamesService } from '../services/exchgames.service';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss']
})
export class BlackjackComponent implements OnInit {

  constructor(
    private exchGamesService: ExchGamesService
  ) { }

  ngOnInit(): void {
    this.exchGamesService.getGameData('blackjack').subscribe((res) => {
    // //console.log(res);

    })
  }

}
