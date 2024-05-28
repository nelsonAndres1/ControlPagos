import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso21Component } from './teso21.component';

describe('Teso21Component', () => {
  let component: Teso21Component;
  let fixture: ComponentFixture<Teso21Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso21Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso21Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
