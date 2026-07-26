import { Component, inject } from '@angular/core';
import { HabitService } from '../habits/habit-service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-list-mode',
  imports: [TranslatePipe],
  templateUrl: './list-mode.html',
  styleUrl: './list-mode.css',
})
export class ListMode {
  public habitService = inject(HabitService);
}
