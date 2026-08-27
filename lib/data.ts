export type Plan = {
  id: string;
  destinationId: string;
  dataAmountGb: number;
  validityDays: number;
  priceUsd: number;
  networkType: '4G/LTE' | '5G';
};

export type Destination = {
  id: string;
  name: string;
  region: string;
  flag: string;
  coverage: string[];
  /** Local-language greeting, shown alongside the English welcome on landing. */
  salutation: string;
  /** A couple of colors from the destination's flag, used to accent the landed-welcome banner. */
  flagColors: [string, string] | [string, string, string];
};

export const destinations: Destination[] = [
  {
    id: 'japan',
    name: 'Japan',
    region: 'Asia',
    flag: '🇯🇵',
    coverage: ['NTT Docomo', 'SoftBank'],
    salutation: 'Konnichiwa',
    flagColors: ['#BC002D', '#FFFFFF'],
  },
  {
    id: 'usa',
    name: 'United States',
    region: 'North America',
    flag: '🇺🇸',
    coverage: ['T-Mobile', 'AT&T'],
    salutation: 'Hello',
    flagColors: ['#3C3B6E', '#B22234', '#FFFFFF'],
  },
  {
    id: 'france',
    name: 'France',
    region: 'Europe',
    flag: '🇫🇷',
    coverage: ['Orange', 'SFR'],
    salutation: 'Bonjour',
    flagColors: ['#0055A4', '#FFFFFF', '#EF4135'],
  },
  {
    id: 'thailand',
    name: 'Thailand',
    region: 'Asia',
    flag: '🇹🇭',
    coverage: ['AIS', 'True Move'],
    salutation: 'Sawatdee',
    flagColors: ['#A51931', '#2D2A4A'],
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    region: 'Europe',
    flag: '🇬🇧',
    coverage: ['EE', 'Vodafone'],
    salutation: 'Hello',
    flagColors: ['#012169', '#C8102E', '#FFFFFF'],
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    region: 'Middle East',
    flag: '🇦🇪',
    coverage: ['Etisalat', 'du'],
    salutation: 'Marhaba',
    flagColors: ['#00732F', '#FF0000'],
  },
  {
    id: 'australia',
    name: 'Australia',
    region: 'Oceania',
    flag: '🇦🇺',
    coverage: ['Telstra', 'Optus'],
    salutation: "G'day",
    flagColors: ['#00008B', '#FF0000', '#FFFFFF'],
  },
  {
    id: 'mexico',
    name: 'Mexico',
    region: 'North America',
    flag: '🇲🇽',
    coverage: ['Telcel', 'AT&T'],
    salutation: 'Hola',
    flagColors: ['#006341', '#CE1126'],
  },
  {
    id: 'europe',
    name: 'Europe (30 countries)',
    region: 'Regional',
    flag: '🇪🇺',
    coverage: ['Multi-carrier regional network'],
    salutation: 'Bonjour · Hallo · Ciao',
    flagColors: ['#003399', '#FFCC00'],
  },
];

export const plans: Plan[] = [
  { id: 'japan-1', destinationId: 'japan', dataAmountGb: 1, validityDays: 7, priceUsd: 4.5, networkType: '4G/LTE' },
  { id: 'japan-3', destinationId: 'japan', dataAmountGb: 3, validityDays: 15, priceUsd: 10.5, networkType: '5G' },
  { id: 'japan-10', destinationId: 'japan', dataAmountGb: 10, validityDays: 30, priceUsd: 24, networkType: '5G' },

  { id: 'usa-1', destinationId: 'usa', dataAmountGb: 1, validityDays: 7, priceUsd: 5, networkType: '4G/LTE' },
  { id: 'usa-5', destinationId: 'usa', dataAmountGb: 5, validityDays: 15, priceUsd: 17, networkType: '5G' },
  { id: 'usa-20', destinationId: 'usa', dataAmountGb: 20, validityDays: 30, priceUsd: 42, networkType: '5G' },

  { id: 'france-1', destinationId: 'france', dataAmountGb: 1, validityDays: 7, priceUsd: 4, networkType: '4G/LTE' },
  { id: 'france-5', destinationId: 'france', dataAmountGb: 5, validityDays: 15, priceUsd: 13.5, networkType: '5G' },
  { id: 'france-20', destinationId: 'france', dataAmountGb: 20, validityDays: 30, priceUsd: 33, networkType: '5G' },

  { id: 'thailand-1', destinationId: 'thailand', dataAmountGb: 1, validityDays: 7, priceUsd: 3.5, networkType: '4G/LTE' },
  { id: 'thailand-5', destinationId: 'thailand', dataAmountGb: 5, validityDays: 15, priceUsd: 11, networkType: '4G/LTE' },
  { id: 'thailand-10', destinationId: 'thailand', dataAmountGb: 10, validityDays: 30, priceUsd: 19, networkType: '5G' },

  { id: 'uk-1', destinationId: 'uk', dataAmountGb: 1, validityDays: 7, priceUsd: 4, networkType: '4G/LTE' },
  { id: 'uk-5', destinationId: 'uk', dataAmountGb: 5, validityDays: 15, priceUsd: 13, networkType: '5G' },
  { id: 'uk-20', destinationId: 'uk', dataAmountGb: 20, validityDays: 30, priceUsd: 31, networkType: '5G' },

  { id: 'uae-1', destinationId: 'uae', dataAmountGb: 1, validityDays: 7, priceUsd: 6, networkType: '4G/LTE' },
  { id: 'uae-5', destinationId: 'uae', dataAmountGb: 5, validityDays: 15, priceUsd: 19, networkType: '5G' },

  { id: 'australia-1', destinationId: 'australia', dataAmountGb: 1, validityDays: 7, priceUsd: 5.5, networkType: '4G/LTE' },
  { id: 'australia-5', destinationId: 'australia', dataAmountGb: 5, validityDays: 15, priceUsd: 16, networkType: '5G' },
  { id: 'australia-20', destinationId: 'australia', dataAmountGb: 20, validityDays: 30, priceUsd: 38, networkType: '5G' },

  { id: 'mexico-1', destinationId: 'mexico', dataAmountGb: 1, validityDays: 7, priceUsd: 4.5, networkType: '4G/LTE' },
  { id: 'mexico-5', destinationId: 'mexico', dataAmountGb: 5, validityDays: 15, priceUsd: 14, networkType: '4G/LTE' },

  { id: 'europe-1', destinationId: 'europe', dataAmountGb: 1, validityDays: 7, priceUsd: 5, networkType: '4G/LTE' },
  { id: 'europe-5', destinationId: 'europe', dataAmountGb: 5, validityDays: 15, priceUsd: 15, networkType: '5G' },
  { id: 'europe-20', destinationId: 'europe', dataAmountGb: 20, validityDays: 30, priceUsd: 36, networkType: '5G' },
];

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

export function getPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id);
}

export function getPlansForDestination(destinationId: string): Plan[] {
  return plans.filter((p) => p.destinationId === destinationId).sort((a, b) => a.dataAmountGb - b.dataAmountGb);
}
