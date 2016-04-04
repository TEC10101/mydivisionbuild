import {MajorAttribute, GearSupport, GearRarity} from "./common";
/**
 * Created by xastey on 4/3/2016.
 */

const BodyArmorMajorAttributes = [
  new MajorAttribute("Health on Kill", [
    {
      rarity: GearRarity.SUPERIOR,
      level: 30,
      range: {low: 8, high: 9}

    },
    {
      rarity: GearRarity.SUPERIOR,
      level: 31,
      range: {low: 8, high: 10}
    },
    {
      rarity: GearRarity.HIGH_END,
      level: 30,
      range: {low: 9, high: 11}
    },
    {
      rarity: GearRarity.HIGH_END,
      level: 31,
      range: {low: 9, high: 11}
    }
  ])
];
