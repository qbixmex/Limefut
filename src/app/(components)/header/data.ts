export type Link = {
  id: string;
  url: string;
  label: string;
  position: number;
};

export const links: Link[] = [
  {
    id: "55074de1-5c02-489d-b712-428e234c8a24",
    url: "/teams",
    label: "Equipos",
    position: 1,
  },
  {
    id: "6e6a5dbc-e8ef-4e67-9e87-255301eaf3c7",
    url: "#",
    label: "Roles",
    position: 2,
  },
  {
    id: "44f528e2-b083-4968-8e29-94e002a61cbb",
    url: "#",
    label: "Estadísticas",
    position: 3,
  },
  {
    id: "20d31d0a-4fe2-4c9b-b7f0-54b49ae1f0af",
    url: "#",
    label: "Información",
    position: 4,
  },
  {
    id: "5b73b4c8-e44e-464e-b7c4-83db499212c3",
    url: "#",
    label: "Imágenes",
    position: 5,
  },
];