import { Injectable, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { TokenService } from '../../../../core/services/token-service';
import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto'; // الـ Interface الموحد
import { AuthResponse } from '../../interfaces/auth-response';

@Injectable() // Scoped Service
export class RegisterService {
  private fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  // ── الـ UI States ──
  showPassword = false;
  showConfirm = false;
  isLoading = false;
  serverError = '';

  // ── بناء الـ Forms ──
  registerForm = this.fb.group({
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  confirm = new FormControl('', [Validators.required]);

  // ── دوال التحكم في الرؤية ──
  displayPassword() {
    this.showPassword = !this.showPassword;
  }

  displayConfirm() {
    this.showConfirm = !this.showConfirm;
  }

  // ── التحقق من تطابق كلمتي المرور ──
  get matchPassword(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmValue = this.confirm.value;
    return password === confirmValue;
  }

  // ── إرسال البيانات ──
  onSubmit(cdr: ChangeDetectorRef) {
    if (this.registerForm.valid && this.confirm.valid && this.matchPassword) {
      this.isLoading = true;
      this.serverError = '';

      // الـ response هنا بقا متغلف بـ GeneralResponseDto 👇
      this._authService.register(this.registerForm.value as any).subscribe({
        next: (response: GeneralResponseDto<AuthResponse>) => {
          this.isLoading = false;

          // طالما دخلنا الـ next يبقى الـ Interceptor ملقاش أي مشكلة والعملية نجحت 🎉
          if (response.data && response.data.token) {
            this.tokenService.save(response.data.token); // التوكن بقى جوه الـ data
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.serverError = err.error?.message || 'Registration failed. Please try again.';
          cdr.detectChanges();
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.confirm.markAsTouched();
      this.serverError = 'Please fill all fields correctly.';
    }
  }
}