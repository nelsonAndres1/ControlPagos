import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso114Component } from './teso114.component';

describe('Teso114Component', () => {
  let component: Teso114Component;
  let fixture: ComponentFixture<Teso114Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso114Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso114Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
