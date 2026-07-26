import { Injectable, inject, signal, computed } from '@angular/core';
import { AnalysisAPI } from '../../services/analysis-API';

export interface DayAnalytics {
  dayId: string;
  date: string;
  completionPercentage: number;
  totalHabits: number;
  completedHabits: number;
}

export interface HabitAnalytics {
  habitId: string;
  habitName: string;
  completionRate: number;
  totalDays: number;
  completedDays: number;
  habitColor: string;
  hasData: boolean;
}

@Injectable()
export class AnalysisService {
  private analysisAPI = inject(AnalysisAPI);

  // States
  isLoading = signal<boolean>(false);
  allDays = signal<DayAnalytics[]>([]);
  allHabits = signal<HabitAnalytics[]>([]);

  // Computed values
  bestDay = computed(() => {
    const days = this.allDays();
    return days.length > 0 ? days.reduce((a, b) => a.completionPercentage > b.completionPercentage ? a : b) : null;
  });

  worstDay = computed(() => {
    const days = this.allDays();
    return days.length > 0 ? days.reduce((a, b) => a.completionPercentage < b.completionPercentage ? a : b) : null;
  });

  // بنستبعد العادات اللي لسه معملتلهاش أي Day (hasData: false) من المقارنة
  // عشان منقولش "أسوأ عادة" على عادة لسه ما اتتابعتش أصلاً
  trackedHabits = computed(() => this.allHabits().filter(h => h.hasData));

  bestHabit = computed(() => {
    const habits = this.trackedHabits();
    return habits.length > 0 ? habits.reduce((a, b) => a.completionRate > b.completionRate ? a : b) : null;
  });

  worstHabit = computed(() => {
    const habits = this.trackedHabits();
    return habits.length > 0 ? habits.reduce((a, b) => a.completionRate < b.completionRate ? a : b) : null;
  });

  averageCompletion = computed(() => {
    const days = this.allDays();
    if (days.length === 0) return 0;
    const sum = days.reduce((acc, day) => acc + day.completionPercentage, 0);
    return Math.round(sum / days.length);
  });

  totalDaysCount = computed(() => this.allDays().length);

  /**
   * الحساب كله بقى شغال في الـ Backend (Analysis Feature)
   * الـ endpoint الواحد ده بيرجع الأيام والعادات جاهزين بالنسب الصحيحة،
   * فاختفت مشكلة إن completionRate بتاع العادات كان بيتحط صفر دايمًا.
   */
  loadAnalytics() {
    this.isLoading.set(true);

    this.analysisAPI.read().subscribe({
      next: (response) => {
        const days = response.data?.days ?? [];
        const habits = response.data?.habits ?? [];

        const daysAnalytics: DayAnalytics[] = days.map(day => ({
          dayId: day.dayId,
          date: day.date,
          completionPercentage: day.completionPercentage ?? 0,
          totalHabits: day.totalHabits ?? 0,
          completedHabits: day.completedHabits ?? 0
        }));
        this.allDays.set(daysAnalytics);

        const habitsAnalytics: HabitAnalytics[] = habits.map(habit => ({
          habitId: habit.habitId,
          habitName: habit.habitName,
          completionRate: habit.completionRate ?? 0,
          totalDays: habit.totalDays ?? 0,
          completedDays: habit.completedDays ?? 0,
          habitColor: habit.habitColor ?? '#cc8500',
          hasData: habit.hasData ?? (habit.totalDays ?? 0) > 0
        }));
        this.allHabits.set(habitsAnalytics);

        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
