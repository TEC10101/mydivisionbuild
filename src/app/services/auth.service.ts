/**
 * Created by Keyston on 5/17/2016.
 */
import {Injectable, provide} from '@angular/core';

import {
  PSNIdentityStrategy, IdentityStrategy
}
  from './login-strategies/index';
import {LOGIN_STRATEGY_PROVIDERS} from './login-strategies/strategy';
import {Dictionary} from '../common/models/common';


class AuthStrategies {
  [index: string]: IdentityStrategy;

}


export type AuthType = 'psn' | 'xbox' | 'steam' | 'uplay';
// tslint:disable-next-line
export const AuthType = {
  PSN: 'psn' as AuthType
};
@Injectable()
export class AuthService {

  constructor(private _strategies: AuthStrategies) {

  }


  authFor(authType: AuthType): IdentityStrategy {
    return <IdentityStrategy>this._strategies[authType];
  }
}


export const AUTH_PROVIDERS: any[] = [
  ...LOGIN_STRATEGY_PROVIDERS,
  provide(AuthStrategies, {
    useFactory: (psn: PSNIdentityStrategy) => {
      let strategies = new AuthStrategies();
      strategies[AuthType.PSN] = psn;
      return strategies;
    },
    deps: [PSNIdentityStrategy]
  }),
  AuthService

];


