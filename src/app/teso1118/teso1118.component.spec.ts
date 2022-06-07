import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso1118Component } from './teso1118.component';

describe('Teso1118Component', () => {
  let component: Teso1118Component;
  let fixture: ComponentFixture<Teso1118Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso1118Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso1118Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
