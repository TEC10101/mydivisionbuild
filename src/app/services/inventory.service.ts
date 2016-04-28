import {Inventory} from "../components/inventory/inventory.model";
import {Injectable} from "angular2/core";
import {DUMMY_GEAR} from "../components/gear-overview/gear.model";
import {Gender} from "../common/models/common";

/**
 * Created by xastey on 4/27/2016.
 */

@Injectable()
export class InventoryService {


  private _inventory:Inventory;


  constructor() {
    this._inventory = new Inventory();
    this._inventory.gender = Gender.FEMALE;
    this._inventory.bodyArmor = DUMMY_GEAR;


  }

  get inventory() {
    return this._inventory;
  }
}
