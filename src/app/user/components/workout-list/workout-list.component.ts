import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { WorkoutI } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
})
export class WorkoutListComponent implements OnInit {
  workoutPlans!: WorkoutI[];

  constructor(
    private router: Router,
    private dataService: DataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getWorkoutPlans();
  }

  private getWorkoutPlans(): void {
    this.dataService.getWorkOuts().subscribe((workoutPlans) => {
      workoutPlans.forEach((element) => {
        element.totalExercises = element.exerciseGroup.reduce(
          (acc: any, curr: any) => acc + curr.exercises.length,
          0
        );
      });
      this.workoutPlans = workoutPlans?.filter((status) => status);
    });
  }

  public deleteWorkoutPlan(workoutId: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Are you sure?`,
        content: `Are you sure you want to delete Workout`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.deleteWorkout(workoutId).subscribe(() => {
          this.getWorkoutPlans();
        });
      }
    });
  }

  public viewWorkoutDetails(workoutId: string | undefined): void {
    this.router.navigate(['/workout-details/', workoutId]);
  }
}
