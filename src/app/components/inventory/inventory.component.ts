/**
 * Created by Keyston on 4/22/2016.
 */
import {Component} from '@angular/core';
import {Inventory} from './inventory.model';
import {InventoryItemComponent} from './inventory-item/inventory-item.component';
import {Router, RouteConfig, RouterOutlet, RouteParams} from '@angular/router-deprecated';
import {InventoryItemsComponent} from './inventory-items/inventory-items.component';
import {InventoryService} from '../../services/inventory.service';
import {AuthCallbackComponent} from '../auth/auth-callback.component';
import {InventoryDetailsComponent} from './inventory-details/inventory-details.component';


@Component({

  selector: 'inventory',
  styles: [require('./inventory.component.scss')],
  template: require('./inventory.component.html'),
  directives: [InventoryItemComponent]
})
export class InventoryComponent {


  inventory: Inventory;


  constructor(private _router: Router,
              private _inventoryService: InventoryService,
              private _routeParams: RouteParams) {
    this.inventory = this._inventoryService.inventory;

    let id = _routeParams.get('id');
    if (id) _inventoryService.load(id);

  }

  navigate(type) {
    this._router.navigate(['InventoryList', {itemType: type}]);
  }
}


@Component({
  template: '<router-outlet></router-outlet>',
  directives: [RouterOutlet]
})
@RouteConfig([
  {path: '/inventory', name: 'Inventory', component: InventoryComponent, useAsDefault: true},
  {path: '/inventory/:itemType', name: 'InventoryList', component: InventoryItemsComponent},
  {path: '/inventory/details', name: 'InventoryDetails', component: InventoryDetailsComponent},
  {path: '/authCallback/:strategy', name: 'AuthCallback', component: AuthCallbackComponent}


])
export class InventoryRootComponent {

}
