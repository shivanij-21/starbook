import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMarqueeModule } from 'ng-marquee';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CookieModule } from 'ngx-cookie';
import { ExportAsService } from 'ngx-export-as';
import { ToastrModule } from 'ngx-toastr';
import { AboutUsComponent } from './about-us/about-us.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColLeftComponent } from './col-left/col-left.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { FooterComponent } from './main/footer/footer.component';
import { MainComponent } from './main/main.component';
import { PipesModule } from './pipes/pipes.module';
import { SortByDatePipeHome } from './pipes/sort-by-date-home.pipe';
import { CasinoiframeComponent } from './casinoiframe/casinoiframe.component';
import { HorseHighlightComponent } from './horse-highlight/horse-highlight.component';
import { GreyHighlightComponent } from './grey-highlight/grey-highlight.component';
import { PromoteBannerComponent } from './promote-banner/promote-banner.component';
// import { GoogleChartsModule } from 'angular-google-charts';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangepasswordComponent } from './reports/changepassword/changepassword.component';
import { RouterModule } from '@angular/router';
import { MarqueeComponent } from './marquee/marquee.component';
import { SupernovaComponent } from './supernova/supernova.component';
import { SupernowaCasinoComponent } from './supernowa-casino/supernowa-casino.component';
import { SupernowaChangeComponent } from './supernowa-change/supernowa-change.component';
import { SlotListComponent } from './slot-list/slot-list.component';
import { SlotGameComponent } from './slot-game/slot-game.component';
import { AmanComponent } from './aman/aman.component';
import { AmanGameComponent } from './aman-game/aman-game.component';
import { PokerCasinoComponent } from './poker-casino/poker-casino.component';
import { BetgameComponent } from './betgame/betgame.component';
import { TwainComponent } from './twain/twain.component';
import { AwclistComponent } from './awclist/awclist.component';


@NgModule({
  declarations: [
    AppComponent,
    ContactUsComponent,
    AboutUsComponent,
    MainComponent,
    HeaderComponent,
    HomeComponent,
    ColLeftComponent,
    FooterComponent,
    SortByDatePipeHome,
    CasinoiframeComponent,
    HorseHighlightComponent,
    GreyHighlightComponent,
    PromoteBannerComponent,
    ChangepasswordComponent,
    MarqueeComponent,
    SupernovaComponent,
    SupernowaCasinoComponent,
    SupernowaChangeComponent,
    SlotListComponent,
    SlotGameComponent,
    AmanComponent,
    AmanGameComponent,
    PokerCasinoComponent,
    BetgameComponent,
    TwainComponent,
    AwclistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ModalModule.forRoot(),
    CookieModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    PipesModule,
    NgMarqueeModule
  ],
  providers: [
    ExportAsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
