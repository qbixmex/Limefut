import type { NavItem } from "../nav-main";
import type { NavLink } from "../nav-links";
import {
  Users,
  Globe,
  ListIcon,
  PlusIcon,
  Flag,
  Trophy,
  IdCard,
  Files,
  Sheet,
  TrendingUp,
  Inbox,
  ImageIcon,
} from "lucide-react";
import { GiWhistle } from "react-icons/gi";
import {
  SoccerPlayer,
  SoccerField,
} from "@/shared/components/icons";

export const navMain: NavItem[] = [
  {
    label: "Torneos",
    url: "#",
    icon: Trophy,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/torneos",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/torneos/crear",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Equipos",
    url: "#",
    icon: Flag,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/equipos",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/equipos/crear",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Entrenadores",
    url: "#",
    icon: GiWhistle,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/entrenadores",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/entrenadores/crear",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Jugadores",
    url: "#",
    icon: SoccerPlayer,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/jugadores",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/jugadores/crear",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Encuentros",
    url: "#",
    icon: SoccerField,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/encuentros",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/encuentros/crear",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Estadísticas",
    url: "#",
    icon: TrendingUp,
    isActive: false,
    subItems: [
      {
        label: "Tabla de Posiciones",
        url: "/admin/estadisticas",
        icon: Sheet,
      },
    ],
  },
  {
    label: "Páginas",
    url: "#",
    icon: Files,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/paginas",
        icon: ListIcon,
      },
    ],
  },
  {
    label: "Credenciales",
    url: "#",
    icon: IdCard,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/credenciales",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/credenciales/crear",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Galerías",
    url: "#",
    icon: ImageIcon,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/galerias",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/galerias/crear",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Usuarios",
    url: "#",
    icon: Users,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/usuarios",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/usuarios/crear",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Mensajes",
    url: "#",
    icon: Inbox,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/mensajes",
        icon: ListIcon,
      },
    ],
  },
];

export const navLinks: NavLink[] = [
  {
    label: "Página Principal",
    url: "/",
    icon: Globe,
    target: '_blank',
  },
];