import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso14Component } from './teso14.component';

describe('Teso14Component', () => {
  let component: Teso14Component;
  let fixture: ComponentFixture<Teso14Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso14Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
