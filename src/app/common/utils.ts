/**
 * Created by xastey on 4/4/2016.
 */

import * as _ from 'lodash';



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
