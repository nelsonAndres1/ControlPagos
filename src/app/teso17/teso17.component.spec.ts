import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso17Component } from './teso17.component';

describe('Teso17Component', () => {
  let component: Teso17Component;
  let fixture: ComponentFixture<Teso17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
