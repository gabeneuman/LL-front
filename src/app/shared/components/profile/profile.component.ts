import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserI } from '../../interfaces';
import { User } from '../../models';
import { DataService } from '../../services/data.service';
import {
  FileUpload,
  ImageUploadService,
} from '../../services/file-upload-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  public userInfo: UserI = new User();

  constructor(
    private dataService: DataService,
    private imageUploadService: ImageUploadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.dataService.getUser().subscribe((data: any) => {
      this.userInfo = data;
    });
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

  public edit(HtmlTemplate): void {
    HtmlTemplate.classList.add('on-edit');
    HtmlTemplate.focus();
    HtmlTemplate.contentEditable = 'true';
  }

  public blur(HtmlTemplate, type): void {
    this.userInfo[type] = HtmlTemplate.innerText;
    HtmlTemplate.classList.remove('on-edit');
    HtmlTemplate.contentEditable = 'false';
    HtmlTemplate.blur();
  }

  public save(): void {
    this.dataService.updateUser(this.userInfo).subscribe(
      (data) => {
        this.toastr.success('Profile updated');
      },
      (error) => {
        this.toastr.error('Error updating profile');
      }
    );
  }
}
