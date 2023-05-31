import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { HomeComponent } from '../home/home.component';
import { IHighlight } from '../home/types/highlight';
import { CommonService } from '../services/common.service';
import { DataFormatService } from '../services/data-format.service';
import { GamesService } from '../services/games.service';
import { OddsServiceService } from '../services/odds-service.service';
import { LEVELS, ShareDataService } from '../services/share-data.service';
import { GenericResponse } from '../shared/types/generic-response';
import { ICasinoData, ICasinoTable } from '../sports/types/casino-data';
@Component({
  selector: 'app-grey-highlight',
  templateUrl: './grey-highlight.component.html',
  styleUrls: ['./grey-highlight.component.scss']
})
export class GreyHighlightComponent implements OnInit {

  activatedTab: number = 1;
  activatedSport: number = 4;

  matchDataHome = {};

  horseRaces = [];
  nextgreyhoundRaces = [];
  greyhoundRaces = [];

  horseLoading = true;
  greyLoading = true;

  subSink = new Subscription();
  selectedTourHorse: any;
  selectedTourGreyhound: any;
  venues: any;
  venuesHorse: any[];
  venuesGrey: any[];
  casinoData: ICasinoData;
  tables: ICasinoTable[];

  unSubscribe$ = new Subject();
  Highlightlist: IHighlight[];
  Highlightlists: any;
  constructor(
    private dataformatService: DataFormatService,
    private oddsService: OddsServiceService,
    private shareDataService: ShareDataService,
    private commonService:CommonService,
    private gamesService: GamesService,

  ) { }

  ngOnInit(): void {
    this.commonService.apis$.subscribe(res => {
      this.getLiveCasinoTables();

      let sportsDataSub = this.dataformatService.sportsData$.subscribe(
        (sportsData) => {
          if (sportsData) {
            this.greyhoundRaces = HomeComponent.getList(
              sportsData[4339.1],
              'tournaments'            );
              this.nextgreyhoundRaces = HomeComponent.getList(
                sportsData[4339.2],
                'tournaments'
              );
            this.horseLoading = false;
            this.greyLoading = false;
  
            // console.log(sportsData)
  
            // console.log(this.horseRaces)
            console.log(this.greyhoundRaces)
  
  
            this.Highlightlist = this.dataformatService.highlightwisedata(
              this.activatedSport
            );
  
            // console.log(this.Highlightlist)
          }
        }
      );
      this.subSink.add(sportsDataSub);
    })
   


    this.shareDataService.setLeftColState({ level: LEVELS.ALL });

    // interval(500).pipe(takeUntil(this.unSubscribe$)).subscribe(() => {
    //   this.selectTab(this.activatedSport, this.activatedSport);
    // })

    let oddsInterval = interval(500).subscribe(() => {
      this.selectTab(this.activatedTab, this.activatedSport);
      if (this.Highlightlist?.length && oddsInterval) oddsInterval.unsubscribe();
    });

    this.subSink.add(
      interval(60000).subscribe(() => {
        this.selectTab(this.activatedTab, this.activatedSport);
      })
    );
  }

  static getList(obj, field, day?: number) {
    let list = [];
    if (obj) {
      Object.values(obj?.[field]).forEach((val: any) => {
        if (day) {
          if (val.day === day) {
            list.push(val);
          }
        } else {
          list.push(val);
        }
      });
    }
    return list;
  }

  selectItemHorse(tour) {
    this.selectedTourHorse = tour;
    this.venuesHorse = HomeComponent.getList(tour, 'matches');
  }

  selectItemGreyhound(tour) {
    this.selectedTourGreyhound = tour;
    this.venuesGrey = HomeComponent.getList(tour, 'matches');
  }

  selectTab(tabNumber: number, sportId?: number) {
    this.Highlightlist = this.dataformatService.highlightwisedata(sportId);
    // console.log(this.Highlightlist)

    if (sportId != 52) {
      var ids = [];
      this.Highlightlist?.forEach((match, index) => {
        if (sportId === +match.SportbfId) {
          ids.push(match.bfId);
        }
      });
      if (ids?.length) {
        this.oddsService
          .getMatchOdds(sportId, ids.join(','))
          .subscribe((res: any[]) => {
            if (res) {
              res?.forEach((market) => {
                this.matchDataHome[market.eventId] = market;
              });
            }
          });
      }
      
    }

    this.activatedTab = tabNumber;
    this.activatedSport = sportId;
  }

  getLiveCasinoTables() {
    this.gamesService .listCasinoTable().subscribe((res:any) => {
        console.log(this.Highlightlists);
        this.casinoData = res.result[0];
        this.Highlightlists = res.result[0].tables;
      });
  }

  trackByFn(item, index) {
    return item.matchId;
  }


  trackByMatchId(item, index) {
    return item.matchId;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
