import { Component, EventEmitter, inject, Output } from '@angular/core';
import { HabitService } from '../habits/habit-service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-view-mode',
  imports: [TranslatePipe],
  templateUrl: './view-mode.html',
  styleUrl: './view-mode.css',
})
export class ViewMode {
  public habitService = inject(HabitService);

  @Output() close = new EventEmitter<void>();

  closeMe() {
    this.close.emit();
  }
}
