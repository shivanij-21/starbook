import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-slot-list',
  templateUrl: './slot-list.component.html',
  styleUrls: ['./slot-list.component.scss']
})
export class SlotListComponent implements OnInit {


  @ViewChild('tab1', { read: ElementRef }) public tab: ElementRef<any>;
  slotlists: any;
  slotfilter: any;
  gameId: any;
  filterData: any[];
  slotfilters: any = "fish";
  data: any[];
  final: any;
  index: number;

  constructor(private game: GamesService, private route: ActivatedRoute) {
    $('#page_loading').css('display', 'block');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameId = params.gameId;
      console.log(this.gameId);

    })
    this.slotlist()
  }
  slotlist() {
    this.game.slotlist().subscribe((resp: any) => {
      this.slotlists = resp.content.gameList;
      this.slotfilter = resp.content.gameLabels
      this.slotfilter = this.slotfilter.filter((game) => {
        return !game.includes('live_dealers');
      });
      this.slotfilter = this.slotfilter.filter((game) => {
        return !game.includes('more_expensive');
      });
      this.slotfilter = this.slotfilter.filter((game) => {
        return !game.includes('altente');
      });

      console.log(this.slotfilter);

      this.slotFilter('fish')
      $('#page_loading').css('display', 'none');
    })
  }

  slotFilter(filter) {
    let filterData = []
    this.slotfilters = filter
    this.slotlists.forEach(element => {
      if (this.slotfilters == element.label) {
        filterData.push(element)
      }
    });
    this.data = filterData

  }

  public scrollRight(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft + 200), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tab.nativeElement.scrollTo({ left: (this.tab.nativeElement.scrollLeft - 200), behavior: 'smooth' });
  }


}
