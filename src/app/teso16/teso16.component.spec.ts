import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso16Component } from './teso16.component';

describe('Teso16Component', () => {
  let component: Teso16Component;
  let fixture: ComponentFixture<Teso16Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso16Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teso16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
