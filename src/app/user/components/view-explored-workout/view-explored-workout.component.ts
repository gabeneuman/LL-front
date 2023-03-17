import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { WorkoutI } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data.service';
import { LoaderSevice } from 'src/app/shared/services/loading.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TitleService } from 'src/app/shared/services/title.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-view-explored-workout',
  templateUrl: './view-explored-workout.component.html',
  styleUrls: ['./view-explored-workout.component.css'],
})
export class ViewExploredWorkoutComponent {
  workoutPlans!: WorkoutI[];
  workoutPlan!: WorkoutI | any;
  workoutId!: string | null;
  currentUser!: string;
  isDownloaded = false;
  @ViewChild('workoutDetails') workoutDetails!: ElementRef;

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: LoaderSevice,
    private dataService: DataService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

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
    const data = this.getImportInfo(this.workoutPlan);
    this.dataService.createWorkout(data).subscribe(
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

  public generatePDF(): void {
    this.isDownloaded = true;
    const options = {
      filename: this.workoutPlan.name + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'in', orientation: 'landscape' }
    };
    html2pdf().set(options).from(this.workoutDetails.nativeElement).save().then(() => {
      this.isDownloaded = false;
      this.cd.detectChanges();
    });
  }
  

  public viewEditReadonly(): void {
    this.router.navigate(['/view', this.workoutId]);
  }

  private getWorkoutDetails(id: string): void {
    this.dataService.getWorkoutById(id).subscribe((res) => {
      res.totalExercises = res.exerciseGroup.reduce(
        (acc: any, curr: any) => acc + curr.exercises.length,
        0
      );
      this.workoutPlan = res;
      this.titleService.setTitle(
        this.workoutPlan?.name ? this.workoutPlan.name : 'Workout not found'
      );
    });
  }

  private getImportInfo(workout) {
    // remove id from workout
    workout.exerciseGroup.forEach((group) => {
      delete group._id;
      group.exercises.forEach((exercise) => {
        delete exercise._id;
        exercise.sets.forEach((set) => {
          delete set._id;
        });
      });
    });
    return {
      isImported: true,
      completed: false,
      name: workout.name,
      notes: workout.notes,
      exerciseGroup: workout.exerciseGroup,
    }
  }
}

// workout.createdBy = new mongoose.Types.ObjectId(getUserId(req));
// workout.isDeleted = false;
// workout.createdAt = new Date().toISOString();
// workout.updatedAt = new Date().toISOString();
