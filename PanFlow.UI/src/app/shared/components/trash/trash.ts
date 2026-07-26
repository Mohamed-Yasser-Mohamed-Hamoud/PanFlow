import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TrashService } from './trashService';

@Component({
  selector: 'app-trash',
  imports: [TranslatePipe],
  providers: [TrashService],
  templateUrl: './trash.html',
  styleUrl: './trash.css',
})
export class Trash implements OnInit {

  trashService = inject(TrashService);

  @Output() close = new EventEmitter<void>();

  closeMe() {
    this.close.emit();
  }

  ngOnInit(): void {
    this.trashService.loadDeletedAspects();
    this.trashService.loadDeletedHabits();
    this.trashService.loadDeletedDays();
  }
}