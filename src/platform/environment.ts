// Angular 2
import {enableProdMode, provide} from '@angular/core';
import {APP_CONFIG} from '../app/common/config';

// Environment Providers
let PROVIDERS = [];

if ('production' === ENV) {
  // Production
  enableProdMode();

  PROVIDERS = [
    ...PROVIDERS,
    provide(APP_CONFIG, {
      useValue: {
        baseUrl: 'dist/assets'
      }
    })
  ];

} else {
  // Development
  PROVIDERS = [
    ...PROVIDERS,
    provide(APP_CONFIG, {
      useValue: {
        baseUrl: 'app/assets'
      }
    })
  ];

}


export const ENV_PROVIDERS = [
  ...PROVIDERS
];
