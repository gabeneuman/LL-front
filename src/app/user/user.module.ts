import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './components/title/title.component';
import { UserRoutingModule } from './user-routing.module';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { AddWorkoutsComponent } from './components/add-workouts/add-workouts.component';
import { MaterialModule } from '../shared/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from "../app.module";
import { WorkoutDetailsComponent } from './components/workout-details/workout-details.component';
import { WorkoutComponent } from './components/workout/workout.component';
import { CompletedWorkoutsComponent } from './components/completed-workouts/completed-workouts.component';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ViewExploredWorkoutComponent } from './components/view-explored-workout/view-explored-workout.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
    declarations: [
        TitleComponent,
        WorkoutListComponent,
        AddWorkoutsComponent,
        WorkoutDetailsComponent,
        WorkoutComponent,
        CompletedWorkoutsComponent,
        ProfileComponent,
        ExploreComponent,
        ViewExploredWorkoutComponent
    ],
    exports: [
        TitleComponent
    ],
    providers: [],
    imports: [
        CommonModule,
        UserRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgChartsModule
    ]
})
export class UserModule { }
