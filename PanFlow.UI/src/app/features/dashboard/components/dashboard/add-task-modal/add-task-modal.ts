import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { AspectAPI } from '../../../../aspects/services/aspect-API';
import { HabitAPI } from '../../../../habits/services/habit-API';
import { ReadAspectResponse } from '../../../../aspects/interfaces/read/read-aspect-response';
import { ReadHabitResponse } from '../../../../habits/interfaces/read/read-habit-response';
import { TranslatePipe } from '../../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './add-task-modal.html',
  styleUrl: './add-task-modal.css',
})
export class AddTaskModal implements OnInit {
  // الـ Ids بتاعة العادات الموجودة في اليوم بالفعل، عشان نستبعدها من قائمة الاختيار
  @Input() excludedHabitIds: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string[]>();

  private aspectAPI = inject(AspectAPI);
  private habitAPI = inject(HabitAPI);

  aspects = signal<ReadAspectResponse[]>([]);
  habits = signal<ReadHabitResponse[]>([]);
  selectedAspectId = signal<string | null>(null);
  selectedHabitIds = signal<Set<string>>(new Set());

  isLoadingAspects = signal(false);
  isLoadingHabits = signal(false);

  ngOnInit(): void {
    this.loadAspects();
  }

  loadAspects() {
    this.isLoadingAspects.set(true);

    this.aspectAPI.getAll().subscribe({
      next: (res) => {
        this.aspects.set(res.data?.aspects ?? []);
        this.isLoadingAspects.set(false);
      },
      error: () => {
        this.isLoadingAspects.set(false);
      },
    });
  }

  selectAspect(aspectId: string) {
    this.selectedAspectId.set(aspectId);
    this.loadHabits(aspectId);
  }

  loadHabits(aspectId: string) {
    this.isLoadingHabits.set(true);
    this.habits.set([]);

    this.habitAPI.getAspectHabits({ aspectId }).subscribe({
      next: (res) => {
        const list = res.data?.habits ?? [];
        // نستبعد العادات المضافة بالفعل في اليوم الحالي
        this.habits.set(list.filter((h) => !this.excludedHabitIds.includes(h.habitId)));
        this.isLoadingHabits.set(false);
      },
      error: () => {
        this.isLoadingHabits.set(false);
      },
    });
  }

  toggleHabit(habitId: string) {
    this.selectedHabitIds.update((set) => {
      const next = new Set(set);
      if (next.has(habitId)) {
        next.delete(habitId);
      } else {
        next.add(habitId);
      }
      return next;
    });
  }

  isSelected(habitId: string): boolean {
    return this.selectedHabitIds().has(habitId);
  }

  onConfirm() {
    const ids = Array.from(this.selectedHabitIds());
    if (ids.length === 0) return;
    this.confirm.emit(ids);
  }

  onClose() {
    this.close.emit();
  }
}
