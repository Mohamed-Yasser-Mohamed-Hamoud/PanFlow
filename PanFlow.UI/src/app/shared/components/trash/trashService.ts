import { inject, Injectable, OnInit, signal } from '@angular/core';
import { AspectService } from '../../../features/aspects/components/aspects/aspect-service';
import { ReadAspectResponse } from '../../../features/aspects/interfaces/read/read-aspect-response';
import Swal from 'sweetalert2';
import { HabitService } from '../../../features/habits/components/habits/habit-service';
import { ReadHabitResponse } from '../../../features/habits/interfaces/read/read-habit-response';
import { AspectAPI } from '../../../features/aspects/services/aspect-API';
@Injectable()
export class trashService {
  public aspectService = inject(AspectService);
  selectedTap: 'aspects' | 'habits' = 'aspects';

  public deletedAspects = signal<ReadAspectResponse[]>([]);
  public isLoading = signal(false);
  public isLoadingRestore = signal(false);
  public isLoadingDelete = signal(false);
  public habitService = inject(HabitService);

  public deletedHabits = signal<ReadHabitResponse[]>([]);

  public isLoadingHabit = signal(false);
  public isLoadingHabitRestore = signal(false);
  public isLoadingHabitDelete = signal(false);

  restoreAspect(aspectId: string) {
    this.isLoadingRestore.set(true);

    this.aspectService.aspectAPI.restore({ aspectId }).subscribe({
      next: (response) => {
        this.deletedAspects.update((aspects) => aspects.filter((a) => a.aspectId !== aspectId));

        this.isLoadingRestore.set(false);
        this.aspectService.loadAspects();

        Swal.fire({
          icon: 'success',
          title: 'Restored',
          text: response.message,
          confirmButtonText: 'Ok',
        });
      },
      error: (err) => {
        this.isLoadingRestore.set(false);

        Swal.fire({
          icon: 'error',
          title: 'Restore Failed',
          text: err.error?.message || err.message,
          confirmButtonText: 'Ok',
          confirmButtonColor: 'red',
        });
      },
    });
  }
  deleteAspectPermanently(aspectId: string) {
    Swal.fire({
      title: 'Delete permanently?',
      text: 'This aspect cannot be recovered.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isLoadingDelete.set(true);

      this.aspectService.aspectAPI.DeleteForEver({ aspectId }).subscribe({
        next: (response) => {
          this.deletedAspects.update((aspects) => aspects.filter((a) => a.aspectId !== aspectId));

          this.isLoadingDelete.set(false);

          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: response.message,
            confirmButtonText: 'Ok',
          });
        },
        error: (err) => {
          this.isLoadingDelete.set(false);

          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: err.error?.message || err.message,
            confirmButtonText: 'Ok',
            confirmButtonColor: 'red',
          });
        },
      });
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
          title: 'Restored',
          text: response.message,
          confirmButtonText: 'Ok',
        });
      },
      error: (err) => {
        this.isLoadingHabitRestore.set(false);

        Swal.fire({
          icon: 'error',
          title: 'Restore Failed',
          text: err.error?.message || err.message,
          confirmButtonText: 'Ok',
        });
      },
    });
  }
  deleteHabitPermanently(habitId: string) {
    Swal.fire({
      title: 'Delete permanently?',
      text: 'This habit cannot be recovered.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isLoadingHabitDelete.set(true);

      this.habitService.habitAPI.deleteForEver({ habitId }).subscribe({
        next: (response) => {
          this.deletedHabits.update((habits) => habits.filter((h) => h.habitId !== habitId));

          this.isLoadingHabitDelete.set(false);

          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: response.message,
            confirmButtonText: 'Ok',
          });
        },
        error: (err) => {
          this.isLoadingHabitDelete.set(false);

          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: err.error?.message || err.message,
            confirmButtonText: 'Ok',
          });
        },
      });
    });
  }

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
          title: 'Error',
          text: err.error?.message || 'There is a problem with the server.',
          confirmButtonText: 'Ok',
        });
      },
    });
  }
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
          title: 'Error',
          text: err.error?.message || 'There is a problem with the server.',
          confirmButtonText: 'Ok',
          confirmButtonColor: 'red',
        });
      },
    });
  }
}