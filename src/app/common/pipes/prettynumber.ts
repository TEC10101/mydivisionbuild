/**
 * Created by xastey on 4/3/2016.
 */


import {Pipe, PipeTransform} from "angular2/core";

@Pipe({name: "prettynumber"})
export class PrettyNumberPipe implements PipeTransform {

  transform(value:any, args:any[]):string {
    return value.toLocaleString()
  }
}
