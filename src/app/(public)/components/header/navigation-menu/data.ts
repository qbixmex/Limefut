export type Navigation = {
  id: string;
  label: string;
  url: string;
  position: number;
  links: Link[];
};

export type Link = {
  id: string;
  url: string;
  label: string;
  position: number;
};

export const navigation: Navigation[] = [
  {
    id: "1735f040-1631-47e5-bc1c-edafa9d3aa9b",
    label: "Competencia",
    url: "#",
    position: 1,
    links: [
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
    ],
  },
  {
    id: "cf11cde7-cf10-436b-a0d4-366c81910db1",
    label: "Roles y Estadísticas",
    url: "#",
    position: 2,
    links: [
      {
        id: "7838bf7e-1f40-40bd-9559-e9ef808559b6",
        url: "/resultados",
        label: "Rol de juegos",
        position: 1,
      },
      {
        id: "2d166a1a-3852-40bf-98de-31725a5c7ab7",
        url: "/encuentros",
        label: "Encuentros",
        position: 2,
      },
      {
        id: "44f528e2-b083-4968-8e29-94e002a61cbb",
        url: "/estadisticas",
        label: "Estadísticas",
        position: 3,
      },
    ],
  },
  {
    id: "80e19606-c5cc-4bfd-bc4c-00cb785de1f9",
    label: "Multimedia",
    url: "#",
    position: 3,
    links: [
      {
        id: "5b73b4c8-e44e-464e-b7c4-83db499212c3",
        url: "/imagenes",
        label: "Imágenes",
        position: 6,
      },
    ],
  },
  {
    id: "0ff4c8d3-b657-41d5-92c1-8b0c081a9728",
    label: "Contacto",
    url: "/contacto",
    position: 4,
    links: [],
  },
];
