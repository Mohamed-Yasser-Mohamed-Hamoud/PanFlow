import { inject, Injectable, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto';
import { UserService } from '../../services/user-service';
import { SelectedUserResponse } from '../../interfaces/Read/selected-user-response';
import { UpdatePasswordRequest } from '../../interfaces/Update/update-password-request';
import { UpdateRequest } from '../../interfaces/Update/update-request';

@Injectable() // Scoped Service مع الكومبوننت
export class ProfileService {
  private userService = inject(UserService);
  private router = inject(Router);

  userData: SelectedUserResponse | null = null;
  userPasswords: UpdatePasswordRequest = { currentPassword: '', newPassword: '' };

  isUserNameEditing = false;
  isEmailEditing = false;
  isPasswordEditing = false;
  serverError: string = '';
  isSamePassword = false;

  profileForm = new FormGroup({
    newUserName: new FormControl('', [Validators.required]),
    newEmail: new FormControl('', [Validators.required, Validators.email]),
    CurrentPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  get newUserName() {
    return this.profileForm.get('newUserName') as FormControl;
  }
  get newEmail() {
    return this.profileForm.get('newEmail') as FormControl;
  }
  get CurrentPassword() {
    return this.profileForm.get('CurrentPassword') as FormControl;
  }
  get newPassword() {
    return this.profileForm.get('newPassword') as FormControl;
  }

  showCurrent = false;
  showNew = false;

  displayCurrent() {
    this.showCurrent = !this.showCurrent;
  }
  displayNew() {
    this.showNew = !this.showNew;
  }
  editEmail() {
    this.isEmailEditing = true;
  }
  editUserName() {
    this.isUserNameEditing = true;
  }
  editPassword() {
    this.isPasswordEditing = true;
  }

  canceleditEmail() {
    this.isEmailEditing = false;
    this.newEmail.reset();
    this.newEmail.markAsUntouched();
    this.newEmail.markAsPristine();
    this.serverError = '';
  }

  canceleditUserName() {
    this.isUserNameEditing = false;
    this.newUserName.reset();
    this.newUserName.markAsUntouched();
    this.newUserName.markAsPristine();
    this.serverError = '';
  }

  canceleditPassword() {
    this.isPasswordEditing = false;
    this.profileForm.patchValue({ CurrentPassword: '', newPassword: '' });
    this.CurrentPassword.markAsUntouched();
    this.CurrentPassword.markAsPristine();
    this.newPassword.markAsUntouched();
    this.newPassword.markAsPristine();
    this.serverError = '';
    this.isSamePassword = false;
  }

  // 1️⃣ جلب بيانات الحساب
  loadProfileData(cdr: ChangeDetectorRef) {
    this.userService.getProfile().subscribe({
      next: (response: GeneralResponseDto<SelectedUserResponse>) => {
        this.userData = response.data;
        cdr.markForCheck();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'there is a problem with the Server',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: 'red',
        });
      },
    });
  }

  // 2️⃣ تحديث الـ Username
  updateUserName(cdr: ChangeDetectorRef) {
    this.serverError = '';
    if (this.newUserName.invalid || this.newUserName.value === this.userData?.userName) return;

    const updatedData: UpdateRequest = {
      userName: this.newUserName.value!,
      email: this.userData?.email || '',
    };

    this.userService.updateProfile(updatedData).subscribe({
      next: (response: GeneralResponseDto<any>) => {
        // 🚀 التعديل هنا: عملنا Re-create للأوبجكت بالكامل عشان نتفادى الـ Read-only
        if (this.userData) {
          this.userData = {
            ...this.userData,
            userName: this.newUserName.value!,
          };
        }
        this.isUserNameEditing = false;
        this.newUserName.reset();
        cdr.markForCheck();

        Swal.fire({
          title: response.message || 'User name Updated Successfully!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
      error: (err: any) => {
        this.serverError = err.error?.message || 'Something went wrong';
        cdr.detectChanges();
      },
    });
  }

  // 3️⃣ تحديث الـ Email
  updateEmail(cdr: ChangeDetectorRef) {
    this.serverError = '';
    if (this.newEmail.invalid || this.newEmail.value === this.userData?.email) return;

    const updatedData: UpdateRequest = {
      userName: this.userData?.userName || '',
      email: this.newEmail.value!,
    };

    this.userService.updateProfile(updatedData).subscribe({
      next: (response: GeneralResponseDto<any>) => {
        // 🚀 التعديل هنا برضه: Re-create للأوبجكت لحماية الـ Immutability
        if (this.userData) {
          this.userData = {
            ...this.userData,
            email: this.newEmail.value!,
          };
        }
        this.isEmailEditing = false;
        this.newEmail.reset();
        cdr.markForCheck();

        Swal.fire({
          title: response.message || 'Email Updated Successfully!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
      error: (err: any) => {
        this.serverError = err.error?.message || 'Something went wrong';
        cdr.detectChanges();
      },
    });
  }

  // 4️⃣ تحديث الباسورد
  updatePassword(cdr: ChangeDetectorRef) {
    this.serverError = '';
    if (this.CurrentPassword.invalid || this.newPassword.invalid) return;

    // 🚀 التعديل هنا: بنبني أوبجكت جديد للـ Passwords وبنروح نبعته علطول
    const passwordsPayload: UpdatePasswordRequest = {
      currentPassword: this.CurrentPassword.value!,
      newPassword: this.newPassword.value!,
    };

    if (passwordsPayload.currentPassword === passwordsPayload.newPassword) {
      this.isSamePassword = true;
      cdr.detectChanges();
      return;
    }

    this.userService.updatePassword(passwordsPayload).subscribe({
      next: (response: GeneralResponseDto<any>) => {
        this.isPasswordEditing = false;
        this.canceleditPassword();
        cdr.markForCheck();

        Swal.fire({
          title: response.message || 'Password Updated Successfully!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
      error: (err: any) => {
        this.serverError = err.error?.message || 'Something went wrong';
        cdr.detectChanges();
      },
    });
  }

  // 5️⃣ حذف الحساب
  deleteButton() {
    Swal.fire({
      title: 'Are You Sure ?',
      icon: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      cancelButtonColor: '#e09a1a',
      confirmButtonColor: '#B00020',
    }).then((result: any) => {
      if (result?.isConfirmed) {
        this.userService.deleteUser().subscribe({
          next: (response: GeneralResponseDto<any>) => {
            Swal.fire({
              title: 'Deleted!',
              text: response.message || 'Your account has been deleted.',
              icon: 'success',
            });
            this.router.navigate(['/register']);
          },
        });
      }
    });
  }
}
