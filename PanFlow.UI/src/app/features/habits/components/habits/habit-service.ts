import { inject, Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';

import { HabitAPI } from '../../services/habit-API';
import { AspectAPI } from '../../../aspects/services/aspect-API';
import { Popup } from '../../../../shared/services/popup';

import { ReadHabitResponse } from '../../interfaces/read/read-habit-response';
import { ReadAspectResponse } from '../../../aspects/interfaces/read/read-aspect-response';
import { ReadHabitRequest } from '../../interfaces/read/read-habit-request';
import { DeleteHabitRequest } from '../../interfaces/delete/delete-habit-request';
import { UpdateHabitRequest } from '../../interfaces/update/update-habit-request';
import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto';
import { CreateHabitResponse } from '../../interfaces/create/create-habit-response';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  /* ───────── Signals & State ───────── */

  habits = signal<ReadHabitResponse[]>([]);
  deletedHabits = signal<ReadHabitResponse[]>([]);
  aspects = signal<ReadAspectResponse[]>([]);

  isLoading = signal(true);
  isLoadingCreate = signal(false);
  isLoadingEdit = signal(false);

  selectedHabit = signal<ReadHabitResponse | null>(null);

  mode = signal<'list' | 'create' | 'edit' | 'view'>('list');

  habitId: string | null = null;

  originalHabit: UpdateHabitRequest | null = null;

  /* ───────── Dependencies ───────── */

  private readonly popup = inject(Popup);
   habitAPI = inject(HabitAPI);
  private readonly aspectAPI = inject(AspectAPI);
  private readonly fb = inject(FormBuilder);

  /* ───────── Form ───────── */

  habitForm = this.fb.group({
    aspectId: ['', Validators.required],
    habitName: ['', Validators.required],
  });

  /* ───────── Modes ───────── */

  openCreateMode() {
    this.loadAspectsForSelect();

    this.habitForm.reset({
      aspectId: '',
      habitName: '',
    });

    this.mode.set('create');
  }

  openViewMode(request: ReadHabitRequest) {
    this.habitAPI.read(request).subscribe({
      next: (response) => {
        if (!response.data) return;

        this.selectedHabit.set(response.data);
        this.mode.set('view');
      },
    });
  }

openEditMode(habit: ReadHabitResponse) {
  this.mode.set('edit');

  this.habitId = habit.habitId;

  this.originalHabit = {
    habitId: habit.habitId,
    habitName: habit.habitName,
    aspectId: habit.aspectId,
  };

  this.aspectAPI.getAll().subscribe({
    next: (response) => {
      this.aspects.set(response.data?.aspects ?? []);

      this.habitForm.patchValue({
        habitName: habit.habitName,
        aspectId: habit.aspectId,
      });
    },
  });
}

  openListMode() {
    this.habitId = null;
    this.originalHabit = null;

    this.habitForm.reset({
      aspectId: '',
      habitName: '',
    });

    this.mode.set('list');
  }

  /* ───────── Aspects ───────── */

  loadAspectsForSelect() {
    this.aspectAPI.getAll().subscribe({
      next: (response) => {
        this.aspects.set(response.data?.aspects ?? []);
      },
    });
  }

  /* ───────── Create ───────── */

  createHabit() {
    if (this.habitForm.invalid) return;

    this.isLoadingCreate.set(true);

    const body = {
      aspectId: this.habitForm.value.aspectId!,
      habitName: this.habitForm.value.habitName!,
    };

    this.habitAPI.create(body).subscribe({
      next: (response: GeneralResponseDto<CreateHabitResponse>) => {
        this.isLoadingCreate.set(false);

        if (!response.data) return;

        this.loadHabits();

        this.openListMode();

        Swal.fire({
          icon: 'success',
          title: 'Done',
          text: response.message,
          confirmButtonText: 'OK',
        });
      },

      error: (err) => {
        this.isLoadingCreate.set(false);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || err.message,
        });
      },
    });
  }

  /* ───────── Update ───────── */

  updateHabit() {
    if (this.habitForm.invalid || !this.habitId) return;

    this.isLoadingEdit.set(true);

    const body: UpdateHabitRequest = {
      habitId: this.habitId,
      habitName: this.habitForm.value.habitName!,
      aspectId: this.habitForm.value.aspectId!,
    };

    if (
      this.originalHabit &&
      body.habitName === this.originalHabit.habitName &&
      body.aspectId === this.originalHabit.aspectId
    ) {
      this.isLoadingEdit.set(false);

      this.openListMode();

      Swal.fire({
        icon: 'info',
        title: 'Not Updated',
        text: 'No changes detected.',
        confirmButtonText: 'OK',
      });

      return;
    }

    this.habitAPI.update(body).subscribe({
      next: (response) => {
        this.isLoadingEdit.set(false);

        this.loadHabits();

        this.openListMode();

        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: response.message,
          confirmButtonText: 'OK',
        });
      },

      error: (err) => {
        this.isLoadingEdit.set(false);

        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.error?.message || err.message,
        });
      },
    });
  }

  /* ───────── Delete ───────── */

  delete(request: DeleteHabitRequest) {
    this.habitAPI.delete(request).subscribe({
      next: (response) => {
        this.habits.update((habits) =>
          habits.filter((habit) => habit.habitId !== request.habitId)
        );

        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: response.message,
          confirmButtonText: 'OK',
        });
      },

      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || err.message,
          confirmButtonText: 'OK',
        });
      },
    });
  }

  /* ───────── Read ───────── */

  loadHabits() {
    this.isLoading.set(true);

    this.habitAPI.readAll().subscribe({
      next: (response) => {
        this.habits.set(response.data?.habits ?? []);

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


  loadDeletedHabits() {
  this.habitAPI.getDeletedHabits().subscribe({
    next: (response) => {
      this.deletedHabits.set(response.data?.habits ?? []);
    },

    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There is a problem with the server.',
        confirmButtonText: 'OK',
      });
    },
  });
}

  /* ───────── Helpers ───────── */

  Popup() {
    this.popup.underWork();
  }
}