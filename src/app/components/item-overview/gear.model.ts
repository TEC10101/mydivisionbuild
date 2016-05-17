/**
 * Created by Keyston on 4/3/2016.
 */

import {Rarity, ItemType, GearStats, GearRarity} from '../../common/models/common';
import {Attributes, Attribute} from '../attributes/attributes.model';
import {Talent} from '../talents/talent.model';
import {InventoryItem} from '../inventory/inventory.model';


export interface Gear extends InventoryItem {

  stats: GearStats;
  armor: number;

}


export const DUMMY_GEAR: Gear = {
  rarity: GearRarity.GEAR_SET,
  type: ItemType.BodyArmor,
  name: "Sentry's Call harness",
  armor: 1049,
  score: 214,
  stats: {
    firearms: 0,
    stamina: 422,
    electronics: 0
  },
  attributes: {
    major: [{

      id: 13,
      value: 8

    }],
    minor: [],
    skill: []

  },
  mods: [],
  talents: []
};


export const GEAR_SCORES = (function () {
  let scores = {};
  scores[GearRarity.SUPERIOR] = [131, 147, 165];
  scores[GearRarity.HIGH_END] = [163, 182, 204];
  scores[GearRarity.GEAR_SET] = [191, 214, 240];
  return scores;
})();
