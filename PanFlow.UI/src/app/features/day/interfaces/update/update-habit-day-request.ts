export interface UpdateHabitDayRequest {
  readonly dayId: string;
  readonly habitId: string;
  readonly isChecked: boolean;
}
