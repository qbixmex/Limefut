export type Link = {
  id: string;
  url: string;
  label: string;
  position: number;
};

export const links: Link[] = [
  {
    id: "6e6a5dbc-e8ef-4e67-9e87-255301eaf3c7",
    url: "/torneos",
    label: "Torneos",
    position: 1,
  },
  {
    id: "55074de1-5c02-489d-b712-428e234c8a24",
    url: "/equipos",
    label: "Equipos",
    position: 2,
  },
  {
    id: "2d166a1a-3852-40bf-98de-31725a5c7ab7",
    url: "/encuentros",
    label: "Encuentros",
    position: 3,
  },
  {
    id: "7838bf7e-1f40-40bd-9559-e9ef808559b6",
    url: "/resultados",
    label: "Rol de juegos y Resultados",
    position: 4,
  },
  {
    id: "44f528e2-b083-4968-8e29-94e002a61cbb",
    url: "/estadisticas",
    label: "Estadísticas",
    position: 5,
  },
  {
    id: "5b73b4c8-e44e-464e-b7c4-83db499212c3",
    url: "/imagenes",
    label: "Imágenes",
    position: 6,
  },
  {
    id: 'e039fa74-2361-4f81-8128-f3561cec6a6e',
    url: "/contacto",
    label: "Contacto",
    position: 7,
  },
];