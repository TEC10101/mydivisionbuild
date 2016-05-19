import {
  Inventory, InventoryItem, Weapon
}
  from '../components/inventory/inventory.model';
import {Injectable, Inject, forwardRef} from '@angular/core';
import {DUMMY_GEAR, Gear} from '../components/item-overview/gear.model';
import {Gender, ItemType, WeaponSlot} from '../common/models/common';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';

import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {isWeaponType, ItemsService} from './item.service';
import * as _ from 'lodash/index';

import {BehaviorSubject} from 'rxjs';
import {asObservable} from '../common/utils';
import {Observable} from 'rxjs/Observable';
import {BuildStatsService} from './build-stats.service';


/**
 * Created by Keyston on 4/27/2016.
 */

type Inventories = {[id: string]: InventoryInfo}

interface BuildMeta {
  firearms: number;
  stamina: number;
  electronics: number;
  dps: number;
  health: number;
  skillpower: number;
}


interface InventoryInfo {
  name: string;
  id: string;
  url: string;
  meta?: BuildMeta;
}
const STORAGE_KEY = 'inventories';
@Injectable()
export class InventoryService {

  _weaponSelected = new BehaviorSubject<Weapon>(void 0);
  private _inventory: Inventory;

  private _api: string = 'https://api.myjson.com/bins';


  private _inventories: Inventories;

  private _stats: BuildStatsService;
  private _defaultInventoryState: Inventory;


  get weaponSelected(): Observable<Weapon> {
    return asObservable(this._weaponSelected.filter((x, _) => !!x));
  }

  _isWeaponSlot(value: string) {
    return !!_.includes(_.values(WeaponSlot), value);
  }

  _inventoryItemSlot(value: string) {
    return this._isWeaponSlot(value) ? 'weapons' : 'gear';
  }

  constructor(private _http: Http,
              @Inject(forwardRef(() => ItemsService))
                itemsService: ItemsService) {


    let storage = localStorage.getItem(STORAGE_KEY);
    if (storage) this._inventories = <Inventories>JSON.parse(storage);
    this._stats = new BuildStatsService(itemsService, this);
    this.reset();


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
    if (slot === 'primary' && !this._weaponSelected.getValue()) {
      this._weaponSelected.next(value);
    }
  }

  update(itemType: ItemType, value: InventoryItem) {

    this._inventory.gear
      [dashCaseToCamelCase(itemType)] = value;


  }


  remove(id) {

    delete this._inventories[id];
  }

  save() {
    let id = this._inventory.id || '';

    let json = JSON.stringify(this._inventory);


    let url = this._api + (id ? `/${id}` : '');

    let headers = new Headers({'Content-Type': 'application/json; charset=UTF-8'});
    let options = new RequestOptions({headers: headers});

    let request = id ? this._http.put(url, json, options).map(_ => {
      return {
        id: id,
        url: url
      };
    })
      : this._http.post(url, json, options).map((resp: Response) => {
      let uri = resp.json().uri;
      return {
        url: uri,
        id: uri.split('/').pop()
      };
    });

    request.subscribe((data: InventoryInfo) => {

      data.name = this._inventory.name;


      let calc = this._stats.create();
      data.meta = {
        firearms: calc.firearms,
        stamina: calc.stamina,
        electronics: calc.electronics,
        dps: calc.caculateDps(this._inventory.weapons.primary),
        health: calc.health,
        skillpower: calc.skillpower
      };


      this._inventories[data.id] = data;

      this._inventory.id = data.id;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._inventories));

    });


  }

  get inventory() {
    return this._inventory;
  }

  load(id?: string) {

    if (id) {
      let url = this._api + '/' + id;
      this._http.get(url)
        .map((resp) => <Inventory>resp.json())
        .subscribe(
          inventory => {
            this._inventory = inventory;

          },
          error => console.log('Not Found')
        );
    } else {
      this.reset();
    }

  }

  reset() {
    this._inventory = new Inventory();
    // TODO: Add selector for choosing gender
    this._inventory.name = 'New Build';
    this._inventory.gender = Gender.FEMALE;
  };

  owns() {
    if (!this._inventory) return false;
    let id = this._inventory.id;
    return !id || !!this._inventories[id];
  }

  freeze() {
    this._defaultInventoryState = _.cloneDeep(this._inventory);
  }
}
