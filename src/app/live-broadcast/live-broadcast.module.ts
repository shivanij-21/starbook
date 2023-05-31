import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from "ngx-bootstrap/accordion";
import { LiveBroadcastComponent } from './live-broadcast.component';

const routes: Routes = [{ path: '', component: LiveBroadcastComponent }];

@NgModule({
  declarations: [LiveBroadcastComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AccordionModule.forRoot(),
  ],
  exports: [RouterModule],
})
export class LiveBroadcastModule {}
