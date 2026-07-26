export interface ReadDaySummaryResponse {
  readonly dayId: string;
  readonly date: string;
  readonly completionPercentage: number;
  readonly totalHabits: number;
  readonly completedHabits: number;
}
