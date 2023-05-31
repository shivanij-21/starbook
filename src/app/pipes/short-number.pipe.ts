import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber',
})
export class ShortNumberPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    if (value !== null && !isNaN(value)) {
      let output =
        value > 999
          ? Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
              value / 1000
            ) + 'k'
          : value;

      return output;
    }
  }
}
