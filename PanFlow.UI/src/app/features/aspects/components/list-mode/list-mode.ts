import { Component, inject } from '@angular/core';
import { AspectService } from '../aspects/aspect-service';

@Component({
  selector: 'app-list-mode',
  imports: [],
  templateUrl: './list-mode.html',
  styleUrl: './list-mode.css',
})
export class ListMode {
  public aspectService = inject(AspectService)
}
