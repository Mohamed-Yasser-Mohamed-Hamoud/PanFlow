import { ReadDaySummaryResponse } from './read-day-summary-response';

export interface ReadAllDayResponse {
  readonly days: ReadDaySummaryResponse[];
}
