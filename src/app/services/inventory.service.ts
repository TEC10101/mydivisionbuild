import {
  Inventory, InventoryItem, Weapon
}
  from '../components/inventory/inventory.model';
import {Injectable, EventEmitter} from '@angular/core';
import {DUMMY_GEAR, Gear} from '../components/item-overview/gear.model';
import {Gender, ItemType, WeaponSlot} from '../common/models/common';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
import {LZString} from 'lz-string';
import {Http} from '@angular/http';
import {isWeaponType} from './item.service';
import * as _ from 'lodash/index';
import {BehaviorSubject} from 'rxjs';
import {asObservable} from '../common/utils';
import {Observable} from 'rxjs/Observable';


/**
 * Created by Keyston on 4/27/2016.
 */


const STORAGE_KEY = 'inventories';
@Injectable()
export class InventoryService {

  _weaponSelected = new BehaviorSubject<Weapon>(void 0);
  private _inventory: Inventory;

  private _api: string = 'https://api.myjson.com/';


  private _inventories: Inventory[] = [];


  get weaponSelected(): Observable<Weapon> {
    return asObservable(this._weaponSelected.filter((x, _) => !!x));
  }

  _isWeaponSlot(value: string) {
    return !!_.includes(_.values(WeaponSlot), value);
  }

  _inventoryItemSlot(value: string) {
    return this._isWeaponSlot(value) ? 'weapons' : 'gear';
  }

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

    }


  }


  retrieveWeapon(slot: ItemType): Weapon {
    return this._inventory.weapons[slot];
  }

  retrieve(itemType: ItemType): Gear {


    return this._inventory[this._inventoryItemSlot(itemType)]
      [dashCaseToCamelCase(itemType)];
  }

  updateWeapon(slot: string, value: Weapon) {
    this._inventory.weapons[slot] = value;
    if (slot == 'primary' && !this._weaponSelected.getValue()) {
      this._weaponSelected.next(value);
    }
  }

  update(itemType: ItemType, value: InventoryItem) {

    this._inventory.gear
      [dashCaseToCamelCase(itemType)] = value;


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
