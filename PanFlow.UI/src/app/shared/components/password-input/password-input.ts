import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [ReactiveFormsModule,TranslatePipe],
  templateUrl: './password-input.html',
  styleUrl: './password-input.css'
  // 💡 شيلنا الـ viewProviders والـ ControlContainer تماماً لمنع التضارب
})
export class PasswordInput {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: FormControl; // 👈 بنمرر الـ Control نفسه هنا مباشرة
  @Input() passwordToMatch?: FormControl; // 👈 بنمرر الباسورد الأساسي هنا في حالة الـ Confirm لمطابقته

  showPassword = false;

  get isConfirmMismatch(): boolean {
    // لو الحقل الحالي فيه قيمة، وفي باسور أساسي ممرر للمطابقة، بنقارن بينهم
    if (this.passwordToMatch && this.control?.value) {
      return this.control.value !== this.passwordToMatch.value;
    }
    return false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}