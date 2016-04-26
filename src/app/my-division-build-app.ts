/**
 * Created by xastey on 4/2/2016.
 */

import {Component, ViewEncapsulation, OnInit} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {Gear, GearOverviewComponent} from "./components/gear-overview/gear-overview.component";
import {DIVISION_PROVIDERS} from "./services/core";
import {EditorService} from "./services/editor-service";
import {AttributesService} from "./services/attributes.service";
import {InventoryComponent, InventoryRootComponent} from "./components/inventory/inventory.component";
import {DUMMY_GEAR} from "./components/gear-overview/gear.model";


@Component({
  selector: 'my-division-build-app',

  pipes: [],
  styles: [require("./assets/styles/app.scss")],
  directives: [ROUTER_DIRECTIVES, InventoryComponent, GearOverviewComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app/my-division-build-app.html',
  providers: [DIVISION_PROVIDERS]
})

@RouteConfig([
  {path: '/...', name: 'InventoryRoot', component: InventoryRootComponent},

])
export class MyDivisionBuild implements OnInit {

  gear:Gear;

  constructor(private _editorService:EditorService, private _attributesService:AttributesService) {
    this.gear = DUMMY_GEAR;
  }

  ngOnInit() {

  }

  get currentEditorState() {
    return this._editorService.state ? 'Currently On' : 'Currently Off';
  }

  onToggleEditor() {
    this._editorService.toggle();
  }


}
