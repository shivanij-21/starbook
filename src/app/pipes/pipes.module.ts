import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndianCurrencyPipe } from './indian-currency.pipe';
import { ShortNumberPipe } from './short-number.pipe';

@NgModule({
  declarations: [IndianCurrencyPipe, ShortNumberPipe],
  imports: [CommonModule],
  exports: [IndianCurrencyPipe, ShortNumberPipe],
})
export class PipesModule {}
