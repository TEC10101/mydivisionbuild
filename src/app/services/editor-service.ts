import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
/**
 * Created by Keyston on 4/7/2016.
 */

@Injectable()
export class EditorService {

  private _current: boolean = true;
  private event = new BehaviorSubject<boolean>(this._current);


  toggle() {
    this.event.next(this._current = !this._current);
  }

  subscribe(generatorOrNext?: any, error?: any, complete?: any): any {
    return this.event.subscribe(generatorOrNext, error, complete);
  }

  get state() {
    return this._current;
  }

  on() {
    this.event.next(this._current = true);
  }

  off() {
    this.event.next(this._current = false);
  }
}
