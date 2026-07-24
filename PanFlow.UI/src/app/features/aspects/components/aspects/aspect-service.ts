import { ChangeDetectorRef, inject, Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { AspectAPI } from '../../services/aspect-API';
import { ReadAspectResponse } from '../../interfaces/read/read-aspect-response';
import { DeleteAspectRequest } from '../../interfaces/delete/delete-aspect-request';
import { Popup } from '../../../../shared/services/popup';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralResponseDto } from '../../../../shared/interfaces/general-response-dto';
import { CreateAspectResponse } from '../../interfaces/create/create-aspect-response';
import { UpdateAspectRequest } from '../../interfaces/update/update-aspect-request';
import { ReadAspectRequest } from '../../interfaces/read/read-aspect-request';

@Injectable({

  providedIn:'root'
})
export class AspectService {
  /* ───────── Signals & State ───────── */
  public aspects = signal<ReadAspectResponse[]>([]);
  public isLoading = signal(true);
  isLoadingCreate = signal(false);
  isLoadingEdit = signal(false);
  selectedAspect = signal<ReadAspectResponse | null>(null);

  mode = signal<'list' | 'create' | 'edit' | 'view'>('list');
  aspectId: string | null = null;
   originalAspect: UpdateAspectRequest | null = null;

  /* ───────── Dependencies ───────── */
   popup = inject(Popup);
   aspectAPI = inject(AspectAPI);
   fb = inject(FormBuilder);
  //  cdr = inject(ChangeDetectorRef);

  /* ───────── Forms ───────── */
  aspectForm = this.fb.group({
    aspectName: ['', [Validators.required]],
    aspectColor: ['#ffffff', [Validators.required]],
  });

  /* ───────── Modes ───────── */
  openCreateMode() {
    this.mode.set('create');
  }

  openViewMode(aspectId :ReadAspectRequest) {
    this.aspectAPI.getById(aspectId).subscribe({
      next:(response)=>{
        if(response.data){
          this.selectedAspect.set(response.data)
          this.mode.set('view');
          // this.cdr.detectChanges()
        }
      }
    })

  }

  openEditMode(aspect: UpdateAspectRequest) {
    this.mode.set('edit');
    this.aspectId = aspect.aspectId;
    this.originalAspect = { ...aspect };

    this.aspectForm.patchValue({
      aspectName: aspect.aspectName,
      aspectColor: aspect.aspectColor,
    });
  }

  openListMode() {
    this.aspectForm.reset({
      aspectColor: '#ffffff',
      aspectName: '',
    });

    this.mode.set('list');
  }

  /* ───────── Create ───────── */
  createAspect() {
    if (this.aspectForm.invalid) return;

    this.isLoadingCreate.set(true);

    const body = {
      aspectName: this.aspectForm.value.aspectName,
      aspectColor: this.aspectForm.value.aspectColor,
    };

    this.aspectAPI.create(body as any).subscribe({
      next: (response: GeneralResponseDto<CreateAspectResponse>) => {
        if (response.data) {
          this.loadAspects();

          this.openListMode();
          // this.cdr.detectChanges();

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
  updateAspect() {
    if (this.aspectForm.invalid || !this.aspectId) return;

    this.isLoadingEdit.set(true);

    const body = {
      aspectId: this.aspectId,
      aspectName: this.aspectForm.value.aspectName,
      aspectColor: this.aspectForm.value.aspectColor,
    };
    if (
      this.originalAspect &&
      body.aspectName === this.originalAspect.aspectName &&
      body.aspectColor === this.originalAspect.aspectColor
    ) {
      this.openListMode();
      this.isLoadingEdit.set(false)
              Swal.fire({
          icon: 'info',
          title: 'Not Updated',
          text: 'this is the same Data',
          confirmButtonText: 'ok',
        });
      return;
    }

    this.aspectAPI.update(body as any).subscribe({
      next: (response) => {
        this.loadAspects();

        this.isLoadingEdit.set(false);
        this.openListMode();
        this.aspectId = null;
        // this.cdr.detectChanges();

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
  delete(id: DeleteAspectRequest) {
    this.aspectAPI.delete(id).subscribe({
      next: (response) => {
        this.aspects.update((aspects) => aspects.filter((a) => a.aspectId !== id.aspectId));

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
  loadAspects() {
    this.isLoading.set(true);

    this.aspectAPI.getAll().subscribe({
      next: (response) => {
        this.aspects.set(response.data?.aspects ?? []);
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
