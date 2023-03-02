import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTeso12Component } from './editar-teso12.component';

describe('EditarTeso12Component', () => {
  let component: EditarTeso12Component;
  let fixture: ComponentFixture<EditarTeso12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarTeso12Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTeso12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
