import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from './dashboard-service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // تأكد إنها مكتوبة لو مش موجودة
  imports: [], // 🎯 شيلنا الـ Profile من هنا لأن الأب خلاص شايفه
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
