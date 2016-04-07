/**
 * Created by xastey on 4/7/2016.
 */


import {Pipe, PipeTransform} from "angular2/core";
import {Attribute} from "./attributes.model";
@Pipe({
  name: "attributeRestrict",
  pure: false
})
export class AttributeRestrictPipe implements PipeTransform {

  transform(values:Attribute[], [selection]):any {
    if (selection.length == 1) {
      return values;
    }
    let ids = selection.map((attr:Attribute)=> attr.id);
    return values.filter((attr:Attribute)=> ids.indexOf(attr.id) == -1)
  }
}
