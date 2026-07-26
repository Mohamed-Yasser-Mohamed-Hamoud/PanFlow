import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { LanguageService } from '../../core/services/language.service';

@Injectable({
  providedIn: 'root',
})
export class Popup {
  
  constructor(private languageService: LanguageService) {}

  underWork() {
    Swal.fire({
      title: this.languageService.translate('popup.underWork'), // أو ضع مفتاح الترجمة الخاص بك
      icon: 'info',
      confirmButtonText: this.languageService.translate('general.ok'),
      confirmButtonColor: '#cc8500',
      background: '#ffffff',
      customClass: {
        popup: 'my-popup'
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
    });
  }
}