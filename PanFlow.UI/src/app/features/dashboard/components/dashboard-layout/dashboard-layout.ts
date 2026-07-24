import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router'; // المسار مظبوط بالنسبة للفولدر الجديد
import { Profile } from '../../../users/components/profile/profile';
import { DashboardService } from '../dashboard/dashboard-service';
import { Popup } from '../../../../shared/services/popup';
import { Trash } from '../../../../shared/components/trash/trash';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, Profile, RouterLinkWithHref , Trash],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  providers: [DashboardService], // السيرفيس هنا بقت Scoped للـ Layout والـ Children بتوعه
})
export class DashboardLayout {
  public dashboardService = inject(DashboardService);
  Pupup = inject(Popup)

  popup(){
    this.Pupup.underWork()
  }
}
