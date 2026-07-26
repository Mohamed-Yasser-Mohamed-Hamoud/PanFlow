import { Injectable, inject, signal, computed } from '@angular/core';
import { DayAPI } from '../../../day/services/day-API';
import { HabitAPI } from '../../../habits/services/habit-API';
import { forkJoin } from 'rxjs';

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
}

@Injectable()
export class AnalysisService {
  private dayAPI = inject(DayAPI);
  private habitAPI = inject(HabitAPI);

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

  bestHabit = computed(() => {
    const habits = this.allHabits();
    return habits.length > 0 ? habits.reduce((a, b) => a.completionRate > b.completionRate ? a : b) : null;
  });

  worstHabit = computed(() => {
    const habits = this.allHabits();
    return habits.length > 0 ? habits.reduce((a, b) => a.completionRate < b.completionRate ? a : b) : null;
  });

  averageCompletion = computed(() => {
    const days = this.allDays();
    if (days.length === 0) return 0;
    const sum = days.reduce((acc, day) => acc + day.completionPercentage, 0);
    return Math.round(sum / days.length);
  });

  totalDaysCount = computed(() => this.allDays().length);

  loadAnalytics() {
    this.isLoading.set(true);

    // بنستخدم forkJoin عشان نسحب كل البيانات مرة واحدة
    forkJoin({
      daysRes: this.dayAPI.readAll(),
      habitsRes: this.habitAPI.readAll()
    }).subscribe({
      next: ({ daysRes, habitsRes }) => {
        const days = daysRes.data?.days ?? [];
        const habits = habitsRes.data?.habits ?? [];

        // 1. تحويل بيانات الأيام (التوافق مع ReadDaySummaryResponse)
        const daysAnalytics: DayAnalytics[] = days.map(day => ({
          dayId: day.dayId,
          date: day.date,
          completionPercentage: day.completionPercentage ?? 0,
          totalHabits: day.totalHabits ?? 0,
          completedHabits: day.completedHabits ?? 0
        }));
        this.allDays.set(daysAnalytics);

        /**
         * 2. حساب إحصائيات العادات
         * ملحوظة: الـ readAll للأيام مش بتبعت تفاصيل العادات (بس العدد والنسبة).
         * عشان نحسب "أفضل عادة" بدقة، لازم نسحب تفاصيل كل يوم، وده تقيل جداً لو الأيام كتير.
         * كحل وسط، هنعتمد على البيانات المتاحة أو نفترض توزيعاً متساوياً،
         * بس الصح إن الباك إند هو اللي يحسب دي.
         * هنا هنخليها أصفار مؤقتاً لحد ما الـ API يدعمها، أو نحسبها لو الـ API بيبعت Habits.
         */
        const habitsAnalytics: HabitAnalytics[] = habits.map(habit => {
          // حالياً الـ ReadDaySummaryResponse مبيبعتش الـ Habits بالتفصيل
          // فالحساب هنا هيفترض 0 لحد ما نطور الـ API
          return {
            habitId: habit.habitId,
            habitName: habit.habitName,
            completionRate: 0, 
            totalDays: 0,
            completedDays: 0,
            habitColor: habit.habitColor ?? '#cc8500'
          };
        });

        this.allHabits.set(habitsAnalytics);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
