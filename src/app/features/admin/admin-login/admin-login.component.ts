import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent {
  auth = inject(AuthService);
  fb = inject(FirebaseService);
  loading = signal(false);

  form = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    await this.auth.login(
      this.form.value.email!,
      this.form.value.password!
    );
    this.loading.set(false);
  }
}
