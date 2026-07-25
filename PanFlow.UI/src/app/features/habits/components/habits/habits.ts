import { Component, inject, OnInit } from '@angular/core';
import { HabitService } from './habit-service';
import { ViewMode } from '../view-mode/view-mode';
import { CreateMode } from '../create-mode/create-mode';
import { EditMode } from '../edit-mode/edit-mode';
import { ListMode } from '../list-mode/list-mode';

@Component({
  selector: 'app-habits',
  imports: [ViewMode, CreateMode, EditMode, ListMode],
  templateUrl: './habits.html',
  styleUrl: './habits.css',
})
export class Habits implements OnInit {
  public habitService = inject(HabitService);

  ngOnInit(): void {
    this.habitService.loadHabits();
  }
}
