/**
 * Created by xastey on 4/7/2016.
 */


import {Directive, ElementRef, Renderer, OnInit, OnDestroy, Input} from "angular2/core";
import {EditorService} from "../services/editor-service";
import {Subscription} from "rxjs/Subscription";
import {InputConverter, BooleanConverter} from "../common/converters";

@Directive({
  selector: "[editor]"
})
export class EditorDirective implements OnInit,OnDestroy {


  @Input("editor")
  @InputConverter(BooleanConverter)
  isEditorComponent:boolean = false;


  private _subscription:Subscription;

  constructor(private _elementRef:ElementRef, private _editorService:EditorService,
              private _renderer:Renderer) {

  }


  ngOnInit():any {
    this._subscription = this._editorService.subscribe((value)=>this._onEditorStateChanged(value))


  }

  private _onEditorStateChanged(inEditMode) {


    let showElement = ((inEditMode && this.isEditorComponent) || (!inEditMode && !this.isEditorComponent)  );


    this._renderer.setElementClass(this._elementRef.nativeElement, "hidden", !showElement);
  }

  ngOnDestroy():any {
    console.log("Removing editor subscription");
    this._subscription.unsubscribe();
  }
}
