import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso118Component } from './teso118.component';

describe('Teso118Component', () => {
  let component: Teso118Component;
  let fixture: ComponentFixture<Teso118Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso118Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso118Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
