import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollapseModule } from "ngx-bootstrap/collapse";
import { SortByDatePipe } from '../pipes/sort-by-date.pipe';
import { InplayComponent } from './inplay/inplay.component';
import { SportsComponent } from './sports.component';

const routes: Routes = [
  { path: 'inplay', component: InplayComponent},
  { path: '', children: [{ path: ':sportId', component: SportsComponent }] },
];

@NgModule({
  declarations: [SportsComponent, InplayComponent,SortByDatePipe],
  imports: [CommonModule, RouterModule.forChild(routes), CollapseModule.forRoot()],
})
export class SportsModule {}
