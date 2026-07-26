import { Component, inject } from '@angular/core';
import { AspectService } from '../aspects/aspect-service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-list-mode',
  imports: [TranslatePipe],
  templateUrl: './list-mode.html',
  styleUrl: './list-mode.css',
})
export class ListMode {
  public aspectService = inject(AspectService)
}
