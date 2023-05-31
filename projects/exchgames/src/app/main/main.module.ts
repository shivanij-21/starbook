import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { BlackjackComponent } from '../blackjack/blackjack.component';
import { ExchFullmarketComponent } from '../exch-fullmarket/exch-fullmarket.component';
import { HomeComponent } from '../home/home.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: ':exchName',
        component: ExchFullmarketComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    BlackjackComponent,
    ExchFullmarketComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), PipesModule, FormsModule, ReactiveFormsModule, FlexLayoutModule],
  exports: [RouterModule],
})
export class MainModule {}
