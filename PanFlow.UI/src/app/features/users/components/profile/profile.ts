import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './profile-service';

// 💡 استيراد المكونات المشتركة النظيفة
import { AuthInput } from '../../../../shared/components/auth-input/auth-input';
import { PasswordInput } from '../../../../shared/components/password-input/password-input';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    AuthInput, 
    PasswordInput,
    TranslatePipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [ProfileService]
})
export class Profile implements OnInit {
  @Output() close = new EventEmitter<void>();

  public profileService = inject(ProfileService);
  public cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.profileService.loadProfileData(this.cdr);
  }

  closeMe() {
    this.close.emit();
  }
}