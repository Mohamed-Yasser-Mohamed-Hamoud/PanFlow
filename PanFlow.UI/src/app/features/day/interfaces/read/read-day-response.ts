import { ReadDayHabitResponse } from './read-day-habit-response';

export interface ReadDayResponse {
  readonly dayId: string;
  readonly date: string;
  readonly habits: ReadDayHabitResponse[];
  readonly completionPercentage: number;
}
