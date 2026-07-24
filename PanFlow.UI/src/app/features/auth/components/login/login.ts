import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from './login-service'; // تأكد من اسم ملف السيرفيس عندك

// 💡 استيراد الـ Shared Components بنفس الأسماء الصح
import { AuthInput } from '../../../../shared/components/auth-input/auth-input';
import { PasswordInput } from '../../../../shared/components/password-input/password-input';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink, 
    ReactiveFormsModule, 
    AuthInput, 
    PasswordInput
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [LoginService] // تسجيل السيرفيس كـ Scoped لصفحة الـ Login
})
export class Login {
  public loginService = inject(LoginService);
  public cdr = inject(ChangeDetectorRef);

  // 🌟 الـ Getter لتحويل حقل الباسورد لـ FormControl صريح
  get passwordControl(): FormControl {
    return this.loginService.loginForm.get('password') as FormControl;
  }
}