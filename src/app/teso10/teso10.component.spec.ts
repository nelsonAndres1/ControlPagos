import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso10Component } from './teso10.component';

describe('Teso10Component', () => {
  let component: Teso10Component;
  let fixture: ComponentFixture<Teso10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso10Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
