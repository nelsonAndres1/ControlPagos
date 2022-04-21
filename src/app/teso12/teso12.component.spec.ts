import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso12Component } from './teso12.component';

describe('Teso12Component', () => {
  let component: Teso12Component;
  let fixture: ComponentFixture<Teso12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso12Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
