import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/services/auth.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService
  ) {
    this.initializeLoginForm();
  }

  private initializeLoginForm() {
    this.user = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public login(): void {
    const user = {
      email: this.user.value.username,
      password: this.user.value.password,
    };
    this.authService.login(user).subscribe({
      next: (data) => {
        if (data) {
          this.localStorageService.set('auth-token', data);
          this.toastr.success('Login successful!');
          this.router.navigate(['/workout-list']);
        }
      },
      error: ({ error }) => {
        this.toastr.error(`${error.message}`, 'Error');
      },
    });
  }
}
