import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { WorkoutI } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data.service';
import { LoaderSevice } from 'src/app/shared/services/loading.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TitleService } from 'src/app/shared/services/title.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.component.html',
  styleUrls: ['./workout-details.component.css'],
})
export class WorkoutDetailsComponent implements OnInit {
  workoutPlans!: WorkoutI[];
  workoutPlan!: WorkoutI | undefined;
  workoutId!: string | null;
  @ViewChild('workoutDetails', { static: true }) workoutDetails!: ElementRef;
  isDownloaded = false;

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private router: Router,
    private loader: LoaderSevice,
    private dialog: MatDialog,
    private dataService: DataService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loader.showLoading(true);
    this.workoutId = this.route.snapshot.paramMap.get('workoutId');
    if (this.workoutId) {
      this.getWorkoutDetails(this.workoutId);
    }

  }

  public editWorkout(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Are you sure?`,
        content: `Are you sure you want to edit this workout (${this.workoutPlan?.name})?`,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.router.navigate(['/edit-workout', this.workoutId]);
      }
    });
  }

  public startWorkout(): void {
    this.router.navigate(['/workout', this.workoutId]);
  }

  private getWorkoutDetails(id: string): void {
    this.dataService.getWorkoutById(id).subscribe((res) => {
      this.workoutPlan = res;
      this.titleService.setTitle(
        this.workoutPlan?.name ? this.workoutPlan.name : 'Workout not found'
      );
    });
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

}
