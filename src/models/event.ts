export type Event = {
  id?: number;
  league: string;
  teamName: string;
  eventName: string;
  rawName: string;
  matchup: string;
  startDate: string; // use ISO string format: 'YYYY-MM-DD'
  endDate: string; // same as above
  description: string;
  timeAndZone: string;
  location: string;
  offerURL: string;
  dayOfWeek: string;
  createdAt?: string; // ISO 8601 string (TIMESTAMPTZ)
  updatedAt?: string;
};
