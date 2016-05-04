/**
 * Created by xastey on 4/22/2016.
 */
import {Component} from "@angular/core";
import {Inventory} from "./inventory.model";
import {InventoryGearItemComponent} from "./gear-item/inventory-gear-item.component";
import {Router, RouteConfig, RouterOutlet} from "@angular/router-deprecated";
import {InventoryGearItemsComponent} from "./gear-items/inventory-gear-items.component";
import {InventoryService} from "../../services/inventory.service";


@Component({

  selector: 'inventory',
  styles: [require('./inventory.component.scss')],
  template: require('./inventory.component.html'),
  directives: [InventoryGearItemComponent]
})
export class InventoryComponent {


  inventory: Inventory;


  constructor(private _router: Router, private _inventoryService: InventoryService) {
    this.inventory = this._inventoryService.inventory;

  }

  navigate(type) {
    this._router.navigate(['InventoryList', {gearType: type}]);
  }
}


@Component({
  template: '<router-outlet></router-outlet>',
  directives: [RouterOutlet]
})
@RouteConfig([
  {path: '/inventory', name: 'Inventory', component: InventoryComponent, useAsDefault: true},
  {path: '/inventory/:gearType', name: 'InventoryList', component: InventoryGearItemsComponent}


])
export class InventoryRootComponent {

}
