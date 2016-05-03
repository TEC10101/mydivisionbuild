import {Inventory} from "../components/inventory/inventory.model";
import {Injectable} from "angular2/core";
import {DUMMY_GEAR, Gear} from "../components/gear-overview/gear.model";
import {Gender, GearType} from "../common/models/common";
import {dashCaseToCamelCase} from "angular2/src/platform/dom/util";

/**
 * Created by xastey on 4/27/2016.
 */

@Injectable()
export class InventoryService {


  private _inventory:Inventory;


  constructor() {
    this._inventory = new Inventory();
    // TODO: Add selector for choosing gender
    this._inventory.gender = Gender.FEMALE;
    this._inventory.bodyArmor = DUMMY_GEAR;


  }


  retrieve(gearType:GearType):Gear {

    return this._inventory[dashCaseToCamelCase(gearType)];
  }

  update(gearType:GearType, value:Gear) {

    this._inventory[dashCaseToCamelCase(gearType)] = value;


  }

  get inventory() {
    return this._inventory;
  }
}
