/*
 * These are globally available pipes in any template
 */

import {PLATFORM_PIPES} from '@angular/core';
import {AssetPipe} from '../../app/common/pipes/asset.pipe';
import {AttributePipe} from '../../app/components/attributes/attribute.pipe';

// application_pipes: pipes that are global through out the application
export const APPLICATION_PIPES = [
  AssetPipe,
  AttributePipe
];

export const PIPES = [
  {provide: PLATFORM_PIPES, multi: true, useValue: APPLICATION_PIPES}
];
