import { Component, EventEmitter, inject, Output } from '@angular/core';
import { HabitService } from '../habits/habit-service';

@Component({
  selector: 'app-view-mode',
  imports: [],
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
