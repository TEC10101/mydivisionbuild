/**
 * Created by Keyston on 5/18/2016.
 */
import {isString, isBlank} from '@angular/core/src/facade/lang';

import {PipeTransform, Pipe, Inject} from '@angular/core';
import {
  InvalidPipeArgumentException
} from
  '@angular/common/src/pipes/invalid_pipe_argument_exception';
import {APP_CONFIG, AppConfig} from '../config';

@Pipe({name: 'asset'})
export class AssetPipe implements PipeTransform {
  constructor(@Inject(APP_CONFIG) private _config: AppConfig) {
  }

  transform(value: string, args: any[] = []): string {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(AssetPipe, value);
    }
    return this._config.baseUrl + value;
  }
}
