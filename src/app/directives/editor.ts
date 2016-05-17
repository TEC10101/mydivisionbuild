/**
 * Created by Keyston on 4/7/2016.
 */


import {Directive, ElementRef, Renderer, OnInit, OnDestroy, Input} from '@angular/core';
import {EditorService} from '../services/editor-service';
import {Subscription} from 'rxjs/Subscription';
import {InputConverter, BooleanConverter} from '../common/converters';

@Directive({
  selector: '[editor]'
})
export class EditorDirective implements OnInit, OnDestroy {


  @Input('editor')
  @InputConverter(BooleanConverter)
  isEditorComponent: boolean = false;


  private _subscription: Subscription;

  constructor(private _elementRef: ElementRef, private _editorService: EditorService,
              private _renderer: Renderer) {

  }


  ngOnInit(): any {
    this._subscription = this._editorService
      .subscribe((value) => this._onEditorStateChanged(value));
  }

  ngOnDestroy(): any {
    this._subscription.unsubscribe();
  }

  private _onEditorStateChanged(inEditMode) {


    let showElement = ((inEditMode && this.isEditorComponent)
    || (!inEditMode && !this.isEditorComponent)  );


    this._renderer.setElementClass(this._elementRef.nativeElement, 'hidden', !showElement);
  }


}
