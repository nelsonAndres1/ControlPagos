import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teso117SuperComponent } from './teso117-super.component';

describe('Teso117SuperComponent', () => {
  let component: Teso117SuperComponent;
  let fixture: ComponentFixture<Teso117SuperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Teso117SuperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teso117SuperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
