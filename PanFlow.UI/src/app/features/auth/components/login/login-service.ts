import { Injectable, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { TokenService } from '../../../../core/services/token-service';
import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto'; // الـ Interface الموحد
import { AuthResponse } from '../../interfaces/auth-response';

@Injectable() // Scoped مع الكومبوننت
export class LoginService {
  private fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  // ── الـ UI States ──
  showPassword = false;
  isLoading = false;
  serverError = '';

  // ── بناء الـ Form ──
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  displayPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(cdr: ChangeDetectorRef) {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.serverError = '';

      // الـ response هنا بقا متغلف بـ GeneralResponseDto 👇
      this._authService.login(this.loginForm.value).subscribe({
        next: (response: GeneralResponseDto<AuthResponse>) => {
          this.isLoading = false;

          // بما إن الـ Interceptor هيهندل الفشل، هنا إحنا متأكدين إنها Success والداتا واصلة 🎉
          if (response.data && response.data.token) {
            this.tokenService.save(response.data.token); // التوكن بقى جوه الـ data
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          // في حالة الـ HTTP errors الحقيقية (زي السيرفر وقع)، بنسيب دي كـ Backup احتياطي للـ UI
          this.serverError = err.error?.message || 'Login failed. Please try again.';
          cdr.detectChanges();
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.serverError = 'Please fill all fields correctly.';
    }
  }
}