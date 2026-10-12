import {
  AMERICA,
  CHIVAS,
  ATLAS,
  CRUZ_AZUL,
  PUMAS,
  TIGRES,
  TOLUCA,
} from './teams.mock';
import {
  ESTADIO_AZTECA,
  ESTADIO_AKRON,
  ESTADIO_UNIVERSITARIO,
} from './fields.mock';

export const teamsForMatchMock = [
  { ...AMERICA, fields: [ESTADIO_AZTECA] },
  { ...CHIVAS, fields: [ESTADIO_AKRON] },
  { ...ATLAS, fields: [ESTADIO_UNIVERSITARIO] },
  { ...CRUZ_AZUL, fields: [ESTADIO_AZTECA] },
  { ...PUMAS, fields: [] },
  { ...TIGRES, fields: [ESTADIO_UNIVERSITARIO] },
  { ...TOLUCA, fields: [ESTADIO_AKRON] },
];
