import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AmanGameComponent } from './aman-game/aman-game.component';
import { AmanComponent } from './aman/aman.component';
import { BetgameComponent } from './betgame/betgame.component';
import { CasinoiframeComponent } from './casinoiframe/casinoiframe.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { GreyHighlightComponent } from './grey-highlight/grey-highlight.component';
import { LoginGuard } from './guards/login.guard';
import { HomeComponent } from './home/home.component';
import { HorseHighlightComponent } from './horse-highlight/horse-highlight.component';
import { MainAuthGuard } from './main-auth.guard';
import { MainComponent } from './main/main.component';
import { PokerCasinoComponent } from './poker-casino/poker-casino.component';
import { ChangepasswordComponent } from './reports/changepassword/changepassword.component';
import { SlotGameComponent } from './slot-game/slot-game.component';
import { SlotListComponent } from './slot-list/slot-list.component';
import { SupernovaComponent } from './supernova/supernova.component';
import { SupernowaCasinoComponent } from './supernowa-casino/supernowa-casino.component';
import { SupernowaChangeComponent } from './supernowa-change/supernowa-change.component';
import { TwainComponent } from './twain/twain.component';
import { AwclistComponent } from './awclist/awclist.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [MainAuthGuard],
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'horse-highlight', component: HorseHighlightComponent },
      { path: 'grey-highlight', component: GreyHighlightComponent },
      { path: 'changepassword', component: ChangepasswordComponent },


      {
        path: 'sports',
        loadChildren: () =>
          import('./sports/sports.module').then((m) => m.SportsModule),
      },
      {
        path: 'full-market',
        loadChildren: () =>
          import('./fullmarket/fullmarket.module').then(
            (m) => m.FullmarketModule
          ),
      },
      {
        path: 'contact',
        component: ContactUsComponent,
      },
      {
        path: 'about',
        component: AboutUsComponent,
      },
      {
        path: 'casinoiframe',
        component: CasinoiframeComponent,
      },
       {
        path: 'slot-list',
        component: SlotListComponent,
      },
      {
        path: 'awclist',
        component: AwclistComponent,
      },
      {
        path: 'slotgame/:gameId',
        component: SlotGameComponent,
      },
      {
        path: 'supernova/:providerCode',
        component: SupernovaComponent,
      },
      {
        path: 'supernova-game/:providerCode/:gameCode',
        component: SupernowaCasinoComponent,
      },
      {
        path: 'supernova-change/:providerCode/:gameCode',
        component: SupernowaChangeComponent,
      },
      {
        path: 'poker',
        component: PokerCasinoComponent,
      },
      {
        path: 'betgame',
        component: BetgameComponent,
      },
      {
        path: 'twain',
        component: TwainComponent,
      },
      {
        path: 'aman',
        component: AmanComponent,
      },
      { path: 'tpp/:opentable', 
      component: AmanGameComponent },

    ],
  },
  {
    path: 'terms',
    loadChildren: () =>
      import('./terms/terms.module').then((m) => m.TermsModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
    canActivate: [MainAuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'LiveBroadcast',
    loadChildren: () =>
      import('./live-broadcast/live-broadcast.module').then(
        (m) => m.LiveBroadcastModule
      ),
    canActivate: [MainAuthGuard],
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./maintenance/maintenance.module').then((m) => m.MaintenanceModule)

  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
