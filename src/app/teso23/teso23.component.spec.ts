import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso23Component } from './teso23.component';

describe('Teso23Component', () => {
  let component: Teso23Component;
  let fixture: ComponentFixture<Teso23Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso23Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso23Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
