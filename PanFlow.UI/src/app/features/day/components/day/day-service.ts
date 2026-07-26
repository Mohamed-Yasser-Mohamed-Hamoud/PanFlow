import { inject, Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

import { DayAPI } from '../../services/day-API';
import { Popup } from '../../../../shared/services/popup';

import { ReadDaySummaryResponse } from '../../interfaces/read/read-day-summary-response';
import { ReadDayResponse } from '../../interfaces/read/read-day-response';
import { ReadDayHabitResponse } from '../../interfaces/read/read-day-habit-response';
import { DeleteDayRequest } from '../../interfaces/delete/delete-day-request';
import { RestoreDayRequest } from '../../interfaces/restore/restore-day-request';
import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto';
import { LanguageService } from '../../../../core/services/language.service';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  /* ───────── Signals & State ───────── */

  days = signal<ReadDaySummaryResponse[]>([]);
  deletedDays = signal<ReadDaySummaryResponse[]>([]);

  selectedDay = signal<ReadDayResponse | null>(null);

  isLoading = signal(true);
  isLoadingDay = signal(false);
  isLoadingStart = signal(false);

  mode = signal<'list' | 'view'>('list');

  /* ───────── Dependencies ───────── */

  private readonly popup = inject(Popup);
  dayAPI = inject(DayAPI);
  private readonly languageService = inject(LanguageService); // 👈 تفعيل خدمة الترجمة

  /* ───────── Modes ───────── */

  openListMode() {
    this.selectedDay.set(null);
    this.mode.set('list');
  }

  openViewMode(dayId: string) {
    this.isLoadingDay.set(true);

    this.dayAPI.read({ dayId }).subscribe({
      next: (response) => {
        this.isLoadingDay.set(false);

        if (!response.data) return;

        this.selectedDay.set(response.data);
        this.mode.set('view');
      },

      error: (err) => {
        this.isLoadingDay.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.translate('general.error') || 'Error',
          confirmButtonText: this.languageService.translate('general.ok') || 'OK',
        });
      },
    });
  }

  /* ───────── Start Today ───────── */

  startToday() {
    this.isLoadingStart.set(true);

    this.dayAPI.today().subscribe({
      next: (response: GeneralResponseDto<ReadDayResponse>) => {
        this.isLoadingStart.set(false);

        if (!response.data) return;

        this.selectedDay.set(response.data);
        this.mode.set('view');

        this.loadDays();
      },

      error: (err) => {
        this.isLoadingStart.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.translate('general.error') || 'Error',
          confirmButtonText: this.languageService.translate('general.ok') || 'OK',
        });
      },
    });
  }

  /* ───────── Toggle Habit ───────── */

  toggleHabit(habit: ReadDayHabitResponse) {
    const newStatus = !habit.isChecked;

    // DayHabit عنده Composite Key (dayId + habitId)، فلازم نبعتهم مع بعض
    this.dayAPI
      .updateHabitStatus({ dayId: habit.dayId, habitId: habit.habitId, isChecked: newStatus })
      .subscribe({
        next: () => {
          this.selectedDay.update((day) => {
            if (!day) return day;

            const habits = day.habits.map((h) =>
              h.habitId === habit.habitId ? { ...h, isChecked: newStatus } : h,
            );

            const completionPercentage =
              habits.length === 0
                ? 0
                : Math.round((habits.filter((h) => h.isChecked).length / habits.length) * 10000) / 100;

            return { ...day, habits, completionPercentage };
          });

          this.loadDays();
        },

        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: this.languageService.translate('general.error') || 'Error',
            confirmButtonText: this.languageService.translate('general.ok') || 'OK',
          });
        },
      });
  }

  /* ───────── Delete ───────── */

  delete(request: DeleteDayRequest) {
    this.dayAPI.delete(request).subscribe({
      next: (response) => {
        this.days.update((days) => days.filter((day) => day.dayId !== request.dayId));

        Swal.fire({
          icon: 'success',
          title: this.languageService.translate('general.deleted') || 'Deleted',
          confirmButtonText: this.languageService.translate('general.ok') || 'OK',
        });
      },

      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: this.languageService.translate('general.error') || 'Error',
          confirmButtonText: this.languageService.translate('general.ok') || 'OK',
        });
      },
    });
  }

  /* ───────── Restore ───────── */

  restore(request: RestoreDayRequest) {
    this.dayAPI.restore(request).subscribe({
      next: (response) => {
        this.loadDeletedDays();
        this.loadDays();

        Swal.fire({
          icon: 'success',
          title: this.languageService.translate('general.restored') || 'Restored',
          confirmButtonText: this.languageService.translate('general.ok') || 'OK',
        });
      },

      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: this.languageService.translate('general.error') || 'Error',
          confirmButtonText: this.languageService.translate('general.ok') || 'OK',
        });
      },
    });
  }

  /* ───────── Read ───────── */

  loadDays() {
    this.isLoading.set(true);

    this.dayAPI.readAll().subscribe({
      next: (response) => {
        this.days.set(response.data?.days ?? []);

        this.isLoading.set(false);
      },

      error: () => {
        this.isLoading.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.translate('general.error') || 'Error',
          text: this.languageService.translate('general.serverError') || 'There is a problem with the server.',
          confirmButtonText: this.languageService.translate('general.ok') || 'OK',
        });
      },
    });
  }

  loadDeletedDays() {
    this.dayAPI.getDeletedDays().subscribe({
      next: (response) => {
        this.deletedDays.set(response.data?.days ?? []);
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: this.languageService.translate('general.error') || 'Error',
          text: this.languageService.translate('general.serverError') || 'There is a problem with the server.',
          confirmButtonText: this.languageService.translate('general.ok') || 'OK',
        });
      },
    });
  }

  /* ───────── Helpers ───────── */

  Popup() {
    this.popup.underWork();
  }
}