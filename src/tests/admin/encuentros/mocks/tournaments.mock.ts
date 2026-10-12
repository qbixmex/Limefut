export type Tournament = {
  id: string;
  name: string;
  permalink: string;
};

export const LIGA_MX: Tournament = {
  id: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac',
  name: 'Liga MX',
  permalink: 'liga-mx',
};

export const COPA_POR_MEXICO: Tournament = {
  id: 'cdc1500c-eabc-4790-9a92-6d63c2f41009',
  name: 'Copa por México',
  permalink: 'copa-por-mexico',
};

export const TORNEO_VERANO: Tournament = {
  id: 'cefdb388-7864-4b11-b885-c3c1905d5fd8',
  name: 'Torneo de verano',
  permalink: 'torneo-de-verano',
};

export const tournamentsMock: Tournament[] = [
  LIGA_MX,
  COPA_POR_MEXICO,
  TORNEO_VERANO,
];
