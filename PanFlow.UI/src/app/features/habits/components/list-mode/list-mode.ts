import { Component, inject } from '@angular/core';
import { HabitService } from '../habits/habit-service';

@Component({
  selector: 'app-list-mode',
  imports: [],
  templateUrl: './list-mode.html',
  styleUrl: './list-mode.css',
})
export class ListMode {
  public habitService = inject(HabitService);
}
