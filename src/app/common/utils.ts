/**
 * Created by xastey on 4/4/2016.
 */

import * as _ from 'lodash';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";


export const noop = ()=> {
};


export function without(collection, element):()=>any {

  if (!collection) return noop;
  var index = collection.indexOf(element);
  if (index == -1 && element.hasOwnProperty("id")) index = collection.indexOf(_.find(collection, {id: element.id}));
  if (index > -1) collection.splice(index, 1);

  return function () {
    collection.splice(index, 0, element);
  }

}


const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
export function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  });
}

export function asObservable<T>(subject:Subject<T>):Observable<T> {
  return new Observable(fn => subject.subscribe(fn));
}