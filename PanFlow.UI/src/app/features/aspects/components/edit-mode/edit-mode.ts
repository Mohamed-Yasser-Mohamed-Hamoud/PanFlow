import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AspectService } from '../aspects/aspect-service';
import { AuthInput } from "../../../../shared/components/auth-input/auth-input";
import { ReactiveFormsModule, ɵInternalFormsSharedModule } from "@angular/forms";

@Component({
  selector: 'app-edit-mode',
  imports: [AuthInput, ɵInternalFormsSharedModule , ReactiveFormsModule],
  templateUrl: './edit-mode.html',
  styleUrl: './edit-mode.css',
})
export class EditMode {
  public aspectService = inject(AspectService)
   @Output() close = new EventEmitter<void>();


    closeMe() {
    this.close.emit();
}
}