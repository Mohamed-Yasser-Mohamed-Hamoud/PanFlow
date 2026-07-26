import { ReadHabitDayResponse } from './read-habit-day-response';

export interface ReadDayResponse {
  readonly dayId: string;
  readonly date: string;
  readonly habits: ReadHabitDayResponse[];
  readonly completionPercentage: number;
  readonly isDeleted: boolean; // أضفنا هذا الحقل لحل مشكلة الـ TypeScript Error
}
