export interface ReadHabitAnalyticsResponse {
  readonly habitId: string;
  readonly habitName: string;
  readonly habitColor: string;
  readonly completionRate: number;
  readonly totalDays: number;
  readonly completedDays: number;
  readonly hasData: boolean;
}
