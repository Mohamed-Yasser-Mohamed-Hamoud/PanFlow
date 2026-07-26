import { Component, inject } from '@angular/core';
import { DayService } from '../day/day-service';

@Component({
  selector: 'app-view-mode',
  imports: [],
  templateUrl: './view-mode.html',
  styleUrl: './view-mode.css',
})
export class ViewMode {
  public dayService = inject(DayService);
}
