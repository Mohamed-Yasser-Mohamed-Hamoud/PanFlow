import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DayAPI } from '../../../day/services/day-API';
import { TokenService } from '../../../../core/services/token-service';
import { Popup } from '../../../../shared/services/popup';
import { DayService } from '../../../day/components/day/day-service';
import { ReadDayResponse } from '../../../day/interfaces/read/read-day-response';
import { ReadHabitDayResponse } from '../../../day/interfaces/read/read-habit-day-response';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { LanguageService } from '../../../../core/services/language.service';

@Injectable() // 💡 بدون (providedIn: 'root') لتكون Scoped مع الكومبوننت
export class DashboardService {
  private _tokenService = inject(TokenService);
  private router = inject(Router);
  private popupService = inject(Popup);
  private languageService = inject(LanguageService);

  private dayAPI = inject(DayAPI);
  private dayService = inject(DayService); // بنستخدمه بس عشان الكاش المشترك بتاع قائمة الأيام (صفحة Days)

  // ── الـ UI States (الموجودة من قبل) ──
  siderOpen: boolean = false;
  isProfileOpen: boolean = false;
  isTrashOpen: boolean = false;
  activeDate: Date = new Date();
  today: string = '';
  dayName: string = '';

  // ── حالة كارت اليوم (Today Card) ──
  currentDay = signal<ReadDayResponse | null>(null);
  isLocked = signal<boolean>(true); // true = لسه مفيش Day للتاريخ ده، الكارت Blur
  isLoadingCard = signal<boolean>(false);
  isUnlocking = signal<boolean>(false);
  showAddTaskModal = signal<boolean>(false);

  // العادات المضافة بالفعل في اليوم الحالي (عشان الـ Modal يستبعدها من الاختيار)
  excludedHabitIds = computed(() => this.currentDay()?.habits.map((h) => h.habitId) ?? []);

  // ── دوال التحكم في الـ Profile ──
  closeProfile() {
    this.isProfileOpen = false;
  }

  openProfile() {
    this.isProfileOpen = true;
  }

  closeTrash() {
    this.isTrashOpen = false;
  }
  openTrash() {
    this.isTrashOpen = true;
  }

  // ── تحديث وعرض التاريخ ──
  updateDateDisplay() {
    this.today = this.activeDate.toLocaleDateString();
    this.dayName = this.activeDate.toLocaleDateString('en-US', { weekday: 'long' });
    this.refreshCard();
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

  /* ───────── Today Card: Lock / Unlock ───────── */

  private formatDateForApi(date: Date): string {
    // yyyy-MM-dd بالتوقيت المحلي (نتجنب مشاكل UTC shift)
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // بيدور هل فيه Day بالفعل للتاريخ المعروض دلوقتي (activeDate) ولا لأ
  // ملحوظة: مفيش endpoint مباشر لـ "هات اليوم بتاريخ معين"، فبنستخدم
  // readAll (مفيهاش أي side effect) ونفتش فيها عن التاريخ ده
  refreshCard() {
    this.isLoadingCard.set(true);
    const targetDate = this.formatDateForApi(this.activeDate);

    this.dayAPI.readAll().subscribe({
      next: (response) => {
        const days = response.data?.days ?? [];
        const match = days.find((d) => d.date === targetDate);

        if (!match) {
          this.currentDay.set(null);
          this.isLocked.set(true);
          this.isLoadingCard.set(false);
          return;
        }

        this.dayAPI.read({ dayId: match.dayId }).subscribe({
          next: (readRes) => {
            this.currentDay.set(readRes.data ?? null);
            this.isLocked.set(false);
            this.isLoadingCard.set(false);
          },
          error: (err) => {
            this.isLoadingCard.set(false);
            Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || err.message });
          },
        });
      },
      error: (err) => {
        this.isLoadingCard.set(false);
        Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || err.message });
      },
    });
  }

  // زرار "Unlock this Day" في نص الكارت المموّه - بينشئ اليوم فاضي (بدون عادات)
  unlockDay() {
    this.isUnlocking.set(true);
    const targetDate = this.formatDateForApi(this.activeDate);

    this.dayAPI.create({ date: targetDate, habitIds: [] }).subscribe({
      next: () => {
        this.isUnlocking.set(false);
        this.refreshCard();
        this.dayService.loadDays(); // نحدّث كاش صفحة Days كمان
      },
      error: (err) => {
        this.isUnlocking.set(false);
        Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || err.message });
      },
    });
  }

  /* ───────── Add Task Modal ───────── */

  openAddTaskModal() {
    if (this.isLocked()) return;
    this.showAddTaskModal.set(true);
  }

  closeAddTaskModal() {
    this.showAddTaskModal.set(false);
  }

  confirmAddHabits(habitIds: string[]) {
    const day = this.currentDay();
    if (!day || habitIds.length === 0) return;

    this.dayAPI.addHabits({ dayId: day.dayId, habitIds }).subscribe({
      next: (res) => {
        const added = res.data?.addedHabits ?? [];

        this.currentDay.update((d) => {
          if (!d) return d;
          const habits = [...d.habits, ...added];
          const completionPercentage =
            habits.length === 0
              ? 0
              : Math.round((habits.filter((h) => h.isChecked).length / habits.length) * 10000) / 100;
          return { ...d, habits, completionPercentage };
        });

        this.closeAddTaskModal();
        this.dayService.loadDays();
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || err.message });
      },
    });
  }

  /* ───────── Toggle Habit في الكارت ───────── */

  toggleHabit(habit: ReadHabitDayResponse) {
    const day = this.currentDay();
    if (!day) return;

    const newStatus = !habit.isChecked;

    this.dayAPI
      .updateHabitStatus({ dayId: day.dayId, habitId: habit.habitId, isChecked: newStatus })
      .subscribe({
        next: () => {
          this.currentDay.update((d) => {
            if (!d) return d;
            const habits = d.habits.map((h) =>
              h.habitId === habit.habitId ? { ...h, isChecked: newStatus } : h,
            );
            const completionPercentage =
              habits.length === 0
                ? 0
                : Math.round((habits.filter((h) => h.isChecked).length / habits.length) * 10000) / 100;
            return { ...d, habits, completionPercentage };
          });

          this.dayService.loadDays();
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || err.message });
        },
      });
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

  /* ───────── Delete / Restore Day ───────── */

  deleteDay() {
    const day = this.currentDay();
    if (!day) return;

    Swal.fire({
      title: this.languageService.t('dashboard.deleteDay'),
      text: this.languageService.t('dashboard.deleteDayConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.languageService.t('general.confirm'),
      cancelButtonText: this.languageService.t('general.cancel'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.dayAPI.delete({ dayId: day.dayId }).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: this.languageService.t('dashboard.dayDeleted'),
              timer: 1500,
            });
            this.refreshCard();
            this.dayService.loadDays();
          },
          error: (err) => {
            Swal.fire({ icon: 'error', title: this.languageService.t('general.error'), text: err.error?.message || err.message });
          },
        });
      }
    });
  }

  restoreDay() {
    const day = this.currentDay();
    if (!day) return;

    this.dayAPI.restore({ dayId: day.dayId }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.languageService.t('dashboard.dayRestored'),
          timer: 1500,
        });
        this.refreshCard();
        this.dayService.loadDays();
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: this.languageService.t('general.error'), text: err.error?.message || err.message });
      },
    });
  }

  /* ───────── Remove Habit from Day ───────── */

  removeHabitFromDay(habit: ReadHabitDayResponse) {
    const day = this.currentDay();
    if (!day) return;

    this.dayAPI.removeHabitFromDay({ dayId: day.dayId, habitId: habit.habitId }).subscribe({
      next: () => {
        this.currentDay.update((d) => {
          if (!d) return d;
          const habits = d.habits.filter((h) => h.habitId !== habit.habitId);
          const completionPercentage =
            habits.length === 0
              ? 0
              : Math.round((habits.filter((h) => h.isChecked).length / habits.length) * 10000) / 100;
          return { ...d, habits, completionPercentage };
        });
        this.dayService.loadDays();
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: this.languageService.t('general.error'), text: err.error?.message || err.message });
      },
    });
  }

  /* ───────── Reorder Habits (Drag & Drop) ───────── */

  onHabitDrop(event: CdkDragDrop<ReadHabitDayResponse[]>) {
    const day = this.currentDay();
    if (!day) return;

    // Update local state
    this.currentDay.update((d) => {
      if (!d) return d;
      const habits = [...d.habits];
      const [movedHabit] = habits.splice(event.previousIndex, 1);
      habits.splice(event.currentIndex, 0, movedHabit);
      return { ...d, habits };
    });

    // Send to backend
    const habitIds = this.currentDay()?.habits.map((h) => h.habitId) ?? [];
    this.dayAPI.reorderHabits({ dayId: day.dayId, habitIds }).subscribe({
      error: (err) => {
        Swal.fire({ icon: 'error', title: this.languageService.t('general.error'), text: err.error?.message || err.message });
      },
    });
  }
}
