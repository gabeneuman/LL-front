import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedWorkoutsComponent } from './completed-workouts.component';

describe('CompletedWorkoutsComponent', () => {
  let component: CompletedWorkoutsComponent;
  let fixture: ComponentFixture<CompletedWorkoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedWorkoutsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedWorkoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
