import { Component, inject } from '@angular/core';
import { DayService } from '../day/day-service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-list-mode',
  imports: [TranslatePipe],
  templateUrl: './list-mode.html',
  styleUrl: './list-mode.css',
})
export class ListMode {
  public dayService = inject(DayService);
}
