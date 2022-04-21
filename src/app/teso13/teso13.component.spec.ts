import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso13Component } from './teso13.component';

describe('Teso13Component', () => {
  let component: Teso13Component;
  let fixture: ComponentFixture<Teso13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso13Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
