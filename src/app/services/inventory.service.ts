import {Inventory} from '../components/inventory/inventory.model';
import {Injectable} from '@angular/core';
import {DUMMY_GEAR, Gear} from '../components/gear-overview/gear.model';
import {Gender, GearType} from '../common/models/common';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
import {LZString} from 'lz-string';
import {Http} from 'angular2/http';

/**
 * Created by xastey on 4/27/2016.
 */


const STORAGE_KEY = 'inventories';
@Injectable()
export class InventoryService {


  private _inventory: Inventory;

  private _api: string = 'https://api.myjson.com/';

  private _inventories: Inventory[] = [];


  constructor(private _http: Http) {

    let storage = localStorage.getItem(STORAGE_KEY);
    if (storage) this._inventories = JSON.parse(storage);

    if (this._inventories.length) {
      this._inventory = this._inventories[0];
    } else {
      this._inventory = new Inventory();
      // TODO: Add selector for choosing gender
      this._inventory.name = 'Default Build';
      this._inventory.gender = Gender.FEMALE;
      this._inventory.bodyArmor = DUMMY_GEAR;
    }


  }


  retrieve(gearType: GearType): Gear {

    return this._inventory[dashCaseToCamelCase(gearType)];
  }

  update(gearType: GearType, value: Gear) {

    this._inventory[dashCaseToCamelCase(gearType)] = value;


  }


  restore(base64: string) {
    this._inventory = JSON.parse(LZString.decompressFromBase64(base64));
  }

  save() {
    let id = this._inventory.id;
    let json = JSON.stringify(this._inventory);
    let url = this._api + '/bins';
    let request = id ? this._http.put(url, json).map(_ => url)
      : this._http.post(url, json).map((data: any) => data.uri);

    request.subscribe(endpoint => {
      id = endpoint.split('/').pop();
      if (!this._inventory.id) {
        this._inventories.unshift(this._inventory);
      }
      this._inventory.id = id;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._inventories));

    });


  }

  get inventory() {
    return this._inventory;
  }
}
