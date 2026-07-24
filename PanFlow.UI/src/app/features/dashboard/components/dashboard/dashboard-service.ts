import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token-service';
import { Popup } from '../../../../shared/services/popup';

@Injectable() // 💡 بدون (providedIn: 'root') لتكون Scoped مع الكومبوننت
export class DashboardService {
  private _tokenService = inject(TokenService);
  private router = inject(Router);
  private popupService = inject(Popup);

  // ── الـ UI States ──
  siderOpen: boolean = false;
  isProfileOpen: boolean = false;
  isTrashOpen : boolean = false;
  activeDate: Date = new Date();
  today: string = '';
  dayName: string = '';

  // ── دوال التحكم في الـ Profile ──
  closeProfile() {
    this.isProfileOpen = false;
  }

  openProfile() {
    this.isProfileOpen = true;
  }

  closeTrash(){
    this.isTrashOpen = false
  }
  openTrash(){
    this.isTrashOpen = true
  }

  // ── تحديث وعرض التاريخ ──
  updateDateDisplay() {
    this.today = this.activeDate.toLocaleDateString();
    this.dayName = this.activeDate.toLocaleDateString('en-US', { weekday: 'long' });
  }

  previouseDay() {
    this.activeDate.setDate(this.activeDate.getDate() - 1);
    this.activeDate = new Date(this.activeDate);
    this.updateDateDisplay();
  }

  nextDay() {
    this.activeDate.setDate(this.activeDate.getDate() + 1);
    this.activeDate = new Date(this.activeDate);
    this.updateDateDisplay();
  }

  // ── عمليات المنيو والـ Logout ──
  popUp() {
    this.popupService.underWork();
  }

  changeSiderState() {
    this.siderOpen = !this.siderOpen;
  }

  logout() {
    this._tokenService.remove();
    this.router.navigate(['/login']);
  }
}
