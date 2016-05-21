/**
 * Created by Keyston on 5/20/2016.
 */

import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class NavigationService {


  _event: EventEmitter<any>=new EventEmitter<any>();
  
  navigate()

}
