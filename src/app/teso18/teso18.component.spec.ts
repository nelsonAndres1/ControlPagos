import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso18Component } from './teso18.component';

describe('Teso18Component', () => {
  let component: Teso18Component;
  let fixture: ComponentFixture<Teso18Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso18Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
