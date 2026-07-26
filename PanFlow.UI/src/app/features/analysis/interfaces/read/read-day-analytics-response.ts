export interface ReadDayAnalyticsResponse {
  readonly dayId: string;
  readonly date: string;
  readonly completionPercentage: number;
  readonly totalHabits: number;
  readonly completedHabits: number;
}
