import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  constructor(private titleService:Title) { }

  ngOnInit(): void {
    
// this.titleService.setTitle('Exchange|Reports');
  }

}
