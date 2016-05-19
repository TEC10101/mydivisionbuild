/**
 * Created by Keyston on 5/18/2016.
 */
import {OpaqueToken} from '@angular/core';

export const APP_CONFIG = new OpaqueToken('app.config');


export interface AppConfig {

  baseUrl: string;
}
