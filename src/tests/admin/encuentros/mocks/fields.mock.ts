export type Field = {
  id: string;
  name: string;
  permalink: string;
};

export const ESTADIO_AZTECA: Field = {
  id: 'b9c2b88d-7bd5-4a76-ae77-579917e5b57f',
  name: 'Estadio Azteca',
  permalink: 'estadio-azteca',
};

export const ESTADIO_AKRON: Field = {
  id: '9d2ad913-326b-4479-acf3-d1cb9a1cf0b0',
  name: 'Estadio Akron',
  permalink: 'estadio-akron',
};

export const ESTADIO_UNIVERSITARIO: Field = {
  id: 'ede85528-4bd5-418c-b017-dbcedd079f8a',
  name: 'Estadio Universitario',
  permalink: 'estadio-universitario',
};

export const fieldsMock: Field[] = [
  ESTADIO_AZTECA,
  ESTADIO_AKRON,
  ESTADIO_UNIVERSITARIO,
];
