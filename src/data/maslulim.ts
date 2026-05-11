import type { Maslul } from '../types';

export const maslulim: Maslul[] = [
  // מנורה מבטחים
  { id: 'm1', house: 'מנורה מבטחים', name: 'מסלול כללי', trackType: 'כללי', yield1y: 12.4, yield3y: 8.1, yield5y: 7.3, yieldSinceInception: 6.8, aum: 48200 },
  { id: 'm2', house: 'מנורה מבטחים', name: 'מסלול מניות', trackType: 'מניות', yield1y: 18.7, yield3y: 11.2, yield5y: 10.1, yieldSinceInception: 9.4, aum: 12300 },
  { id: 'm3', house: 'מנורה מבטחים', name: 'מסלול אגרות חוב', trackType: 'אגח', yield1y: 5.2, yield3y: 3.8, yield5y: 3.1, yieldSinceInception: 4.2, aum: 8700 },
  { id: 'm4', house: 'מנורה מבטחים', name: 'מסלול S&P 500', trackType: 'S&P 500', yield1y: 22.1, yield3y: 15.3, yield5y: 14.8, yieldSinceInception: 13.2, aum: 6100 },
  { id: 'm5', house: 'מנורה מבטחים', name: 'מסלול שקלי', trackType: 'שקלי', yield1y: 4.8, yield3y: 3.2, yield5y: 2.9, yieldSinceInception: 3.5, aum: 4200 },

  // הפניקס
  { id: 'p1', house: 'הפניקס', name: 'מסלול כללי', trackType: 'כללי', yield1y: 13.1, yield3y: 8.6, yield5y: 7.8, yieldSinceInception: 7.1, aum: 52100 },
  { id: 'p2', house: 'הפניקס', name: 'מסלול מניות', trackType: 'מניות', yield1y: 19.3, yield3y: 12.1, yield5y: 10.8, yieldSinceInception: 9.9, aum: 14500 },
  { id: 'p3', house: 'הפניקס', name: 'מסלול אגרות חוב', trackType: 'אגח', yield1y: 4.9, yield3y: 3.5, yield5y: 2.8, yieldSinceInception: 3.9, aum: 9200 },
  { id: 'p4', house: 'הפניקס', name: 'מסלול S&P 500', trackType: 'S&P 500', yield1y: 23.4, yield3y: 16.1, yield5y: 15.2, yieldSinceInception: 13.8, aum: 7400 },
  { id: 'p5', house: 'הפניקס', name: 'מסלול גלובלי מניות', trackType: 'גלובלי מניות', yield1y: 16.8, yield3y: 10.4, yield5y: 9.6, yieldSinceInception: 8.7, aum: 5300 },

  // כלל ביטוח
  { id: 'k1', house: 'כלל ביטוח', name: 'מסלול כללי', trackType: 'כללי', yield1y: 11.8, yield3y: 7.9, yield5y: 7.1, yieldSinceInception: 6.5, aum: 41300 },
  { id: 'k2', house: 'כלל ביטוח', name: 'מסלול מניות', trackType: 'מניות', yield1y: 17.4, yield3y: 11.8, yield5y: 10.3, yieldSinceInception: 9.1, aum: 11200 },
  { id: 'k3', house: 'כלל ביטוח', name: 'מסלול אגרות חוב', trackType: 'אגח', yield1y: 5.4, yield3y: 4.1, yield5y: 3.4, yieldSinceInception: 4.5, aum: 7800 },
  { id: 'k4', house: 'כלל ביטוח', name: 'מסלול S&P 500', trackType: 'S&P 500', yield1y: 21.9, yield3y: 14.8, yield5y: 14.1, yieldSinceInception: 12.9, aum: 5800 },
  { id: 'k5', house: 'כלל ביטוח', name: 'מסלול שקלי', trackType: 'שקלי', yield1y: 4.6, yield3y: 3.0, yield5y: 2.7, yieldSinceInception: 3.3, aum: 3900 },

  // מגדל ביטוח
  { id: 'mg1', house: 'מגדל ביטוח', name: 'מסלול כללי', trackType: 'כללי', yield1y: 12.7, yield3y: 8.3, yield5y: 7.5, yieldSinceInception: 6.9, aum: 44700 },
  { id: 'mg2', house: 'מגדל ביטוח', name: 'מסלול מניות', trackType: 'מניות', yield1y: 18.2, yield3y: 11.5, yield5y: 10.5, yieldSinceInception: 9.6, aum: 13100 },
  { id: 'mg3', house: 'מגדל ביטוח', name: 'מסלול אגרות חוב', trackType: 'אגח', yield1y: 5.1, yield3y: 3.7, yield5y: 3.0, yieldSinceInception: 4.1, aum: 8100 },
  { id: 'mg4', house: 'מגדל ביטוח', name: 'מסלול S&P 500', trackType: 'S&P 500', yield1y: 22.8, yield3y: 15.6, yield5y: 14.9, yieldSinceInception: 13.4, aum: 6700 },
  { id: 'mg5', house: 'מגדל ביטוח', name: 'מסלול גלובלי מניות', trackType: 'גלובלי מניות', yield1y: 15.9, yield3y: 9.8, yield5y: 9.2, yieldSinceInception: 8.3, aum: 4800 },

  // הראל ביטוח
  { id: 'h1', house: 'הראל ביטוח', name: 'מסלול כללי', trackType: 'כללי', yield1y: 13.5, yield3y: 8.9, yield5y: 8.0, yieldSinceInception: 7.3, aum: 39800 },
  { id: 'h2', house: 'הראל ביטוח', name: 'מסלול מניות', trackType: 'מניות', yield1y: 20.1, yield3y: 12.7, yield5y: 11.2, yieldSinceInception: 10.3, aum: 10900 },
  { id: 'h3', house: 'הראל ביטוח', name: 'מסלול אגרות חוב', trackType: 'אגח', yield1y: 5.6, yield3y: 4.3, yield5y: 3.6, yieldSinceInception: 4.7, aum: 7200 },
  { id: 'h4', house: 'הראל ביטוח', name: 'מסלול S&P 500', trackType: 'S&P 500', yield1y: 24.2, yield3y: 16.8, yield5y: 15.9, yieldSinceInception: 14.1, aum: 8200 },
  { id: 'h5', house: 'הראל ביטוח', name: 'מסלול שקלי', trackType: 'שקלי', yield1y: 5.1, yield3y: 3.4, yield5y: 3.1, yieldSinceInception: 3.8, aum: 3400 },

  // מיטב
  { id: 'mt1', house: 'מיטב', name: 'מסלול כללי', trackType: 'כללי', yield1y: 11.2, yield3y: 7.4, yield5y: 6.8, yieldSinceInception: 6.2, aum: 28400 },
  { id: 'mt2', house: 'מיטב', name: 'מסלול מניות', trackType: 'מניות', yield1y: 17.9, yield3y: 11.1, yield5y: 9.8, yieldSinceInception: 9.0, aum: 8700 },
  { id: 'mt3', house: 'מיטב', name: 'מסלול S&P 500', trackType: 'S&P 500', yield1y: 21.4, yield3y: 14.5, yield5y: 13.8, yieldSinceInception: 12.4, aum: 4200 },
  { id: 'mt4', house: 'מיטב', name: 'מסלול גלובלי מניות', trackType: 'גלובלי מניות', yield1y: 15.3, yield3y: 9.4, yield5y: 8.7, yieldSinceInception: 7.9, aum: 3100 },

  // אנליסט
  { id: 'a1', house: 'אנליסט', name: 'מסלול כללי', trackType: 'כללי', yield1y: 10.8, yield3y: 7.1, yield5y: 6.4, yieldSinceInception: null, aum: 18900 },
  { id: 'a2', house: 'אנליסט', name: 'מסלול מניות', trackType: 'מניות', yield1y: 16.3, yield3y: 10.4, yield5y: 9.2, yieldSinceInception: null, aum: 5600 },
  { id: 'a3', house: 'אנליסט', name: 'מסלול S&P 500', trackType: 'S&P 500', yield1y: 20.8, yield3y: null, yield5y: null, yieldSinceInception: null, aum: 2800 },

  // פסגות
  { id: 'ps1', house: 'פסגות', name: 'מסלול כללי', trackType: 'כללי', yield1y: 11.5, yield3y: 7.6, yield5y: 6.9, yieldSinceInception: 6.3, aum: 22100 },
  { id: 'ps2', house: 'פסגות', name: 'מסלול מניות', trackType: 'מניות', yield1y: 17.1, yield3y: 10.8, yield5y: 9.6, yieldSinceInception: 8.8, aum: 7300 },
  { id: 'ps3', house: 'פסגות', name: 'מסלול אגרות חוב', trackType: 'אגח', yield1y: 4.7, yield3y: 3.4, yield5y: 2.7, yieldSinceInception: 3.8, aum: 5900 },
];

export const HOUSES = [...new Set(maslulim.map((m) => m.house))].sort();
export const TRACK_TYPES = [...new Set(maslulim.map((m) => m.trackType))].sort();
