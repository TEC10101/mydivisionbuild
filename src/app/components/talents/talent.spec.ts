/**
 * Created by Keyston on 5/3/2016.
 */
import {describe, it, expect, inject, beforeEach, beforeEachProviders} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {TalentComponent} from './talents.component';
import {DIVISION_PROVIDERS} from '../../services/core';
import {HTTP_PROVIDERS, XHRBackend} from '@angular/http';

import {provide} from '@angular/core';
import {FixtureBackend} from '../../testing/fixture-backend';
describe('TalentsComponent: component', () => {
  let tcb;
  let choices = [
    {
      id: 'reckless',
      template: 'Head %x Tail'
    },
    {
      id: 'vigirous',
      template: '%x middle %x'
    }
  ];

  let talent = {
    id: 'reckless',
    value: 0
  };
// setup
  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    provide(XHRBackend, {useClass: FixtureBackend}),
    TestComponentBuilder,
    TalentComponent,
    DIVISION_PROVIDERS
  ]);

  beforeEach(inject([TestComponentBuilder], _tcb => {
    tcb = _tcb;
  }));

  it('should render Talent', done => {
    tcb.createAsync(TalentComponent).then(fixture => {
        let component = <TalentComponent>fixture.componentInstance,
          element = fixture.nativeElement;

        component.talent = talent;
        component.choices = choices;
        fixture.detectChanges(); // trigger change detection
        expect(element.querySelector('label').innerText).toBe('Reckless');
        done();
      })
      .catch(e => done.fail(e));
  });


});
