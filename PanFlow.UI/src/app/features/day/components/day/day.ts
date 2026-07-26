import { Component, inject, OnInit } from '@angular/core';
import { DayService } from './day-service';
import { ViewMode } from '../view-mode/view-mode';
import { ListMode } from '../list-mode/list-mode';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-day',
  imports: [ViewMode, ListMode],
  templateUrl: './day.html',
  styleUrl: './day.css',
})
export class Day implements OnInit {
  public dayService = inject(DayService);

  ngOnInit(): void {
    this.dayService.loadDays();
  }
}
