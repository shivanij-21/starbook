import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BetslipService {

  private _events = new Subject<any>();
  events$ = this._events.asObservable();

  constructor() { }

  emitEvent(data) {
    this._events.next(data);
  }
}
