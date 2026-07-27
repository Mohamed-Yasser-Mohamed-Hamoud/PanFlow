import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from './dashboard-service';
import { AddTaskModal } from './add-task-modal/add-task-modal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DragDropModule, TranslatePipe, AddTaskModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  public dashboardService = inject(DashboardService);

  ngOnInit(): void {
    // 🎯 استبدلنا updateDateDisplay بـ refreshCard لجلب كارت اليوم فقط
    this.dashboardService.refreshCard();
  }
}