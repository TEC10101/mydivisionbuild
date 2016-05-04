/**
 * Created by Keyston on 4/2/2016.
 */

import {isString, isBlank} from "@angular/core/src/facade/lang";
import {PipeTransform, Pipe} from "@angular/core";
import {InvalidPipeArgumentException} from "@angular/common/src/pipes/invalid_pipe_argument_exception";


@Pipe({name: 'ucfirst'})
export class UcFirstPipe implements PipeTransform {
  transform(value: string, args: any[] = []): string {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(UcFirstPipe, value);
    }
    function apply(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (args.length) {
      return value.split(args[0]).map(apply).join(args[0]);
    }
    return apply(value);
  }
}
