export type BaseTeam = {
  id: string;
  name: string;
  permalink: string;
};

export const AMERICA: BaseTeam = {
  id: '3f24c2e0-7fd2-46e4-94ba-4dd0b557e675',
  name: 'América',
  permalink: 'america',
};

export const CHIVAS: BaseTeam = {
  id: '99182b8e-143a-479b-8496-24f283e847ae',
  name: 'Chivas',
  permalink: 'chivas',
};

export const ATLAS: BaseTeam = {
  id: 'a8df70b7-cd38-4226-9d19-f33ccb35a7e4',
  name: 'Atlas',
  permalink: 'atlas',
};

export const CRUZ_AZUL: BaseTeam = {
  id: '808f2d38-24a2-4820-a4cd-58b035f78d20',
  name: 'Cruz Azul',
  permalink: 'cruz-azul',
};

export const PUMAS: BaseTeam = {
  id: 'cc5e281d-beb7-4198-a15b-1f463bc0355c',
  name: 'Pumas',
  permalink: 'pumas',
};

export const TIGRES: BaseTeam = {
  id: 'f970d029-aba6-4010-8680-470e7ba2d672',
  name: 'Tigres',
  permalink: 'tigres',
};

export const TOLUCA: BaseTeam = {
  id: '4a500eed-0ac1-4d0a-ad7b-ae57d934280c',
  name: 'Toluca',
  permalink: 'toluca',
};

export const teamsMock: BaseTeam[] = [
  AMERICA,
  CHIVAS,
  ATLAS,
  CRUZ_AZUL,
  PUMAS,
  TIGRES,
  TOLUCA,
];
