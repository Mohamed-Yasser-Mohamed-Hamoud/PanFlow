import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AspectService } from '../aspects/aspect-service';

@Component({
  selector: 'app-view-mode',
  imports: [],
  templateUrl: './view-mode.html',
  styleUrl: './view-mode.css',
})
export class ViewMode {
  public aspectService = inject(AspectService)

   @Output() close = new EventEmitter<void>();


    closeMe() {
    this.close.emit();
}
}
