import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  siteName = environment.siteName;


  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private titleService: Title,
  ) {
    // if (this.siteName == "exch4") {
    //   let siteName = "exchange 4";
    //   this.titleService.setTitle(siteName.toUpperCase());
    // } else {
    //   this.titleService.setTitle(this.siteName.toUpperCase());
    // }
    let favicon = this._document.querySelector('#appIcon') as HTMLLinkElement;
    favicon.href = "assets/images/favicon/" + this.siteName + ".ico";
  }
}
