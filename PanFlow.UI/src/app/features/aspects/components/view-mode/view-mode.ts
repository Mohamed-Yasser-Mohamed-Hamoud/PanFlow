import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AspectService } from '../aspects/aspect-service';
import { HabitService } from '../../../habits/components/habits/habit-service';

@Component({
  selector: 'app-view-mode',
  imports: [],
  templateUrl: './view-mode.html',
  styleUrl: './view-mode.css',
})
export class ViewMode {
  public aspectService = inject(AspectService)
  habitService = inject(HabitService)

   @Output() close = new EventEmitter<void>();


    closeMe() {
    this.close.emit();
}
}
