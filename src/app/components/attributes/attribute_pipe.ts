/**
 * Created by xastey on 4/3/2016.
 */


import {Pipe, PipeTransform} from "angular2/core";
import {AttributeFormat} from "../../common/models/common";


@Pipe({name: "attribute"})
export class AttributePipe implements PipeTransform {

  transform(value:number, [format]):string {


    if (format == AttributeFormat.PERCENT) {
      return value + "%";
    }
    return value.toLocaleString();
  }
}
