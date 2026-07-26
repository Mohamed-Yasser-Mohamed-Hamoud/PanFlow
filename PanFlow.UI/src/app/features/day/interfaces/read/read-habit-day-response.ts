export interface ReadHabitDayResponse {
  readonly dayId: string;
  readonly habitId: string;
  readonly habitName: string;
  readonly habitColor: string;
  readonly isChecked: boolean;
  readonly order: number;
}