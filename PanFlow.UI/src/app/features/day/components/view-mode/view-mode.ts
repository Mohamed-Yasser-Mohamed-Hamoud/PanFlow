import { Component, inject } from '@angular/core';
import { DayService } from '../day/day-service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-view-mode',
  imports: [TranslatePipe],
  templateUrl: './view-mode.html',
  styleUrl: './view-mode.css',
})
export class ViewMode {
  public dayService = inject(DayService);
}
