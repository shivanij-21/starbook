import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { CommonService } from './services/common.service';
import { IApis } from './shared/types/apis';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  siteName = environment.siteName;

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private commonService: CommonService,
    private titleService: Title,
  ) {
    if (this.siteName == "exch4") {
      let siteName = "exchange 4";
      this.titleService.setTitle(siteName.toUpperCase());
    } else {
      this.titleService.setTitle(this.siteName.toUpperCase());
    }
    let favicon = this._document.querySelector('#appIcon') as HTMLLinkElement;
    favicon.href = "assets/images/favicon/" + this.siteName + ".ico";
    this.loadStyle('assets/theme/' + this.siteName + '.css');
  }


  ngOnInit() {
    this.commonService.getApis().subscribe((res: IApis) => {
      this.commonService.apis$.next(res);
    });
  }

  ngAfterViewInit() {
    let text = `
    !function() {
      function detectDevTool(allow) {
        if(isNaN(+allow)) allow = 100;
        var start = +new Date();
        debugger;
        var end = +new Date();
        if(isNaN(start) || isNaN(end) || end - start > allow) {
          window.location.href = "https://www.google.com";
        }
      }
      if(window.attachEvent) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
          detectDevTool();
          window.attachEvent('onresize', detectDevTool);
          window.attachEvent('onmousemove', detectDevTool);
          window.attachEvent('onfocus', detectDevTool);
          window.attachEvent('onblur', detectDevTool);
        } else {
          setTimeout(argument.callee, 0);
        }
      } else {
        window.addEventListener('load', detectDevTool);
        window.addEventListener('resize', detectDevTool);
        window.addEventListener('mousemove', detectDevTool);
        window.addEventListener('focus', detectDevTool);
        window.addEventListener('blur', detectDevTool);
      }
    }();
      `;
    let script = <HTMLScriptElement>this.renderer2.createComment('script');
    script.type = 'text/javascript';
    script.text = text;
    this.renderer2.appendChild(this._document.body, script);
  }
  loadStyle(styleName: string) {
    const head = this._document.getElementsByTagName('head')[0];

    let themeLink = this._document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this._document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }
}
