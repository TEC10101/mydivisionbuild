/**
 * Created by Keyston on 5/17/2016.
 */

import {provide} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PSNIdentityStrategyImpl} from './psn-strategy';
import {RouteParams} from '@angular/router-deprecated';
import {AuthType} from '../auth.service';
export interface LoginResult {
}


export interface IdentityStrategyConf {
  lang?: string;
  region?: string;
}
export abstract class IdentityStrategy {


  constructor() {
    let self = this;
    window[this._callBackMethodName] = (params) => this._authCallback(params);
  }

  abstract  id(): AuthType;

  abstract login(): Observable<LoginResult>;

  abstract config(config: IdentityStrategyConf);

  abstract callback(params: RouteParams);

  get _callbackUrl() {
    let loc = window.location;
    return loc.protocol + loc.host + '/#/authCallback/' + this.id;

  }

  abstract _authCallback(params);

  get _callBackMethodName() {
    return '_auth_' + this.id + '_callback_';
  }

  _completeLogin(params) {
    let func = window.opener[this._callBackMethodName];
    if (func) func(params);
    window.close();
  }

  get _saveKey() {
    return '_auth_' + this.id;
  }

  _info(): any {
    let info = localStorage.getItem(this._saveKey);
    return info ? JSON.parse(info) : {};

  }

  _save(info) {
    localStorage.setItem(this._saveKey, JSON.stringify(info));
  }


}

export abstract class PSNIdentityStrategy extends IdentityStrategy {
}

