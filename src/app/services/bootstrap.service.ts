import {Injectable} from 'angular2/core';
import {ItemsService, isWeaponType} from './item.service';
import {ItemType, DivisionItem, GearRarity, ItemTalent} from '../common/models/common';
import {InventoryService} from './inventory.service';
import {Weapon} from '../components/inventory/inventory.model';
import {Gear} from '../components/gear-overview/gear.model';
/**
 * Created by xastey on 5/7/2016.
 */


@Injectable()
export class BootstrapService {

  constructor(private _itemsService: ItemsService,
              private _inventoryService: InventoryService) {

    _.forEach(ItemType, (itemType: ItemType, key: string) => {

      let isWeapon = isWeaponType(itemType);
      if (isWeapon && itemType !== ItemType.AR) return;
      this._itemsService
        .getDescriptorFor(itemType)
        .subscribe(descriptor => {

            let first = <DivisionItem>descriptor.items[GearRarity.SUPERIOR][0];


            let empty = isWeapon
              ? this._weaponDefaultState(descriptor.talents, itemType, first.name)
              : this._gearDefaultState(itemType, first.name);


            if (isWeapon) {
              this._inventoryService.updateWeapon('primary', <Weapon>empty);
            } else {
              this._inventoryService.update(itemType, empty);
            }
          }
        );

    });

  }

  private _weaponDefaultState(talents: ItemTalent[], itemType, name: string): Weapon {

    let _talents = _.chain(talents).take(2).map(talent => {
      return {id: talent.id};
    }).value();
    return {
      rarity: GearRarity.SUPERIOR,
      type: itemType,
      name: name,
      score: 131,

      stats: {
        damage: 13500,
        rpm: 750,
        magazine: 37
      },
      mods: [],
      talents: _talents
    };
  }

  private _gearDefaultState(itemType: ItemType, name: string): Gear {
    return {
      rarity: GearRarity.SUPERIOR,
      type: itemType,
      name: name,
      score: 131,
      stats: {
        firearms: 0,
        stamina: 0,
        electronics: 0

      },
      armor: 100,
      attributes: {
        major: [],
        minor: [],
        skill: []

      },
      mods: [],
      talents: []
    };
  }
}
