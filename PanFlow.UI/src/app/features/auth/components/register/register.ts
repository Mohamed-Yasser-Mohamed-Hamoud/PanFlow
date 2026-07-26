import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms'; // 👈 تأكد من استيراد FormControl
import { RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { RegisterService } from './register-service'; 


// 💡 التأكد من استيراد الأسماء الصحيحة للكلاسات المصدرة بالملي
import { AuthInput } from '../../../../shared/components/auth-input/auth-input';
import { PasswordInput } from '../../../../shared/components/password-input/password-input';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [
    RouterLink, 
    ReactiveFormsModule, 
    AuthInput,     // 👈 يجب أن يطابق الاسم المستورد فوق تماماً
    PasswordInput,  // 👈 يجب أن يطابق الاسم المستورد فوق تماماً
    TranslatePipe
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [RegisterService] 
})
export class Register {
  public registerService = inject(RegisterService);
  public cdr = inject(ChangeDetectorRef);

  get passwordControl(): FormControl {
    return this.registerService.registerForm.get('password') as FormControl;
  }
}