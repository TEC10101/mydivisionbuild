/**
 * Created by xastey on 5/7/2016.
 */


import {Injectable} from '@angular/core';
import {Inventory, Weapon, InventoryGear} from '../components/inventory/inventory.model';
@Injectable()
export class BuildCalculatorService {


  caculateDps(weapon: Weapon, inventory: InventoryGear) {

    return 12345;
  }

  caculateWeaponDamage(weapon: Weapon) {
    return weapon.stats.damage;
  }

  caculateWeaponRPM(weapon: Weapon) {
    return weapon.stats.rpm;
  }

  caculateWeaponMagazine(weapon: Weapon) {
    return weapon.stats.magazine;
  }
}
