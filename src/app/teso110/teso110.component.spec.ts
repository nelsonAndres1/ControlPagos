import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso110Component } from './teso110.component';

describe('Teso110Component', () => {
  let component: Teso110Component;
  let fixture: ComponentFixture<Teso110Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso110Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso110Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
