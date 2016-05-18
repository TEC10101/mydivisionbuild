import {AuthService, AuthType} from '../../services/auth.service';
import {Component, OnInit} from '@angular/core';
/**
 * Created by Keyston on 5/17/2016.
 */

@Component({
  selector: 'auth',
  template: require('./auth.component.html')
})
export class AuthComponent {

  constructor(private _loginService: AuthService) {

  }

  login(type: AuthType) {
    let strategy = this._loginService.authFor(type);
    strategy.login().subscribe(
      res => console.log(res),
      error => console.error(error),
      () => console.log('Completed login')
    );
  }
}
