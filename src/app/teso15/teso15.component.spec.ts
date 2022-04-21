import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso15Component } from './teso15.component';

describe('Teso15Component', () => {
  let component: Teso15Component;
  let fixture: ComponentFixture<Teso15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso15Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
