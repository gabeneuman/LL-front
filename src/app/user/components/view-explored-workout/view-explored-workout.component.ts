import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { WorkoutI } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data.service';
import { LoaderSevice } from 'src/app/shared/services/loading.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TitleService } from 'src/app/shared/services/title.service';

@Component({
  selector: 'app-view-explored-workout',
  templateUrl: './view-explored-workout.component.html',
  styleUrls: ['./view-explored-workout.component.css'],
})
export class ViewExploredWorkoutComponent {
  workoutPlans!: WorkoutI[];
  workoutPlan!: WorkoutI | undefined;
  workoutId!: string | null;
  currentUser!: string;

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: LoaderSevice,
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loader.showLoading(true);
    this.workoutId = this.route.snapshot.paramMap.get('workoutId');
    if (this.workoutId) {
      this.getWorkoutDetails(this.workoutId);
      this.currentUser = localStorage.getItem('user');
    }
  }

  public importWorkout(): void {
    this.toastr.info('Importing workout...', 'Plwase wait');
    const { _id, createdBy, modifiedBy, createdAt, updatedAt, ...rest } =
      this.workoutPlan;
    this.dataService.createWorkout(rest).subscribe(
      (res) => {
        setTimeout(() => {
          this.toastr.success('Workout imported successfully', 'Success');
          this.router.navigate(['/workout-list']);
        }, 2000);
      },
      (err) => {
        this.toastr.error('Unable to import workout', 'Try again');
      }
    );
  }

  public viewEditReadonly(): void {
    this.router.navigate(['/view', this.workoutId]);
  }

  private getWorkoutDetails(id: string): void {
    this.dataService.getWorkoutById(id).subscribe((res) => {
      this.workoutPlan = res;
      this.titleService.setTitle(
        this.workoutPlan?.name ? this.workoutPlan.name : 'Workout not found'
      );
    });
  }
}
