import { Component, EventEmitter, inject, Output } from '@angular/core';
import { HabitService } from '../habits/habit-service';
import { AuthInput } from '../../../../shared/components/auth-input/auth-input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-mode',
  imports: [AuthInput, ReactiveFormsModule],
  templateUrl: './create-mode.html',
  styleUrl: './create-mode.css',
})
export class CreateMode {
  public habitService = inject(HabitService);
  @Output() close = new EventEmitter<void>();

  closeMe() {
    this.close.emit();
  }
}
