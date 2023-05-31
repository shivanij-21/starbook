import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { DataFormatService } from '../services/data-format.service';
import { LEVELS, ShareDataService } from '../services/share-data.service';

@Component({
  selector: 'app-col-left',
  templateUrl: './col-left.component.html',
  styleUrls: ['./col-left.component.scss'],
})
export class ColLeftComponent implements OnInit, OnChanges {
  @Input('sidebarHide') sidebarHide: boolean;
  Allmatches;
  sportList: any[];
  tournamentList: any[];
  eventsList: any[];
  marketsList: any[];
  allMatches: any[];
  selectedSport;
  selectedTournament;
  selectedEvent;
  selectedMarket;

  sportsData;
  level: number = 0;

  pathList: any[];
  otherGames: any;

  searchTerm$ = new Subject<string>();

  constructor(
    private dataformatService: DataFormatService,
    private shareDataService: ShareDataService
  ) {
    this.searchTerm$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((term) => this.search(term))
      )
      .subscribe((res) => {
      // //console.log(res);

        this.allMatches = res;
      });
  }

  ngOnInit(): void {
    this.dataformatService.sportsData$.subscribe((sportsData) => {
      this.sportsData = sportsData;
    });

    this.showSportsList();
    this.shareDataService.leftColState$.subscribe((state) => {
      if (state) {
        switch (state.level) {
          case LEVELS.ALL:
            this.showSportsList();
            break;
          case LEVELS.SPORT:
            this.showTournamentsList(state.value.id, state.value.name, state.value.day);
            break;
          case LEVELS.TOURNAMENT:
            this.showEventList(state.value.id, state.value.name);
            break;
          case LEVELS.MATCH:
            this.showMarketList(state.value.id, state.value.name);
            break;
        }
      }
    });

    // this.showSearchList();
  }

  showSportsList = function () {
    this.pathList = [];
    this.selectedSport = false;
    this.selectedTournament = false;
    this.selectedEvent = false;
    this.selectedMarket = false;
    this.sportList = this.dataformatService.sportlistwise();
  };

  showTournamentsList(sport: any, name: string, day: number) {
    // this.level = 1;
    // this.sprtid = id;
    // this.tourname = name;

    this.selectedTournament = false;
    this.selectedEvent = false;
    this.selectedMarket = false;

    // console.log(sport, day, name);

    this.selectedSport = {
      id: sport,
      name: name,
      day: day,
    };

    if (this.sportsData) {
      this.tournamentList = this.dataformatService.tournamentlistwise(
        this.sportsData[sport],
        this.selectedSport.day
      );
    }
    this.pathList.splice(0, 1);
    this.pathList.splice(0, 1);
    this.pathList.splice(0, 1);
    this.pathList.push({
      name: name,
      id: sport,
      level: this.level,
    });
    // $('#loadingTree').css('display', 'none');
  }

  showEventList(id, name) {
    this.level = 2;

    // this.ename = name;
    // this.tourid = id;

    // if (sprt != undefined) {
    //   this.sprtid = sprt;
    // }

    this.selectedEvent = false;
    this.selectedMarket = false;

    this.selectedTournament = {
      id,
      name,
    };

    this.eventsList = this.dataformatService.matchlistwise(
      this.sportsData[this.selectedSport.id].tournaments[
        this.selectedTournament.id
      ]
    );

    // $('#loadingTree').css('display', 'none');

    this.pathList.splice(1, 1);
    this.pathList.splice(1, 1);
    this.pathList.push({
      name: name,
      id: id,
      level: this.level,
    });
  }

  showMarketList(id, name) {
    this.level = 3;
    // this.matchid = id;
    // this.ename = name;
    // this.showMarketList = true;

    this.selectedEvent = {
      id,
      name,
    };
    this.pathList.splice(2, 1);
    this.pathList.push({
      name: name,
      id: id,
      level: this.level,
    });
    if (this.selectedSport) {
      this.marketsList = this.dataformatService.marketlistwise(
        this.sportsData[this.selectedSport.id].tournaments[
          this.selectedTournament.id
        ].matches[this.selectedEvent.id],
        this.selectedEvent.id,
        this.selectedTournament.id,
        this.selectedSport.id
      );
      this.marketsList.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime))
    }
  }

  search(term: string) {
    let searchList = [];
    if (!term || term == '') {
      return searchList;
    }

    searchList = this.dataformatService.Searchwisedata().filter((event) => {
      return event.matchName.toLowerCase().includes(term.toLocaleLowerCase());
    });
  // console.log("Search list",searchList);
    return searchList;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sidebarHide = changes['sidebarHide'].currentValue;
    // this.sidebarHide = changes['sidebarHide'];
  }
}
