import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso13ReimprimirComponent } from './teso13-reimprimir.component';

describe('Teso13ReimprimirComponent', () => {
  let component: Teso13ReimprimirComponent;
  let fixture: ComponentFixture<Teso13ReimprimirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso13ReimprimirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso13ReimprimirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
