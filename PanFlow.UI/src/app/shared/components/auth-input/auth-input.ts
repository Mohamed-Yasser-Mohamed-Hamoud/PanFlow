import { Component, Input, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-auth-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf , TranslatePipe],
  templateUrl: './auth-input.html',
  styleUrl: './auth-input.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class AuthInput {
  @Input({ required: true }) controlName!: string;
  @Input({ required: true }) label!: string;
  @Input() type: string = 'text';

  private controlContainer = inject(ControlContainer);

  get parentForm() {
    return this.controlContainer.control as any;
  }
}