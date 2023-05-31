import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from './number-only.directive';
import { ExportDataDirective } from './export-data.directive';
import { NumberRangeDirective } from './number-range.directive';

@NgModule({
  declarations: [NumberOnlyDirective, ExportDataDirective, NumberRangeDirective],
  imports: [CommonModule],
  exports: [NumberOnlyDirective, ExportDataDirective, NumberRangeDirective],
})
export class DirectivesModule {}
