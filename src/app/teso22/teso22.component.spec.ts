import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso22Component } from './teso22.component';

describe('Teso22Component', () => {
  let component: Teso22Component;
  let fixture: ComponentFixture<Teso22Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso22Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
