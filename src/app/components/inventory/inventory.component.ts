/**
 * Created by xastey on 4/22/2016.
 */
import {Component, Input} from "angular2/core";
import {DUMMY_GEAR} from "../gear-overview/gear.model";
import {Inventory} from "./inventory.model";
import {InventoryGearItemComponent} from "./inventory-gear-item.component";
import {Router, RouteConfig, RouterOutlet} from "angular2/router";
import {InventoryGearItemsComponent} from "./inventory-gear-items.component";

@Component({

  selector: 'inventory',
  styles: [require('./inventory.component.scss')],
  templateUrl: 'app/components/inventory/inventory.component.html',
  directives: [InventoryGearItemComponent]
})
export class InventoryComponent {

  @Input() inventory:Inventory;


  constructor(private _router:Router) {
    this.inventory = new Inventory();
    this.inventory.bodyArmor = DUMMY_GEAR;
  }

  navigate(part) {
    this._router.navigate(['Inventory' + part])
  }
}


@Component({
  template: '<router-outlet></router-outlet>',
  directives: [RouterOutlet]
})
@RouteConfig([
  {path: '/inventory', name: 'Inventory', component: InventoryComponent, useAsDefault: true},
  {path: '/inventory/bodyArmor', name: 'InventoryBodyArmor', component: InventoryGearItemsComponent}

])
export class InventoryRootComponent {

}
