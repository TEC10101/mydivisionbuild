/**
 * Created by xastey on 4/26/2016.
 */
import {Component, Input, OnInit} from '@angular/core';
import {Gear} from '../../gear-overview/gear.model';
import {InventoryItemImageComponent} from '../inventory-item-image/inventory-item-image.component';
import {ItemsService, isWeaponType} from '../../../services/item.service';
import {ItemType, GearRarity, DivisionItem, WeaponSlot} from '../../../common/models/common';
import {InventoryService} from '../../../services/inventory.service';
import {InventoryItem, InventoryItemType, Weapon} from '../inventory.model';
import {Talent} from '../../talents/talent.model';


@Component({
  selector: 'inventory-item',
  styles: [require('./inventory-item.component.scss')],
  template: require('./inventory-item.component.html'),
  directives: [InventoryItemImageComponent]

})
export class InventoryItemComponent implements OnInit {


  @Input() item: InventoryItem;

  @Input('item-type') itemType: ItemType;
  @Input('inventory-item-type') inventoryItemType: InventoryItemType;
  @Input('weapon-slot') weaponSlot: WeaponSlot;


  constructor(private _itemsService: ItemsService, private _inventoryService: InventoryService) {
  }


  get isWeapon() {
    return isWeaponType(this.itemType);
  }

  get isGear() {
    return !isWeaponType(this.itemType);
  }

  ngOnInit(): any {

    if (!this.item)this._itemsService
      .getDescriptorFor(this.itemType)
      .subscribe(descriptor => {

          let first = <DivisionItem>descriptor.items[GearRarity.SUPERIOR][0];
          let isWeapon = isWeaponType(this.itemType);
          let empty = isWeapon
            ? this._weaponDefaultState(first.name)
            : this._gearDefaultState(first.name);


          if (isWeapon) {
            this._inventoryService.updateWeapon(this.weaponSlot, <Weapon>empty);
          } else {
            this._inventoryService.update(this.itemType, empty);
          }
        }
      );
  }


  talentIconStyle(talent: Talent) {


    let style = {};
    let icon = this._itemsService
      .talentImageResolve(talent.id);
    style['-webkit-mask-image'] = `url('${icon.primary}')`;
    return style;

  }

  hasStat(name) {
    return !this.item || isWeaponType(this.itemType) ? false : (<Gear>this.item).stats[name] > 0;
  }

  get statNames() {
    return ['firearms', 'stamina', 'electronics'];
  }

  private _weaponDefaultState(name: string): Weapon {

    return {
      rarity: GearRarity.SUPERIOR,
      type: this.itemType,
      name: name,
      score: 131,

      stats: {
        damage: 8900,
        rpm: 750,
        magazine: 37
      },
      mods: [],
      talents: [
        {
          id: 'accurate'
        }
      ]
    };
  }

  private _gearDefaultState(name: string): Gear {
    return {
      rarity: GearRarity.SUPERIOR,
      type: this.itemType,
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




