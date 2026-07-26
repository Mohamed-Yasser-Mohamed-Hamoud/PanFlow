import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AspectService } from '../aspects/aspect-service';
import { AuthInput } from "../../../../shared/components/auth-input/auth-input";
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-create-mode',
  imports: [AuthInput , ReactiveFormsModule ,TranslatePipe],
  templateUrl: './create-mode.html',
  styleUrl: './create-mode.css',
})
export class CreateMode {
  public aspectService = inject(AspectService)
 @Output() close = new EventEmitter<void>();


    closeMe() {
    this.close.emit();
  }
}
