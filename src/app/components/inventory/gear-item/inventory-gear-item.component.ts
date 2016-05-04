/**
 * Created by xastey on 4/26/2016.
 */
import {Component, Input, OnInit} from "@angular/core";
import {Gear} from "../../gear-overview/gear.model";
import {InventoryGearItemImageComponent} from "../gear-item-image/inventory-gear-item-image.component";
import {ItemsService} from "../../../services/item.service";
import {GearType, GearRarity, DivisionItem} from "../../../common/models/common";
import {InventoryService} from "../../../services/inventory.service";


@Component({
  selector: 'inventory-gear-item',
  styles: [require('./inventory-gear-item.component.scss')],
  template: require('./inventory-gear-item.component.html'),
  directives: [InventoryGearItemImageComponent]

})
export class InventoryGearItemComponent implements OnInit {


  @Input() item: Gear;

  @Input('gear-type') gearType: GearType;


  constructor(private _itemsService: ItemsService, private _inventoryService: InventoryService) {
  }


  ngOnInit(): any {

    if (!this.item)this._itemsService
      .getDescriptorFor(this.gearType)
      .subscribe(descriptor => {
          let first = <DivisionItem>descriptor.items[GearRarity.SUPERIOR][0];
          let empty = {
            rarity: GearRarity.SUPERIOR,
            type: this.gearType,
            name: first.name,
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
            talent: {}
          };

          this._inventoryService.update(this.gearType, empty);
        }
      );
  }


  hasStat(name) {
    return !this.item ? false : this.item.stats[name] > 0;
  }

  get statNames() {
    return ['firearms', 'stamina', 'electronics'];
  }
}
