import { inject, Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { HabitAPI } from '../../services/habit-API';
import { AspectAPI } from '../../../aspects/services/aspect-API';
import { ReadHabitResponse } from '../../interfaces/read/read-habit-response';
import { ReadAspectResponse } from '../../../aspects/interfaces/read/read-aspect-response';
import { DeleteHabitRequest } from '../../interfaces/delete/delete-habit-request';
import { ReadHabitRequest } from '../../interfaces/read/read-habit-request';
import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto';
import { CreateHabitResponse } from '../../interfaces/create/create-habit-response';
import { Popup } from '../../../../shared/services/popup';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  /* ───────── Signals & State ───────── */
  public habits = signal<ReadHabitResponse[]>([]);
  public aspects = signal<ReadAspectResponse[]>([]);
  public isLoading = signal(true);
  isLoadingCreate = signal(false);
  isLoadingEdit = signal(false);
  selectedHabit = signal<ReadHabitResponse | null>(null);

  mode = signal<'list' | 'create' | 'edit' | 'view'>('list');
  habitId: string | null = null;
  originalHabit: { habitId: string; habitName: string } | null = null;

  /* ───────── Dependencies ───────── */
  popup = inject(Popup);
  habitAPI = inject(HabitAPI);
  aspectAPI = inject(AspectAPI);
  fb = inject(FormBuilder);

  /* ───────── Forms ───────── */
  // aspectId is only required in create-mode (Habit's Aspect can't change afterwards)
  habitForm = this.fb.group({
    aspectId: ['', [Validators.required]],
    habitName: ['', [Validators.required]],
  });

  /* ───────── Modes ───────── */
  openCreateMode() {
    this.loadAspectsForSelect();

    this.habitForm.get('aspectId')?.setValidators([Validators.required]);
    this.habitForm.get('aspectId')?.updateValueAndValidity();

    this.mode.set('create');
  }

  openViewMode(habitId: ReadHabitRequest) {
    this.habitAPI.read(habitId).subscribe({
      next: (response) => {
        if (response.data) {
          this.selectedHabit.set(response.data);
          this.mode.set('view');
        }
      },
    });
  }

  openEditMode(habit: ReadHabitResponse) {
    this.mode.set('edit');
    this.habitId = habit.habitId;
    this.originalHabit = { habitId: habit.habitId, habitName: habit.habitName };

    // Aspect can't be edited, so it's not required in this mode
    this.habitForm.get('aspectId')?.clearValidators();
    this.habitForm.get('aspectId')?.updateValueAndValidity();

    this.habitForm.patchValue({
      habitName: habit.habitName,
    });
  }

  openListMode() {
    this.habitForm.reset({
      aspectId: '',
      habitName: '',
    });

    this.mode.set('list');
  }

  /* ───────── Aspects (for the create-mode select) ───────── */
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
      aspectId: this.habitForm.value.aspectId,
      habitName: this.habitForm.value.habitName,
    };

    this.habitAPI.create(body as any).subscribe({
      next: (response: GeneralResponseDto<CreateHabitResponse>) => {
        if (response.data) {
          this.loadHabits();

          this.openListMode();

          Swal.fire({
            icon: 'success',
            title: 'Done',
            text: response.message,
            confirmButtonText: 'ok',
          });
        }

        this.isLoadingCreate.set(false);
      },
      error: (err) => {
        this.isLoadingCreate.set(false);

        Swal.fire({
          icon: 'error',
          title: 'some error happen',
          text: err.error?.message || err.message,
        });
      },
    });
  }

  /* ───────── Update ───────── */
  updateHabit() {
    if (this.habitForm.invalid || !this.habitId) return;

    this.isLoadingEdit.set(true);

    const body = {
      habitId: this.habitId,
      habitName: this.habitForm.value.habitName,
    };

    if (this.originalHabit && body.habitName === this.originalHabit.habitName) {
      this.openListMode();
      this.isLoadingEdit.set(false);
      Swal.fire({
        icon: 'info',
        title: 'Not Updated',
        text: 'this is the same Data',
        confirmButtonText: 'ok',
      });
      return;
    }

    this.habitAPI.update(body as any).subscribe({
      next: (response) => {
        this.loadHabits();

        this.isLoadingEdit.set(false);
        this.openListMode();
        this.habitId = null;

        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: response.message,
          confirmButtonText: 'ok',
        });
      },
      error: (err) => {
        this.isLoadingEdit.set(false);

        Swal.fire({
          icon: 'error',
          title: 'Update failed',
          text: err.error?.message || err.message,
        });
      },
    });
  }

  /* ───────── Delete ───────── */
  delete(id: DeleteHabitRequest) {
    this.habitAPI.delete(id).subscribe({
      next: (response) => {
        this.habits.update((habits) => habits.filter((h) => h.habitId !== id.habitId));

        Swal.fire({
          title: 'Deleted',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'Ok',
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err.error?.message || err.message,
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: 'red',
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

  /* ───────── Helpers ───────── */
  Popup() {
    this.popup.underWork();
  }
}
