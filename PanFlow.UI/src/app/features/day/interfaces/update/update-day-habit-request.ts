export interface UpdateDayHabitRequest {
  readonly dayId: string;
  readonly habitId: string;
  readonly isChecked: boolean;
}
