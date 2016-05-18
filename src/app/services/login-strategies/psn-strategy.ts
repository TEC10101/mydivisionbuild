import {PSNIdentityStrategy, LoginResult, IdentityStrategyConf} from './index';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {asObservable} from '../../common/utils';
import {RouteParams} from '@angular/router-deprecated';
import {AuthType} from '../auth.service';
/**
 * Created by Keyston on 5/17/2016.
 */


const SEN_BASE_URL = 'https://auth.api.sonyentertainmentnetwork.com';
const SERVICE_ENTITY = 'urn:service-entity:psn';
const STATE = '1156936032';
const REDIRECT_URL = 'com.scee.psxandroid.scecompcall://redirect';
const CLIENT_ID = 'b0d0d7ad-bb99-4ab1-b25e-afa0c76577b0';
// PSN Scope, now edited with more scopes
const PSN_SCOPE = 'psn:sceapp,user:account.get,user:account.settings.' +
  'privacy.get,user:account.settings.privacy.update,user:account.realName.get,' +
  'user:account.realName.update,kamaji:get_account_hash';
const CLIENT_SECRET = 'Zo4y8eGIa3oazIEp';

// I still don't know what "duid" stands for... if you do, create an issue about it please!
const DUID = '00000005006401283335353338373035333434333134313a' +
  '433635303220202020202020202020202020202020';
const OAUTH_URL = 'https://auth.api.sonyentertainmentnetwork.com/2.0/oauth/token';

interface OauthCallbackParams {
  state: string;
  code: string;
  authCode: string;

}
interface OauthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  timestamp: number;
}
@Injectable()
export class PSNIdentityStrategyImpl extends PSNIdentityStrategy {


  private _window: Window;
  private _processedCallback: boolean = false;
  private _pendingResults: Subject<LoginResult>;
  private _pending: boolean = false;

  constructor(private _http: Http) {
    super();

  }

  id() {
    return AuthType.PSN;
  }

  config(config: IdentityStrategyConf) {
  }

  callback(params: RouteParams) {
    let code = params.get('code');
    let state = params.get('state');
    let authCode = params.get('authCode');
    this._completeLogin({
      authCode: authCode,
      code: code,
      state: state
    });

  }


  get _accessToken(): string {
    return (<OauthResponse>this._info()).access_token;
  }

  _authCallback(params: OauthCallbackParams) {
    this._processedCallback = true;
    this._resolveAuthToken(params);
  }

  _resolveAuthToken(oauth: OauthCallbackParams) {

    if (this._window && !this._window.closed) {
      this._window.close();

    }
    let params = {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: oauth.authCode,
      redirect_uri: REDIRECT_URL,
      state: 'x',
      scope: PSN_SCOPE,
      duid: DUID
    };

    this._http
      .post(OAUTH_URL, JSON.stringify(params))
      .map(res => <OauthResponse>res.json())
      .subscribe(
        (resp: OauthResponse) => {
          resp.timestamp = (new Date()).getTime();
          this._processedCallback = false;
          this._pending = false;
          this._save(resp);
        },
        error => console.log(error),
        () => console.log('auth completed')
      );

  }


  get _url() {
    let url = SEN_BASE_URL;
    url += '/2.0/oauth/authorize?response_type=code&service_entity=' + SERVICE_ENTITY;
    url += '&returnAuthCode=true&state=' + STATE;
    url += '&redirect_uri=' + REDIRECT_URL;
    url += '&client_id=' + CLIENT_ID + '&scope=' + PSN_SCOPE;
    return url;
  }


  login(): Observable<LoginResult> {

    this._processedCallback = false;
    this._pending = true;

    this._pendingResults = new Subject<LoginResult>();
    let url = this._url;
    console.log(url);
    let win = window.open(url, 'PSNLogin', 'height=200,width=300');

    /*win.addEventListener('beforeunload', (event) => {
     if (!this._processedCallback && this._pending) {


     alert('User exited from popup');
     }
     });*/
    return asObservable(this._pendingResults, true);
  }


}

