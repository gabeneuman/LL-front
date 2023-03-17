import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserI, WorkoutI } from '../../interfaces';
import { User } from '../../models';
import { DataService } from '../../services/data.service';
import {
  FileUpload,
  ImageUploadService,
} from '../../services/file-upload-service';
import { ChartOptions, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  public userInfo: UserI = new User();
  public isEdit = false;
  public workouts: WorkoutI[];
  public stats: any = {};
  public isView = false;
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [['Completed'], ['In progress']];
  public pieChartDatasets = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(
    private dataService: DataService,
    private imageUploadService: ImageUploadService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('userId');
    if (id) {
      this.isView = true;
      this.dataService.getUserById(id).subscribe((data: any) => {
        this.userInfo = data.user[0];
        this.workouts = data.workout[0];
        this.stats = data.stat;
      });
    } else {
      this.dataService.getUser().subscribe((data: any) => {
        console.log('data: ', data);
        this.userInfo = data.user[0];
        this.workouts = data.workout[0];
        this.stats = data.stat;
        this.pieChartDatasets = [{
          data: [this.stats.completed, this.stats.todo]
        }];
      });
    }
  }

  public fileUploadChange(event: any): void {
    console.log(event.target.files[0]);
    const file = new FileUpload(event.target.files[0]);
    if (file.file) {
      this.imageUploadService.uploadFile(file).then(
        (url) => {
          this.userInfo.imageUrl = url;
          this.dataService.updateUser(this.userInfo).subscribe(
            (data) => {
              this.toastr.success('Profile picture updated');
            },
            (error) => {
              this.toastr.error('Error updating profile picture');
            }
          );
        },
        (error) => {
          this.toastr.error('Error uploading image');
        }
      );
    }
  }

  public removeProfilePicture(): void {
    this.userInfo.imageUrl = '';
    this.dataService.updateUser(this.userInfo).subscribe(
      (data) => {
        this.toastr.success('Profile picture removed');
      },
      (error) => {
        this.toastr.error('Error removing profile picture');
      }
    );
  }

  public edit(): void {
    this.isEdit = true;
  }

  public save(): void {
    this.isEdit = false;
    this.dataService.updateUser(this.userInfo).subscribe(
      (data) => {
        this.toastr.success('Profile updated');
      },
      (error) => {
        this.toastr.error('Error updating profile');
      }
    );
  }

  public viewWorkoutDetails(workoutId: string | undefined): void {
    this.router.navigate(['/explore/', workoutId]);
  }

  public onOpen() {
    this.isEdit = true;
  }

  public onClose() {
    this.isEdit = false;
  }
}
