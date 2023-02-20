import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/services/auth.service';
import { UserI } from '../shared/interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.initializeRegisterForm();
  }

  private initializeRegisterForm() {
    this.user = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public register(): void {
    if (this.user.valid) {
      const user: UserI = this.user.value;
      this.authService.register(user).subscribe({
        next: (data) => {
          if (data) {
            this.router.navigate(['/login']);
            this.toastr.success('Registration successful!');
          }
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(`${err}`, 'Error');
        },
      });
    }
  }
}
