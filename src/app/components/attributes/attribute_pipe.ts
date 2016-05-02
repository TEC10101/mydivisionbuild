/**
 * Created by xastey on 4/3/2016.
 */


import {Pipe, PipeTransform} from "angular2/core";
import {ValueFormat} from "../../common/models/common";


@Pipe({name: "attribute"})
export class AttributePipe implements PipeTransform {

  transform(value:number, [format]):string {

    if (!value || isNaN(value)) return "0";

    if (format == ValueFormat.PERCENT) {
      return value + "%";
    }
    return value.toLocaleString();
  }
}
