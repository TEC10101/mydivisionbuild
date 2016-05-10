/*
 * These are globally available services in any component or any other service
 */


import {FORM_PROVIDERS, LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';

// Angular 2

// Angular 2 Http
// Angular 2 Router

// Angular 2 Material
// TODO(gdi2290): replace with @angular2-material/all
//import {MATERIAL_PROVIDERS} from './angular2-material2';

/*
 * Application Providers/Directives/Pipes
 * providers/directives/pipes that only live in our browser environment
 */
export const APPLICATION_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  //...MATERIAL_PROVIDERS,
  ...ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: HashLocationStrategy }
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
