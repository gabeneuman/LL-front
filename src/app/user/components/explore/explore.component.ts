import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { WorkoutI } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent {
  workoutPlans!: WorkoutI[];
  page = 1;
  constructor(
    private router: Router,
    private dataService: DataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getWorkoutPlans();
  }

  private getWorkoutPlans(): void {
    this.dataService
      .getAllWorkOuts({ page: this.page })
      .subscribe((workoutPlans: any) => {
        this.workoutPlans = workoutPlans.response;
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
    this.router.navigate(['/explore/', workoutId]);
  }

  public next() {
    this.page++;
    this.getWorkoutPlans();
  }

  public prev() {
    this.page--;
    this.getWorkoutPlans();
  }
}