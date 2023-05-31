import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'sortByDate',
  pure: true
})
export class SortByDatePipeHome implements PipeTransform {

  constructor(){

  }

  transform(array: any[], args: string): any {
    if (typeof args[0] === "undefined") {
      return array;
    }
    array = _.sortBy(array, (a: any, b: any) => {
      return new Date(a.matchDate);
    });
    return array;
  }

}
