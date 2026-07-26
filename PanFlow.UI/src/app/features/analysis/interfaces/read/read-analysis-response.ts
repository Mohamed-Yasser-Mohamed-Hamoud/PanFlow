import { ReadDayAnalyticsResponse } from './read-day-analytics-response';
import { ReadHabitAnalyticsResponse } from './read-habit-analytics-response';

export interface ReadAnalysisResponse {
  readonly days: ReadDayAnalyticsResponse[];
  readonly habits: ReadHabitAnalyticsResponse[];
}
