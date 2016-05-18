/**
 * Created by xastey on 4/2/2016.
 */

import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {RouteConfig} from '@angular/router-deprecated';
import {Gear} from './components/item-overview/item-overview.component';
import {EditorService} from './services/editor-service';
import {AttributesService} from './services/attributes.service';
import {InventoryRootComponent} from './components/inventory/inventory.component';
import {DUMMY_GEAR} from './components/item-overview/gear.model';
import {BootstrapService} from './services/bootstrap.service';
import {
  BuildStatsBannerComponent
}
  from './components/build-stats-banner/build-stats-banner.component';
import {AuthComponent} from './components/auth/auth.component';
import {InventoryService} from './services/inventory.service';


@Component({
  selector: 'my-division-build',

  pipes: [],
  styles: [require('./assets/styles/app.scss')],
  directives: [BuildStatsBannerComponent, AuthComponent],
  encapsulation: ViewEncapsulation.None,
  template: require('./my-division-build-app.html'),

  providers: []
})

@RouteConfig([

  {path: '/...', name: 'InventoryRoot', component: InventoryRootComponent}

])
export class App {


  loaded: boolean = false;

  constructor(private _bootstrapService: BootstrapService) {


    _bootstrapService.boot().subscribe((service: InventoryService) => {
      service.freeze();
      this.loaded = true;
    });
  }


}
