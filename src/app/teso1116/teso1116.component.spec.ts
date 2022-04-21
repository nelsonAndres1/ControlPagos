import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso1116Component } from './teso1116.component';

describe('Teso1116Component', () => {
  let component: Teso1116Component;
  let fixture: ComponentFixture<Teso1116Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso1116Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso1116Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
