import {AttributesService} from "./attributes.service";
import {ItemsService} from "./item.service";
import {EditorService} from "./editor-service";
import {ModSlotService} from "./modslots.service";
import {InventoryService} from "./inventory.service";
/**
 * Created by xastey on 4/3/2016.
 */


export const DIVISION_PROVIDERS: any[] = [AttributesService, ItemsService,
  EditorService, ModSlotService, InventoryService];
