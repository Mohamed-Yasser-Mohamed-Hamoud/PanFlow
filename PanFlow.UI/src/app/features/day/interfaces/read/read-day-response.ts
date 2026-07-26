import { ReadHabitDayResponse } from './read-habit-day-response';

export interface ReadDayResponse {
  readonly dayId: string;
  readonly date: string;
  readonly habits: ReadHabitDayResponse[];
  readonly completionPercentage: number;
}
