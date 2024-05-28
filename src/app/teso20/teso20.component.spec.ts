import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso20Component } from './teso20.component';

describe('Teso20Component', () => {
  let component: Teso20Component;
  let fixture: ComponentFixture<Teso20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso20Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
