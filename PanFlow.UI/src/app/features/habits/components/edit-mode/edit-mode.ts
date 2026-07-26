import { Component, EventEmitter, inject, Output } from '@angular/core';
import { HabitService } from '../habits/habit-service';
import { AuthInput } from '../../../../shared/components/auth-input/auth-input';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-edit-mode',
  imports: [AuthInput, ReactiveFormsModule,TranslatePipe],
  templateUrl: './edit-mode.html',
  styleUrl: './edit-mode.css',
})
export class EditMode {
  public habitService = inject(HabitService);
  @Output() close = new EventEmitter<void>();

  closeMe() {
    this.close.emit();
  }
}
