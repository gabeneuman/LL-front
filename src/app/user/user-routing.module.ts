import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { AddWorkoutsComponent } from './components/add-workouts/add-workouts.component';
import { CompletedWorkoutsComponent } from './components/completed-workouts/completed-workouts.component';
import { WorkoutDetailsComponent } from './components/workout-details/workout-details.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { WorkoutComponent } from './components/workout/workout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/workout-list',
    pathMatch: 'full',
  },
  {
    path: 'workout-list',
    component: WorkoutListComponent,
  },
  {
    path: 'add-workout',
    component: AddWorkoutsComponent,
  },
  {
    path: 'edit-workout/:workoutId',
    component: AddWorkoutsComponent,
  },
  {
    path: 'workout-details/:workoutId',
    component: WorkoutDetailsComponent,
  },
  {
    path: 'workout/:workoutId',
    component: WorkoutComponent,
  },
  {
    path: 'completed-workout',
    component: CompletedWorkoutsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
