/**
 * Created by xastey on 4/3/2016.
 */


import {Pipe, PipeTransform} from '@angular/core';
import {ValueFormat} from '../../common/models/common';


const WEAPON_THRESHOLD = 10000;
const WEAPON_BASE = 10;

@Pipe({name: 'attribute'})
export class AttributePipe implements PipeTransform {

  transform(value: number, format: ValueFormat = ValueFormat.NUMBER): string {

    let tail = format === ValueFormat.PERCENT ? '%' : '';
    if (!value || isNaN(value)) return '0' + tail;


    if (format === ValueFormat.PERCENT) {
      return value + '%';
    }
    if (format === ValueFormat.WEAPON) {
      return value >= WEAPON_THRESHOLD ?
      (WEAPON_BASE + ((value - WEAPON_THRESHOLD) * .001)) + 'k' :
        value.toLocaleString();
    }
    return value.toLocaleString();
  }
}
