import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso15NitComponent } from './teso15-nit.component';

describe('Teso15NitComponent', () => {
  let component: Teso15NitComponent;
  let fixture: ComponentFixture<Teso15NitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso15NitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso15NitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
