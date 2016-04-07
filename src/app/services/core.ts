import {CONST_EXPR} from "angular2/src/facade/lang";
import {AttributesService} from "./attributes.service";
import {ItemsService} from "./item.service";
import {EditorService} from "./editor-service";
/**
 * Created by xastey on 4/3/2016.
 */


export const DIVISION_PROVIDERS:any[] = CONST_EXPR([AttributesService, ItemsService,EditorService]);
