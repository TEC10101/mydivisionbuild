/**
 * Created by Keyston on 4/27/2016.
 */
import {GearStats} from '../../common/models/common';
export interface Talent {
  id?: string;
  value?: number;
  unlocked?: boolean;
  requirements?: GearStats;
}
