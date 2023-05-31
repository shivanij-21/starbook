import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookieComponent } from './cookie/cookie.component';

const routes: Routes = [
  { path: '', component: CookieComponent },
];

@NgModule({
  declarations: [
    CookieComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TermsModule {}
