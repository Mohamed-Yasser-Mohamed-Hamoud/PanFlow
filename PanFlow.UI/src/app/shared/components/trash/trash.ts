import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { trashService } from './trashService';

@Component({
  selector: 'app-trash',
  imports: [],
  providers:[trashService ],
  templateUrl: './trash.html',
  styleUrl: './trash.css',
})
export class Trash implements OnInit{
  trashService = inject(trashService)
  @Output() close = new EventEmitter<void>();

  closeMe()
  {
    this.close.emit();
  }

ngOnInit(): void {
  this.trashService.loadDeletedAspects();
  this.trashService.loadDeletedHabits();
}


}
