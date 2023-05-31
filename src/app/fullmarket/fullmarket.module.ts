import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FullmarketComponent } from './fullmarket.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BetslipComponent } from './betslip/betslip.component';
import { CasinoFullmarketComponent } from './casino-fullmarket/casino-fullmarket.component';
import { GoogleChartsModule } from 'angular-google-charts';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'teenpatti',
        component: CasinoFullmarketComponent
      },
      {
        path: ':sportid/:tourid/:matchId/:bfId',
        component: FullmarketComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [FullmarketComponent, BetslipComponent, CasinoFullmarketComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    FlexLayoutModule,
    GoogleChartsModule,
  ],
})
export class FullmarketModule {}
