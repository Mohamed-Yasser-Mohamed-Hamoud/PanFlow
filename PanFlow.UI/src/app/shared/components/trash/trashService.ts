import { inject, Injectable, signal } from '@angular/core';
import { AspectService } from '../../../features/aspects/components/aspects/aspect-service';
import { ReadAspectResponse } from '../../../features/aspects/interfaces/read/read-aspect-response';
import Swal from 'sweetalert2';
import { HabitService } from '../../../features/habits/components/habits/habit-service';
import { ReadHabitResponse } from '../../../features/habits/interfaces/read/read-habit-response';
import { ReadDaySummaryResponse } from '../../../features/day/interfaces/read/read-day-summary-response';
import { DayAPI } from '../../../features/day/services/day-API';
import { LanguageService } from '../../../core/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class TrashService {
  public aspectService = inject(AspectService);
  public habitService = inject(HabitService);
  private dayAPI = inject(DayAPI);
  private languageService = inject(LanguageService);

  selectedTap: 'aspects' | 'habits' | 'days' = 'aspects';

  public deletedAspects = signal<ReadAspectResponse[]>([]);
  public isLoading = signal(false);
  public isLoadingRestore = signal(false);
  public isLoadingDelete = signal(false);

  public deletedDays = signal<ReadDaySummaryResponse[]>([]);
  public isLoadingDay = signal(false);
  public isLoadingDayRestore = signal(false);
  public isLoadingDayDelete = signal(false);

  public deletedHabits = signal<ReadHabitResponse[]>([]);
  public isLoadingHabit = signal(false);
  public isLoadingHabitRestore = signal(false);
  public isLoadingHabitDelete = signal(false);

  // --- Aspects ---
  loadDeletedAspects() {
    this.isLoading.set(true);

    this.aspectService.aspectAPI.getAllDeleted().subscribe({
      next: (response) => {
        this.deletedAspects.set(response.data?.aspects ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.t('general.error'),
          text: err.error?.message || this.languageService.t('general.error'),
          confirmButtonText: this.languageService.t('general.ok'),
          confirmButtonColor: 'red',
        });
      },
    });
  }

  restoreAspect(aspectId: string) {
    this.isLoadingRestore.set(true);

    this.aspectService.aspectAPI.restore({ aspectId }).subscribe({
      next: (response) => {
        this.deletedAspects.update((aspects) => aspects.filter((a) => a.aspectId !== aspectId));
        this.isLoadingRestore.set(false);
        this.aspectService.loadAspects();

        Swal.fire({
          icon: 'success',
          title: this.languageService.t('general.success'),
          confirmButtonText: this.languageService.t('general.ok'),
        });
      },
      error: (err) => {
        this.isLoadingRestore.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.t('general.error'),
          text: err.error?.message || err.message,
          confirmButtonText: this.languageService.t('general.ok'),
          confirmButtonColor: 'red',
        });
      },
    });
  }

  deleteAspectPermanently(aspectId: string) {
    Swal.fire({
      title: this.languageService.t('trash.deleteForever'),
      text: this.languageService.t('aspects.deleteAspect'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.languageService.t('general.delete'),
      confirmButtonColor: '#dc2626',
      cancelButtonText: this.languageService.t('general.cancel'),
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isLoadingDelete.set(true);

      this.aspectService.aspectAPI.DeleteForEver({ aspectId }).subscribe({
        next: (response) => {
          this.deletedAspects.update((aspects) => aspects.filter((a) => a.aspectId !== aspectId));
          this.isLoadingDelete.set(false);

          Swal.fire({
            icon: 'success',
            title: this.languageService.t('general.success'),
            confirmButtonText: this.languageService.t('general.ok'),
          });
        },
        error: (err) => {
          this.isLoadingDelete.set(false);

          Swal.fire({
            icon: 'error',
            title: this.languageService.t('general.error'),
            confirmButtonText: this.languageService.t('general.ok'),
            confirmButtonColor: 'red',
          });
        },
      });
    });
  }

  // --- Days ---
  loadDeletedDays() {
    this.isLoadingDay.set(true);

    this.dayAPI.getDeletedDays().subscribe({
      next: (response) => {
        this.deletedDays.set(response.data?.days ?? []);
        this.isLoadingDay.set(false);
      },
      error: (err) => {
        this.isLoadingDay.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.t('general.error'),
          text: this.languageService.t('general.error'),
          confirmButtonText: this.languageService.t('general.ok'),
          confirmButtonColor: 'red',
        });
      },
    });
  }

  restoreDay(dayId: string) {
    this.isLoadingDayRestore.set(true);

    this.dayAPI.restore({ dayId }).subscribe({
      next: (response) => {
        this.deletedDays.update((days) => days.filter((d) => d.dayId !== dayId));
        this.isLoadingDayRestore.set(false);

        Swal.fire({
          icon: 'success',
          title: this.languageService.t('general.success'),
          confirmButtonText: this.languageService.t('general.ok'),
        });
      },
      error: (err) => {
        this.isLoadingDayRestore.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.t('general.error'),
          confirmButtonText: this.languageService.t('general.ok'),
        });
      },
    });
  }

  deleteDayPermanently(dayId: string) {
    Swal.fire({
      title: this.languageService.t('trash.deleteForever'),
      text: this.languageService.t('dashboard.deleteDayConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.languageService.t('general.delete'),
      confirmButtonColor: '#dc2626',
      cancelButtonText: this.languageService.t('general.cancel'),
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isLoadingDayDelete.set(true);

      this.dayAPI.deleteForEver({ dayId }).subscribe({
        next: (response) => {
          this.deletedDays.update((days) => days.filter((d) => d.dayId !== dayId));
          this.isLoadingDayDelete.set(false);

          Swal.fire({
            icon: 'success',
            title: this.languageService.t('general.success'),
            confirmButtonText: this.languageService.t('general.ok'),
          });
        },
        error: (err) => {
          this.isLoadingDayDelete.set(false);

          Swal.fire({
            icon: 'error',
            title: this.languageService.t('general.error'),
            confirmButtonText: this.languageService.t('general.ok'),
          });
        },
      });
    });
  }

  // --- Habits ---
  loadDeletedHabits() {
    this.isLoadingHabit.set(true);

    this.habitService.habitAPI.getDeletedHabits().subscribe({
      next: (response) => {
        this.deletedHabits.set(response.data?.habits ?? []);
        this.isLoadingHabit.set(false);
      },
      error: (err) => {
        this.isLoadingHabit.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.t('general.error'),
          text: this.languageService.t('general.error'),
          confirmButtonText: this.languageService.t('general.ok'),
        });
      },
    });
  }

  restoreHabit(habitId: string) {
    this.isLoadingHabitRestore.set(true);

    this.habitService.habitAPI.restore({ habitId }).subscribe({
      next: (response) => {
        this.deletedHabits.update((habits) => habits.filter((h) => h.habitId !== habitId));
        this.isLoadingHabitRestore.set(false);
        this.habitService.loadHabits();

        Swal.fire({
          icon: 'success',
          title: this.languageService.t('general.success'),
          confirmButtonText: this.languageService.t('general.ok'),
        });
      },
      error: (err) => {
        this.isLoadingHabitRestore.set(false);

        Swal.fire({
          icon: 'error',
          title: this.languageService.t('general.error'),
          confirmButtonText: this.languageService.t('general.ok'),
        });
      },
    });
  }

  deleteHabitPermanently(habitId: string) {
    Swal.fire({
      title: this.languageService.t('trash.deleteForever'),
      text: this.languageService.t('habits.deleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.languageService.t('general.delete'),
      confirmButtonColor: '#dc2626',
      cancelButtonText: this.languageService.t('general.cancel'),
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isLoadingHabitDelete.set(true);

      this.habitService.habitAPI.deleteForEver({ habitId }).subscribe({
        next: (response) => {
          this.deletedHabits.update((habits) => habits.filter((h) => h.habitId !== habitId));
          this.isLoadingHabitDelete.set(false);

          Swal.fire({
            icon: 'success',
            title: this.languageService.t('general.success'),
            confirmButtonText: this.languageService.t('general.ok'),
          });
        },
        error: (err) => {
          this.isLoadingHabitDelete.set(false);

          Swal.fire({
            icon: 'error',
            title: this.languageService.t('general.error'),
            confirmButtonText: this.languageService.t('general.ok'),
          });
        },
      });
    });
  }
}