import {IdentityStrategy, PSNIdentityStrategy} from './index';
import {PSNIdentityStrategyImpl} from './psn-strategy';
import {provide} from '@angular/core';
/**
 * Created by Keyston on 5/17/2016.
 */


export const LOGIN_STRATEGY_PROVIDERS: any[] = [
  provide(PSNIdentityStrategy, {useClass: PSNIdentityStrategyImpl})

];
