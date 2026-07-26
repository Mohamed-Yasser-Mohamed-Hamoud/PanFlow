import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router'; // المسار مظبوط بالنسبة للفولدر الجديد
import { Profile } from '../../../users/components/profile/profile';
import { DashboardService } from '../dashboard/dashboard-service';
import { Popup } from '../../../../shared/services/popup';
import { Trash } from '../../../../shared/components/trash/trash';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, Profile, RouterLinkWithHref , Trash, TranslatePipe],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  providers: [DashboardService], // السيرفيس هنا بقت Scoped للـ Layout والـ Children بتوعه
})
export class DashboardLayout {
    languageService = inject(LanguageService);
  public dashboardService = inject(DashboardService);
  Pupup = inject(Popup)
toggleLanguage() {

  const current = this.languageService.getCurrentLanguage()();

  this.languageService.setLanguage(
    current === 'ar' ? 'en' : 'ar'
  );

}
  popup(){
    this.Pupup.underWork()
  }
}
