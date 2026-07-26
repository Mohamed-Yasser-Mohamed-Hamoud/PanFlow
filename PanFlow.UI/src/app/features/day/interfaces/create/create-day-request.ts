export interface CreateDayRequest {
  readonly date?: string; // ISO date string (yyyy-MM-dd) - optional, defaults to today on backend
  readonly habitIds: string[]; // العادات اللي عايز تضيفها لليوم وقت الإنشاء (ممكن تيجي فاضية [])
}
