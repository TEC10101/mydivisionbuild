/**
 * Created by xastey on 4/4/2016.
 */

import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {isArray} from '@angular/core/src/facade/lang';


export const noop = () => {
};


export function without(collection, element): () => any {

  if (!collection) return noop;
  let index = collection.indexOf(element);
  if (index === -1 && element.hasOwnProperty('id'))
    index = collection.indexOf(_.find(collection, {id: element.id}));
  if (index > -1) collection.splice(index, 1);

  return function () {
    collection.splice(index, 0, element);
  };

}

export function numberRange(low, high) {
  let step = 1;
  // check if a decimal is present
  if (low.toString().indexOf('.') !== -1 || high.toString().indexOf('.') !== -1) {
    step = .5;
  }
  let range = [];

  for (let i = low; i <= high; i += step) {

    range.push(i);

  }
  return range;
}


const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
export function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  });
}

export function asObservable<T>(subject: Observable<T>, once: boolean = false): Observable<T> {
  function wrap(obs) {
    return new Observable(fn => obs.subscribe(fn));
  }

  return once ? wrap(subject.first((x, idx, _) => isArray(x) ? !!x.length : !!x)) : wrap(subject);
}
