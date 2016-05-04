import {Inventory} from "../components/inventory/inventory.model";
import {Injectable} from "angular2/core";
import {DUMMY_GEAR, Gear} from "../components/gear-overview/gear.model";
import {Gender, GearType} from "../common/models/common";
import {dashCaseToCamelCase} from "angular2/src/platform/dom/util";
import {LZString} from "lz-string";
import {Http} from "angular2/http";

/**
 * Created by xastey on 4/27/2016.
 */

@Injectable()
export class InventoryService {


  private _inventory:Inventory;

  private _api:string = "https://api.myjson.com/";


  constructor(private _http:Http) {
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


  restore(base64:string) {
    LZString.decompressFromBase64(base64);
  }

  save(id?:string) {
    let json = JSON.stringify(this._inventory);
    let url = this._api + "/bins";
    let request = id ? this._http.put(url, json).map(_=> url)
      : this._http.post(url, json).map((json:any)=>json.uri)

    request.subscribe(url=> {
      let id = url.split("/").pop();
      // localStorage.set
    })


  }

  get inventory() {
    return this._inventory;
  }
}
