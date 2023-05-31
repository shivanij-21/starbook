import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss'],
})
export class CookieComponent implements OnInit {
  activeTab: string = 'term';
  constructor() {}

  ngOnInit(): void {}

  showTab(tabName) {
    this.activeTab = tabName;
  }
}
