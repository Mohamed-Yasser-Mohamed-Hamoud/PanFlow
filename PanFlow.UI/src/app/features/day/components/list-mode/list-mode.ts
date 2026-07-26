import { Component, inject } from '@angular/core';
import { DayService } from '../day/day-service';

@Component({
  selector: 'app-list-mode',
  imports: [],
  templateUrl: './list-mode.html',
  styleUrl: './list-mode.css',
})
export class ListMode {
  public dayService = inject(DayService);
}
