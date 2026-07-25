import { inject, Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

import { AspectAPI } from '../../services/aspect-API';
import { ReadAspectResponse } from '../../interfaces/read/read-aspect-response';
import { DeleteAspectRequest } from '../../interfaces/delete/delete-aspect-request';
import { Popup } from '../../../../shared/services/popup';
import { FormBuilder, Validators } from '@angular/forms';

import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto';
import { CreateAspectResponse } from '../../interfaces/create/create-aspect-response';
import { UpdateAspectRequest } from '../../interfaces/update/update-aspect-request';
import { ReadAspectRequest } from '../../interfaces/read/read-aspect-request';

import { ReadHabitResponse } from '../../../habits/interfaces/read/read-habit-response';
import { HabitAPI } from '../../../habits/services/habit-API';
import { HabitService } from '../../../habits/components/habits/habit-service';

@Injectable({
  providedIn: 'root',
})
export class AspectService {
  /* ───────── Signals & State ───────── */

  public aspects = signal<ReadAspectResponse[]>([]);
  public aspectHabits = signal<ReadHabitResponse[]>([]);

  public selectedAspect = signal<ReadAspectResponse | null>(null);

  public isLoading = signal(true);

  isLoadingCreate = signal(false);
  isLoadingEdit = signal(false);

  mode = signal<'list' | 'create' | 'edit' | 'view'>('list');

  aspectId: string | null = null;

  originalAspect: UpdateAspectRequest | null = null;

  /* ───────── Dependencies ───────── */

  private readonly popup = inject(Popup);
 readonly aspectAPI = inject(AspectAPI);
  private readonly habitAPI = inject(HabitAPI);
  private readonly fb = inject(FormBuilder);
  habitServices = inject(HabitService)
  /* ───────── Forms ───────── */

  aspectForm = this.fb.group({
    aspectName: ['', Validators.required],

    aspectColor: ['#ffffff', Validators.required],
  });

  /* ───────── Modes ───────── */

  openCreateMode() {
    this.mode.set('create');
  }

  openViewMode(request: ReadAspectRequest) {
    // clear old habits
    this.aspectHabits.set([]);

    this.aspectAPI.getById(request).subscribe({
      next: (response) => {
        if (response.data) {
          this.selectedAspect.set(response.data);

          this.loadAspectHabits(response.data.aspectId);

          this.mode.set('view');
        }
      },
    });
  }

  loadAspectHabits(aspectId: string) {
    this.habitAPI
      .getAspectHabits({
        aspectId: aspectId,
      })
      .subscribe({
        next: (response) => {
          this.aspectHabits.set(response.data?.habits ?? []);
        },

        error: () => {
          Swal.fire({
            icon: 'error',

            title: 'Error',

            text: 'Cannot load habits',
          });
        },
      });
  }

  openEditMode(aspect: UpdateAspectRequest) {
    this.mode.set('edit');

    this.aspectId = aspect.aspectId;

    this.originalAspect = {
      ...aspect,
    };

    this.aspectForm.patchValue({
      aspectName: aspect.aspectName,

      aspectColor: aspect.aspectColor,
    });
  }

  openListMode() {
    this.aspectForm.reset({
      aspectName: '',

      aspectColor: '#ffffff',
    });

    this.mode.set('list');
  }

  /* ───────── Create ───────── */

  createAspect() {
    if (this.aspectForm.invalid) return;

    this.isLoadingCreate.set(true);

    const body = {
      aspectName: this.aspectForm.value.aspectName!,

      aspectColor: this.aspectForm.value.aspectColor!,
    };

    this.aspectAPI.create(body).subscribe({
      next: (response: GeneralResponseDto<CreateAspectResponse>) => {
        this.isLoadingCreate.set(false);

        if (response.data) {
          this.loadAspects();

          this.openListMode();

          Swal.fire({
            icon: 'success',

            title: 'Done',

            text: response.message,
          });
        }
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

  updateAspect() {
    if (this.aspectForm.invalid || !this.aspectId) return;

    this.isLoadingEdit.set(true);

    const body = {
      aspectId: this.aspectId,

      aspectName: this.aspectForm.value.aspectName!,

      aspectColor: this.aspectForm.value.aspectColor!,
    };

    if (
      this.originalAspect &&
      body.aspectName === this.originalAspect.aspectName &&
      body.aspectColor === this.originalAspect.aspectColor
    ) {
      this.isLoadingEdit.set(false);

      this.openListMode();

      Swal.fire({
        icon: 'info',

        title: 'Not Updated',

        text: 'This is the same data',
      });

      return;
    }

    this.aspectAPI.update(body).subscribe({
      next: (response) => {
        this.loadAspects();

        this.isLoadingEdit.set(false);

        this.aspectId = null;

        this.openListMode();

        Swal.fire({
          icon: 'success',

          title: 'Updated',

          text: response.message,
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

  delete(request: DeleteAspectRequest) {
    this.aspectAPI.delete(request).subscribe({
      next: (response) => {
        this.aspects.update((aspects) => aspects.filter((a) => a.aspectId !== request.aspectId));

        Swal.fire({
          icon: 'success',

          title: 'Deleted',

          text: response.message,
        });
      },
    });
  }

  /* ───────── Read ───────── */

  loadAspects() {
    this.isLoading.set(true);

    this.aspectAPI.getAll().subscribe({
      next: (response) => {
        this.aspects.set(response.data?.aspects ?? []);

        this.isLoading.set(false);
      },
    });
  }

  /* ───────── Helpers ───────── */

  Popup() {
    this.popup.underWork();
  }
}
