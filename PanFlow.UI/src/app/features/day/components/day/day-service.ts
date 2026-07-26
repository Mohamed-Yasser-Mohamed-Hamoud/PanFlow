import { inject, Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

import { DayAPI } from '../../services/day-API';
import { Popup } from '../../../../shared/services/popup';

import { ReadDaySummaryResponse } from '../../interfaces/read/read-day-summary-response';
import { ReadDayResponse } from '../../interfaces/read/read-day-response';
import { ReadHabitDayResponse } from '../../interfaces/read/read-habit-day-response';
import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  /* ───────── Signals & State ───────── */

  days = signal<ReadDaySummaryResponse[]>([]);

  selectedDay = signal<ReadDayResponse | null>(null);

  isLoading = signal(true);
  isLoadingDay = signal(false);
  isLoadingStart = signal(false);

  mode = signal<'list' | 'view'>('list');

  /* ───────── Dependencies ───────── */

  private readonly popup = inject(Popup);
  dayAPI = inject(DayAPI);

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
          title: 'Error',
          text: err.error?.message || err.message,
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
          title: 'Error',
          text: err.error?.message || err.message,
        });
      },
    });
  }

  /* ───────── Toggle Habit ───────── */

  toggleHabit(habit: ReadHabitDayResponse) {
    const day = this.selectedDay();
    if (!day) return;

    const newStatus = !habit.isChecked;

    this.dayAPI
      .updateHabitStatus({ dayId: day.dayId, habitId: habit.habitId, isChecked: newStatus })
      .subscribe({
        next: () => {
          this.selectedDay.update((d) => {
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

          this.loadDays();
        },

        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || err.message,
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
          title: 'Error',
          text: 'There is a problem with the server.',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  // ملحوظة: loadDeletedDays اتشالت لأن endpoint الـ deletedDay بتاع Day
  // اتشال من الباك اند (مفيش soft-delete/trash لليوم خالص)

  /* ───────── Helpers ───────── */

  Popup() {
    this.popup.underWork();
  }
}
