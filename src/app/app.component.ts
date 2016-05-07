/**
 * Created by xastey on 4/2/2016.
 */

import {Component, ViewEncapsulation, OnInit} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {Gear} from "./components/gear-overview/gear-overview.component";
import {EditorService} from "./services/editor-service";
import {AttributesService} from "./services/attributes.service";
import {InventoryRootComponent} from "./components/inventory/inventory.component";
import {DUMMY_GEAR} from "./components/gear-overview/gear.model";
import {BootstrapService} from './services/bootstrap.service';


@Component({
  selector: 'my-division-build',

  pipes: [],
  styles: [require('./assets/styles/app.scss')],
  directives: [],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app/my-division-build-app.html',
  providers: []
})

@RouteConfig([
  {path: '/...', name: 'InventoryRoot', component: InventoryRootComponent}

])
export class App implements OnInit {

  gear: Gear;

  constructor(private _editorService: EditorService,
              private _attributesService: AttributesService,
              private _bootstrapService: BootstrapService) {
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
