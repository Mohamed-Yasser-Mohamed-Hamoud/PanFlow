import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from './dashboard-service';
import { AddTaskModal } from './add-task-modal/add-task-modal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true, // تأكد إنها مكتوبة لو مش موجودة
  imports: [DragDropModule, TranslatePipe, AddTaskModal], // 🎯 شيلنا الـ Profile من هنا لأن الأب خلاص شايفه
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  // 🎯 شيلنا الـ providers تماماً عشان يورث نفس السيرفيس من الأب (DashboardLayout)
})
export class Dashboard implements OnInit {
  public dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.dashboardService.updateDateDisplay();
  }
}
