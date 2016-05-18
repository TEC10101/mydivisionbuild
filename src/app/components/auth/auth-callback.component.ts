/**
 * Created by Keyston on 5/17/2016.
 */

import {Component, OnInit} from '@angular/core';
import {AuthService, AuthType} from '../../services/auth.service.ts';
import {RouteParams} from '@angular/router-deprecated';

@Component({
  selector: 'auth-callback',
  template: require('./auth.component.html')
})
export class AuthCallbackComponent implements OnInit {


  constructor(private _loginService: AuthService, private _routeParams: RouteParams) {


  }

  ngOnInit(): any {
    let loginStrategy = <AuthType>this._routeParams.get('strategy');
    if (loginStrategy) {
      let strategy = this._loginService.authFor(loginStrategy);
      strategy.callback(this._routeParams);
    }
  }

 
}
