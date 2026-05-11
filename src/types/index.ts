export type TrackType =
  | 'כללי'
  | 'מניות'
  | 'אגח'
  | 'שקלי'
  | 'S&P 500'
  | 'גלובלי מניות';

export interface Maslul {
  id: string;
  house: string;
  name: string;
  trackType: TrackType;
  yield1y: number | null;
  yield3y: number | null;
  yield5y: number | null;
  yieldSinceInception: number | null;
  aum: number; // millions ILS
}

export type SortKey = 'yield1y' | 'yield3y' | 'yield5y' | 'yieldSinceInception';
export type SortDir = 'asc' | 'desc';
