import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import * as _ from 'underscore';
import * as moment from 'moment';

import { IRaces } from '../shared/types/races';
import {
  IMarket,
  IMatch,
  ISportsData,
  ITournament,
} from '../shared/types/sport-data';

export interface IRaceCountry {
  sportId: number;
  countries: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DataFormatService {
  private _sportsDataSub = new ReplaySubject<ISportsData>(1);
  sportsData$ = this._sportsDataSub.asObservable();

  private _sportsListSub = new BehaviorSubject<any>(null);
  sportsList$ = this._sportsListSub.asObservable();

  private _otherGamesSub = new BehaviorSubject<IRaces[]>(null);
  otherGames$ = this._otherGamesSub.asObservable();

  private _activatedGamesSub = new BehaviorSubject<IRaceCountry>(null);
  activatedGames$ = this._activatedGamesSub.asObservable();

  private activatedRaces = {};

  events: any[];
  sport: any;
  static sportsData: ISportsData | any = {};
  static eventsByBfId = {};
  static inPlayEventsCount = {};
  otherGames = {};
  headerSportsList = [
    {
      id: 1,
      bfId: 4,
      name: 'Cricket',
    },
    {
      id: 2,
      bfId: 1,
      name: 'Soccer',
    },
    {
      id: 3,
      bfId: 2,
      name: 'Tennis',
    },
    // {
    //   id: 13,
    //   bfId: 6423,
    //   name: 'American Football',
    // },
    // {
    //   id: 14,
    //   bfId: 7522,
    //   name: 'Basketball',
    // },
    // {
    //   id: 9,
    //   bfId: 6,
    //   name: 'Boxing',
    // },
    // {
    //   id: 10,
    //   bfId: 1477,
    //   name: 'Rugby League',
    // },
    // {
    //   id: 8,
    //   bfId: 5,
    //   name: 'Rugby Union',
    // },
    // {
    //   id: 12,
    //   bfId: 6422,
    //   name: 'Snooker',
    // },
    //    {
    //   id: 11,
    //   bfId: 3505,
    //   name: 'Darts',
    // },
    //     {
    //   id: 16,
    //   bfId: 27454571,
    //   name: 'Esports',
    // },
    //    {
    //   id: 15,
    //   bfId: 26420387,
    //   name: 'Mixed Martial Arts',
    // },


    // {
    //   id: 10,
    //   bfId: 1477,
    //   name: 'Rugby League',
    // },
    // {
    //   id: 11,
    //   bfId: 3505,
    //   name: 'Darts',
    // },



    // {
    //   id: 15,
    //   bfId: 26420387,
    //   name: 'Mixed Martial Arts',
    // },
    // {
    //   id: 16,
    //   bfId: 27454571,
    //   name: 'Esports',
    // },
    // {
    //   id: 52,
    //   bfId: 52,
    //   name: 'Kabaddi',
    // },
    {
      id: 85,
      bfId: 85,
      name: 'Election',
    },
    // {
    //   id: 6,
    //   bfId: 7.2,
    //   name: 'Horse Racing',
    // },
    // {
    //   id: 7,
    //   bfId: 4339.2,
    //   name: 'Greyhound Racing',
    // }
  ]
  static EventTypeIds = {
    cricket: {
      id: 2,
      bfId: 4,
      title: 'Cricket',
    },
    soccer: {
      id: 3,
      bfId: 1,
      title: 'Soccer',
    },
    tennis: {
      id: 1,
      bfId: 2,
      title: 'Tennis',
    },
    // "American Football": {
    //   id: 13,
    //   bfId: 6423,
    //   title: 'American Football',
    // },
    // Basketball: {
    //   id: 14,
    //   bfId: 7522,
    //   title: 'Basketball',
    // },
    // "Rugby League": {
    //   id: 10,
    //   bfId: 1477,
    //   title: 'Rugby League',
    // },
    // "Rugby Union": {
    //   id: 8,
    //   bfId: 5,
    //   title: 'Rugby Union',
    // },
    // Snooker: {
    //   id: 12,
    //   bfId: 6422,
    //   title: 'Snooker',
    // },
    // Darts: {
    //   id: 11,
    //   bfId: 3505,
    //   title: 'Darts',
    // },
    // Esports: {
    //   id: 16,
    //   bfId: 27454571,
    //   title: 'Esports',
    // },

    // "Mixed MartialArts": {
    //   id: 15,
    //   bfId: 26420387,
    //   title: 'Mixed Martial Arts',
    // },
    // Boxing: {
    //   id: 9,
    //   bfId: 6,
    //   title: 'Boxing',
    // },


    // Kabaddi: {
    //   id: 52,
    //   bfId: 52,
    //   title: 'Kabaddi',
    // },
    Election: {
      id: 85,
      bfId: 85,
      title: 'Election',
    },
    horseRacingToday: {
      id: 4,
      bfId: 7.1,
      title: "Horse Racing Today's Card",
    },
    greyhoundRacingToday: {
      id: 5,
      bfId: 4339.1,
      title: "Greyhound Racing Today's Card",
    },
    horseRacing: {
      id: 6,
      bfId: 7.2,
      title: 'Horse Racing',
    },
    greyhoundRacing: {
      id: 7,
      bfId: 4339.2,
      title: 'Greyhound Racing',
    },
  };

  static sportIdMap: {
    [key: number]: {
      id: number;
      bfId: number;
      title: string;
    };
  } = {
      7.1: {
        id: 4,
        bfId: 7.1,
        title: "Horse Racing Today's Card",
      },
      4339.1: {
        id: 5,
        bfId: 4339.1,
        title: "Greyhound Racing Today's Card",
      },
      7.2: {
        id: 6,
        bfId: 7.2,
        title: 'Horse Racing',
      },
      4339.2: {
        id: 7,
        bfId: 4339.2,
        title: 'Greyhound Racing',
      },
    };

  constructor() { }

  static findKeysfromArr(arr, fieldName) {
    var keys = [];
    _.forEach(arr, function (it, index) {
      let key = it[fieldName];
      if (keys.findIndex((k) => k === key) < 0) {
        keys.push(key);
      }
    });
    return keys;
  }

  static findDatafromArr(arr, fieldName, filterTerm) {
    return arr.filter(
      (it) => it[fieldName].toString() === filterTerm.toString()
    );
  }

  getSportsData(gamesList: any[]) {
    // var events = gamesList;
    // this.events = gamesList;
    // events = gamesList.filter((e) => parseInt(e.eventTypeId, 10) > 0);
    var events = gamesList.filter((e) => parseInt(e.eventTypeId, 10) > 0);
    this.events = events;

    var result = {
      _allinfo: null,
      _multimkt: null,
      _userAvgmatchedBets: null,
      _userMatchedBets: null,
      _userUnMatchedBets: null,
      description: {
        result: null,
        status: 'Failed',
      },
      news: null,
    };
    var sportsData = [];
    var sportsName = DataFormatService.findKeysfromArr(
      this.events,
      'sportsName'
    );
    _.forEach(sportsName, function (sportName, index) {
      if (!DataFormatService.EventTypeIds[sportName]) {
        return;
      }
      var sport = {
        id: DataFormatService.EventTypeIds[sportName].id,
        img: null,
        bfId: DataFormatService.EventTypeIds[sportName].bfId,
        tournaments: [],
        name: DataFormatService.EventTypeIds[sportName].title,
      };
      var competitionIds = [];
      _.forEach(events, function (it, index) {
        if (it.sportsName === sportName) {
          let key = it['competitionId'];
          if (competitionIds.findIndex((k) => k === key) < 0) {
            competitionIds.push(key);
          }
        }
      });

      _.forEach(competitionIds, function (competitionId, index2) {
        var competition = DataFormatService.findDatafromArr(
          events,
          'competitionId',
          competitionId
        )[0];
        var tournament = {
          id: index2,
          bfId: competition.competitionId,
          name: competition.competitionName,
          matches: [],
        };
        _.forEach(events, function (event, index3) {
          if (event.competitionId === competitionId) {
            var match = {
              bfId: event.eventId,
              inPlay: event.isInPlay,
              startDate: event.time,
              name: event.eventName,
              port: event.port,
              id: event.id,
              status: event.status === 0 ? 'OPEN' : 'CLOSE',
              tv: event.tv,
              isFancy: event.isFancy,
              eventTypeId: event.eventTypeId,
              activeStatus: event.isFancy,
              totalMatched: event.totalMatched,
              tvPid: event.tvPid,
              tvMapid: event.tvMapid,
              bet: event.bet,
              usersOnline: event.usersOnline,
              noOfBets: event.noOfBets,
              session: event.session,
              unmatched: event.unmatched,
              isVirtual: event.isVirtual,
              markets: [],
              runners: event.runners,
              _avgmatchedBets: null,
              _fancyBets: null,
              _matchedBets: null,
              _unMatchedBets: null,
              bookRates: null,
              commentary: null,
              data: null,
              dataMode: 1,
              displayApplication: 1,
            };
            _.forEach(event.markets, function (market, index4) {
              match.markets.push({
                name: market.marketName,
                id: market.gameId,
                bfId: market.marketId,
                betDelay: market.betDelay,
                runnerData: {
                  runner1Name: market.runners[0],
                  runner2Name: market.runners[1],
                },
                status: market.open === 1 ? 'OPEN' : '',
              });
            });
            tournament.matches.push(match);
          }
        });
        sport.tournaments.push(tournament);
      });
      sportsData.push(sport);
    });

    // console.log(sportsData)

    result['sportsData'] = sportsData;
    this.sport = this.sportlistwise();
    this.homeSignalrFormat(sportsData);
    this._sportsDataSub.next(DataFormatService.sportsData);
  }

  sportsWiseMatchList(sportsData: any[]) {
    let sportsObj = {};

    _.forEach(sportsData, (sport) => {
      _.forEach(sport.tournaments, (tour) => {
        _.forEach(tour.matches, (match) => {
          if (sportsObj[sport.bfId]) {
            sportsObj[sport.bfId].matches.push(match);
          } else {
            sportsObj[sport.bfId] = {
              id: sport.bfId,
              name: sport.name,
              matches: [match],
            };
          }
        });
      });
    });
    return sportsObj;
  }

  getSportsList(sportsData: ISportsData, hasTv?: number) {
    let sportsList = [];
    _.forEach(sportsData, (sport: ISportsData) => {
      let sportObj = {
        id: sport.bfId,
        name: sport.name,
        tournaments: [],
      };
      _.forEach(sport.tournaments, (tour: ITournament) => {
        let tournamentObj = {
          id: tour.id,
          name: tour.name,
          matches: [],
        };
        _.forEach(tour.matches, (match) => {
          // if (hasTv == 1 && match.tv === 1) {
          tournamentObj.matches.push(match);
          // }
        });
        if (tournamentObj.matches.length) {
          sportObj.tournaments.push(tournamentObj);
        }
      });
      if (sportObj.tournaments.length) {
        sportsList.push(sportObj);
      }
    });
    return sportsList;
  }

  getOtherGames(otherGames: IRaces[], day?: number) {
    let sportIds = DataFormatService.findKeysfromArr(otherGames, 'eventTypeId');
    _.forEach(sportIds, (sportId) => {
      let id = +`${sportId}.${day}`;
      let sport = {
        id: DataFormatService.sportIdMap[id]?.id,
        name: DataFormatService.sportIdMap[id]?.title,
        bfId: DataFormatService.sportIdMap[id]?.bfId,
        tournaments: [],
      };

      let tourIds = [];
      _.forEach(otherGames, (race) => {
        if (race.eventTypeId === sportId) {
          let key = race.countryCode;
          if (tourIds.findIndex((k) => k === key) < 0) {
            tourIds.push(key);
          }
        }
      });

      _.forEach(tourIds, (tourId, index) => {
        let meeting = DataFormatService.findDatafromArr(
          otherGames,
          'countryCode',
          tourId
        )[0];
        let tournament = {
          id: index + 1,
          bfId: index + 1,
          name: meeting.countryCode,
          day,
          matches: [],
        };

        _.forEach(otherGames, (meeting) => {

          if (meeting.countryCode === tourId) {
            let match = {
              id: meeting.meetingId,
              name: meeting.venue,
              bfId: meeting.meetingId,
              markets: [],
            };
            _.forEach(meeting.races, (race) => {


              let market = {
                name: race.marketName,
                id: race.marketId,
                bfId: race.marketId,
                racing: true,
                ...race,
              };

              // match.markets.push(market);
              var md = new Date(race.startTime);
              var mn = md.getHours();
              var mday = md.getDay();

              var d = new Date();
              var n = d.getHours() - 1;
              var day = d.getDay();


              if (market.inplay == 1) {
                match.markets.splice(0, 1);
                market['isInplay'] = true;
                if (mn > n) {
                  match.markets.push(market);
                }
              } else {
                market['isInplay'] = false;
                if ((mn > n && mday == day) || mday > day) {
                  match.markets.push(market);
                }
              }
              if (match.markets.length == 1) {
                if (match.markets[0].inplay == 1) {
                  match.markets.splice(0, 1);

                }
              }

            });
            if (match.markets.length != 0) {
              tournament.matches.push(match);
            }
          }
        });
        if (tournament.matches.length != 0) {
          sport.tournaments.push(tournament);

        }
      });
      let sportList = [sport];
      this.homeSignalrFormat(sportList);
    });
  }

  getRacingFormat(raceList) {
    // console.log(raceList)
    if (!raceList) {
      return;
    }
    var listRaceFormat = [];
    raceList.forEach(function (item, index) {
      let countryIndex = listRaceFormat.findIndex(race => race.countryCode == item.countryCode);
      // console.log(countryIndex)

      var listRacesFormat = [];

      let objectArray = Object.entries(item.races);

      objectArray.forEach(function (item2: any, index2) {

        // match.markets.push(market);
        var md = new Date(item2[1].startTime);
        var mn = md.getHours();
        var mday = md.getDay();

        var d = new Date();
        var n = d.getHours() - 1;
        var day = d.getDay();

        // console.log(day, mday)

        if (item2[1].inplay == 1) {
          listRacesFormat.splice(0, 1);
          item2[1]['isInplay'] = true;
          if (mn > n) {
            listRacesFormat.push(item2[1]);
          }
        } else {
          item2[1]['isInplay'] = false;
          if ((mn > n && mday == day) || mday > day) {
            listRacesFormat.push(item2[1]);
          }
        }

        if (listRacesFormat.length == 1) {
          if (listRacesFormat[0].inplay == 1) {
            listRacesFormat.splice(0, 1);

          }
        }
      })

      item.races = listRacesFormat;

      if (item.races.length > 0) {
        if (countryIndex == -1) {
          listRaceFormat.push({
            countryCode: item.countryCode,
            venueVo: [item]
          });
        } else {
          listRaceFormat[countryIndex].venueVo.push(item);
        }
      }
    });

    return listRaceFormat;
  }

  getNextRacingFormat(raceList) {
    // console.log(raceList)
    if (!raceList) {
      return;
    }
    var nextRacesFormat = [];
    let objectArray = Object.entries(raceList.tournaments);

    objectArray.forEach(function (item: any) {
      // item.tournaments.forEach(function (item2) {
      let objectMArray = Object.entries(item[1].matches);

      objectMArray.forEach(function (item3: any) {
        item3[1].markets.forEach(function (item4) {
          item4['venue'] = item3[1]?.name;
          item4['name'] = item4?.eventName.replace(/ /g, '');
          item4['bfId'] = item[1]?.bfId;
          if (item4?.marketName) {
            item4['marketName'] = item4?.marketName.split(' - ')[1];
          }

          if (item4.inplay != 1) {
            nextRacesFormat.push(item4);
          }
        })
        // })
      })

      // let objectArray = Object.entries(item.races);
      // objectArray.forEach(function (item2: any) {
      //   item2[1]['venue'] = item.venue;
      //   item2[1]['name'] = item2[1].eventName.replace(/ /g, '');
      //   item2[1]['marketName'] = item2[1].marketName.split(' - ')[1];

      //   if (item2[1].inplay != 1) {
      //     nextRacesFormat.push(item2[1]);
      //   }
      // })
    });

    nextRacesFormat = _.sortBy(nextRacesFormat, (a: any, b: any) => {
      return new Date(a.startTime);
    });

    return nextRacesFormat;
  }

  getEventsByBfId() {
    _.forEach(DataFormatService.sportsData, (sport: ISportsData) => {
      _.forEach(sport.tournaments, (tour: ITournament) => {
        _.forEach(tour.matches, (match: IMatch) => {
          _.forEach(match.markets, (market: IMarket) => {
            DataFormatService.eventsByBfId[market.bfId] = {
              ...market,
            };
          });
        });
      });
    });
    return DataFormatService.eventsByBfId;
  }

  setActivatedRaces(data: IRaceCountry) {
    this.activatedRaces[data.sportId] = data.countries;
    this._activatedGamesSub.next(data);
  }

  getActivatedRaces() {
    return this.activatedRaces;
  }

  sportlistwise() {
    var sportslistdata = [];
    var data = {};
    data['id'] = 4;
    data['name'] = 'Cricket';
    data['ids'] = 10;
    sportslistdata.push(data);

    var data = {};
    data['id'] = 2;
    data['name'] = 'Tennis';
    data['ids'] = 20;
    sportslistdata.push(data);

    var data = {};
    data['id'] = 1;
    data['name'] = 'Soccer';
    data['ids'] = 30;
    sportslistdata.push(data);

    var data = {};
    data['id'] = 7.1;
    data['name'] = "Horse Racing Today's Card";
    data['ids'] = 40;
    data['otherSport'] = true;
    sportslistdata.push(data);

    var data = {};
    data['id'] = 4339.1;
    data['name'] = "Greyhound Racing Today's Card";
    data['ids'] = 50;
    data['otherSport'] = true;
    sportslistdata.push(data);

    var data = {};
    data['id'] = 7.2;
    data['name'] = 'Horse Racing';
    data['ids'] = 60;
    data['otherSport'] = true;
    sportslistdata.push(data);

    var data = {};
    data['id'] = 4339.2;
    data['name'] = 'Greyhound Racing';
    data['ids'] = 70;
    data['otherSport'] = true;
    sportslistdata.push(data);

    // var data = {};
    // data['id'] = 5;
    // data['name'] = 'Rugby Union';
    // data['ids'] = 80;
    // sportslistdata.push(data);

    // var data = {};
    // data['id'] = 6;
    // data['name'] = 'Boxing';
    // data['ids'] = 90;
    // sportslistdata.push(data);
    // var data = {};
    // data['id'] = 1477;
    // data['name'] = 'Rugby League';
    // data['ids'] = 100;
    // sportslistdata.push(data);
    // var data = {};
    // data['id'] = 3505;
    // data['name'] = 'Darts';
    // data['ids'] = 110;
    // sportslistdata.push(data);
    // var data = {};
    // data['id'] = 6422;
    // data['name'] = 'Snooker';
    // data['ids'] = 120;
    // sportslistdata.push(data);
    // var data = {};
    // data['id'] = 6423;
    // data['name'] = 'American Football';
    // data['ids'] = 130;
    // sportslistdata.push(data);
    // var data = {};
    // data['id'] = 7522;
    // data['name'] = 'Basketball';
    // data['ids'] = 140;
    // sportslistdata.push(data);
    // var data = {};
    // data['id'] = 26420387;
    // data['name'] = 'Mixed Martial Arts';
    // data['ids'] = 150;
    // sportslistdata.push(data);
    // var data = {};
    // data['id'] = 27454571;
    // data['name'] = 'Esports';
    // data['ids'] = 160;
    // sportslistdata.push(data);


    sportslistdata.sort(function (a, b) {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });
    return sportslistdata;
  }


  homeSignalrFormat(sportsData) {
    _.forEach(sportsData, function (sport) {
      var tourDataFormat = {};
      _.forEach(sport.tournaments, function (tour) {
        var matchesDataFormat = {};
        _.forEach(tour.matches, function (match) {
          var marketsDataFormat = {};
          match.id = match.bfId;
          if (match.inPlay) {
            if (DataFormatService.inPlayEventsCount[sport.bfId]) {
              DataFormatService.inPlayEventsCount[sport.bfId] += 1;
            } else {
              DataFormatService.inPlayEventsCount[sport.bfId] = 1;
            }
          }
          _.forEach(match.markets, function (market) {
            marketsDataFormat[market.id] = market;
          });
          matchesDataFormat[match.bfId] = match;
        });
        tourDataFormat[tour.bfId] = {
          bfId: tour.bfId,
          id: tour.id,
          name: tour.name,
          day: tour.day,
          matches: matchesDataFormat,
        };
      });
      DataFormatService.sportsData[sport.bfId] = {
        bfId: sport.bfId,
        id: sport.id,
        name: sport.name,
        tournaments: {
          ...DataFormatService.sportsData[sport.bfId]?.tournaments,
          ...tourDataFormat,
        },
      };
      // DataFormatService.sportsData[sport.bfId] = {
      //   bfId: sport.bfId,
      //   id: sport.id,
      //   name: sport.name,
      //   tournaments: tourDataFormat,
      // };
    });
    return DataFormatService.sportsData;
  }

  highlightwisedata(sprtid: number, marketName?: string) {

    // console.log(sprtid)
    var data = {};
    var highlightdata = [];
    var highlightdataIds = [];
    let multimarket = JSON.parse(localStorage.getItem('Multimarkets'));
    _.forEach(DataFormatService.sportsData, function (item: any, index) {
      if (item.bfId == sprtid) {
        _.forEach(item.tournaments, function (item1, index1) {
          _.forEach(item1.matches, function (item2, index2) {
            _.forEach(item2.markets, function (item3, index3) {
              if (
                item3.name.toLowerCase().includes(marketName || 'match odds') || item3.name == 'Bookmaker' || item3.name == 'Moneyline') {
                item3.runnerData['bfId'] = item3.bfId;
                item3.runnerData['inPlay'] = item2.inPlay;
                item3.runnerData['isBettingAllow'] = item3.isBettingAllow;
                item3.runnerData['isMulti'] = item3.isMulti;
                item3.runnerData['marketId'] = item3.id;
                item3.runnerData['matchDate'] = item2.startDate;
                item3.runnerData['matchId'] = item2.bfId;
                item3.runnerData['matchName'] = item2.name;
                item3.runnerData['sportName'] = item.name;
                item3.runnerData['status'] = item2.status;
                item3.runnerData['mtBfId'] = item2.bfId;
                item3.runnerData['TourbfId'] = item1.bfId;
                item3.runnerData['SportbfId'] = item.bfId;
                item3.runnerData['isFancy'] = item2.isFancy;
                item3.runnerData['hasBookmaker'] = item2.bookRates
                  ? item2.bookRates.length > 0
                    ? 1
                    : 0
                  : 0;
                _.forEach(multimarket, function (item4) {
                  if (item3.id == item4) {
                    item3.runnerData['isMulti'] = 1;
                  }
                });
                highlightdata.push(item3.runnerData);
                highlightdataIds.push(item3.bfId);
              }
            });
          });
        });
      }
    });
    return highlightdata.sort((a, b) => {
      if (a.inPlay - b.inPlay) {
        return b.inPlay - a.inPlay;
      }
      if (a.inPlay === 0 && b.inPlay == 0) {
        return Date.parse(a.matchDate) - Date.parse(b.matchDate);
      }
      return b.inPlay - a.inPlay;
    });
    // return highlightdata
  }
  inplaylistwise(sportsData, inplaytype: number) {
    var inplaydata = [];
    let inplayRunnerData = {};
    _.forEach(sportsData, (item, index) => {
      if (item.bfId == 7 || item.bfId == 4339) {
        return;
      }
      var data = {};
      var highlightdata = [];
      var highlightdataIds = [];
      _.forEach(item.tournaments, function (item1, index1) {
        _.forEach(item1.matches, function (item2, index2) {
          // if (item2.inPlay==1 && inplaytype==0) {
          _.forEach(item2.markets, function (item3, index3) {
            if (item3.name == 'Match Odds' || item3.name == 'Bookmaker') {
              item3.runnerData['bfId'] = item3.bfId;
              item3.runnerData['inPlay'] = item2.inPlay;
              item3.runnerData['isBettingAllow'] = item3.isBettingAllow;
              item3.runnerData['isMulti'] = item3.isMulti;
              item3.runnerData['marketId'] = item3.id;
              item3.runnerData['matchDate'] = item2.startDate;
              item3.runnerData['matchId'] = item2.bfId;
              item3.runnerData['matchName'] = item2.name;
              item3.runnerData['sportName'] = item.name;
              item3.runnerData['status'] = item2.status;
              item3.runnerData['mtBfId'] = item2.bfId;
              item3.runnerData['TourbfId'] = item1.bfId;
              item3.runnerData['Tourname'] = item1.name;
              item3.runnerData['SportbfId'] = item.bfId;
              item3.runnerData['hasFancy'] = item2.hasFancy;
              item3.runnerData['hasBookmaker'] = item2.bookRates
                ? item2.bookRates.length > 0
                  ? 1
                  : 0
                : 0;
              if (item2.inPlay == 1 && inplaytype == 0) {
                highlightdata.push(item3.runnerData);
                highlightdataIds.push(item3.bfId);
              } else if (
                item2.inPlay != 1 &&
                inplaytype == 1 &&
                new Date(item2.startDate).getDate() === new Date().getDate()
              ) {
                highlightdata.push(item3.runnerData);
                highlightdataIds.push(item3.bfId);
              } else if (
                item2.inPlay != 1 &&
                inplaytype == 2 &&
                new Date(item2.startDate).getDate() === new Date().getDate() + 1
              ) {
                highlightdata.push(item3.runnerData);
                highlightdataIds.push(item3.bfId);
              }
            }
          });
          // }
        });
      });
      data['name'] = item.name;
      data['inplayData'] = highlightdata;
      data['id'] = 0;
      data['bfId'] = item.bfId;
      inplaydata.push(data);
    });
    return inplaydata;
  }

  tournamentlistwise(tourlistdata, day?: number) {
    var tournamentdata = [];
    if (tourlistdata && tourlistdata.tournaments) {
      _.forEach(tourlistdata.tournaments, (item, index) => {
        var data = {};
        data['id'] = index;
        data['name'] = item.name;
        data['day'] = item.day;

        if (item.day == day) {
          tournamentdata.push(data);
        }
      });
    }
    return tournamentdata;
  }

  matchlistwise(tourlistdata) {
    var matchdata = [];
    if (tourlistdata && tourlistdata.matches) {
      _.forEach(tourlistdata.matches, (item, index) => {
        var data = {};
        data['bfId'] = item.bfId;
        data['id'] = item.id;
        data['name'] = item.name;
        data['startDate'] = item.startDate;
        matchdata.push(data);
      });
    }
    return matchdata;
  }
  marketlistwise(matchlistdata, mtid, tourid, sprtId) {
    console.log(marketdata);
    var marketdata = [];
    if (matchlistdata && matchlistdata.markets) {
      _.forEach(matchlistdata.markets, (item, index) => {
        var data = {};
        data['bfId'] = item.bfId;
        data['id'] = item.id;
        data['SportId'] = sprtId;
        data['name'] = item.name;
        data['isMulti'] = item.isMulti;
        data['mtId'] = mtid;
        data['isBettingAllow'] = item.isBettingAllow;
        data['TourId'] = tourid;
        data['startTime'] = item.startTime;
        data['racing'] = item.racing ? true : false;
        data['inPlay'] = matchlistdata.inPlay;
        data['eventTypeId'] = matchlistdata.eventTypeId;
        marketdata.push(data);
        console.log(marketdata);

      });
    }
    return marketdata;
  }

  //serachwise
  Searchwisedata() {
    var highlightdata = [];
    _.forEach(
      DataFormatService.sportsData,
      function (item: ISportsData, index) {
        _.forEach(item.tournaments, function (item1: ITournament, index1) {
          _.forEach(item1.matches, function (item2: IMatch, index2) {
            _.forEach(item2.markets, function (item3: IMarket, index3) {
              if (item3.name == 'Match Odds' || item3.racing) {
                let obj = {};
                obj['bfId'] = item3?.bfId;
                obj['inPlay'] = item2.inPlay;
                obj['marketId'] = item3.id;
                obj['matchDate'] = item3.racing
                  ? item3.startTime
                  : item2.startDate;
                obj['matchId'] = item2.bfId;
                obj['matchName'] = item2.name;
                obj['sportName'] = item.name;
                obj['status'] = item2.status;
                obj['mtBfId'] = item2.bfId;
                obj['TourbfId'] = item1.bfId;
                obj['SportbfId'] = item.bfId;
                obj['isFancy'] = item2.isFancy;
                obj['racing'] = item3.racing;
                obj['name'] = item3.name;

                highlightdata.push(obj);
              }
            });
          });
        });
      }
    );
    // console.log('Highlight data', highlightdata);
    return highlightdata;
  }
}
