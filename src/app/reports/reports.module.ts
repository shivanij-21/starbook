import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { ActiviesComponent } from './activies/activies.component';
import { CasinoBetsComponent } from './casino-bets/casino-bets.component';
import { ExchGamesBetsComponent } from './exch-games-bets/exch-games-bets.component';
import { FancyBetsComponent } from './fancy-bets/fancy-bets.component';
import { MyBetsComponent } from './my-bets/my-bets.component';
import { PnlComponent } from './pnl/pnl.component';
import { ReportsComponent } from './reports.component';
import { ResultsComponent } from './results/results.component';
import { StakeComponent } from './stake/stake.component';
import { PokerReportsComponent } from './poker-reports/poker-reports.component';
import { BetgameBettinghistoryComponent } from './betgame-bettinghistory/betgame-bettinghistory.component';
import { BetgameProfitandlossComponent } from './betgame-profitandloss/betgame-profitandloss.component';
import { SncasinoBetshistoryComponent } from './sncasinoreports/sncasino-betshistory/sncasino-betshistory.component';
import { SncasinoProfitlossComponent } from './sncasinoreports/sncasino-profitloss/sncasino-profitloss.component';
import { SlotBethistoryComponent } from './slot-bethistory/slot-bethistory.component';
import { SlotProfitlossComponent } from './slot-profitloss/slot-profitloss.component';
import { CasinoBethistoryComponent } from './casino-bethistory/casino-bethistory.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'acc-statement', component: AccountStatementComponent },
      { path: 'my-bets', component: MyBetsComponent },
      { path: 'fancy-bets', component: FancyBetsComponent },
      { path: 'exch-bets', component: ExchGamesBetsComponent },
      { path: 'casino-bets', component: CasinoBetsComponent },
      { path: 'pnl', component: PnlComponent },
      { path: 'stake', component: StakeComponent },
      { path: 'activities', component: ActiviesComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'poker-report', component: PokerReportsComponent },
      { path: 'betgame_bettinghistory', component: BetgameBettinghistoryComponent },
      { path: 'betgame_profitandloss', component: BetgameProfitandlossComponent },
      { path: 'sncasino_bets_history', component: SncasinoBetshistoryComponent },
      { path: 'sncasino_profit_loss', component: SncasinoProfitlossComponent },
      { path: 'slot_bet_history', component: SlotBethistoryComponent },
      { path: 'slot_profit_loss', component: SlotProfitlossComponent },

    ],
  },
];

@NgModule({
  declarations: [
    ReportsComponent,
    AccountStatementComponent,
    MyBetsComponent,
    FancyBetsComponent,
    ExchGamesBetsComponent,
    CasinoBetsComponent,
    PnlComponent,
    StakeComponent,
    ActiviesComponent,
    ResultsComponent,
    PokerReportsComponent,
    SncasinoBetshistoryComponent,
    SncasinoProfitlossComponent,
    CasinoBethistoryComponent,
    SlotBethistoryComponent,
    SlotProfitlossComponent,
    BetgameBettinghistoryComponent,
    BetgameProfitandlossComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    PipesModule,
    ReactiveFormsModule,
    LayoutModule,
    DirectivesModule
  ],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class ReportsModule {}
