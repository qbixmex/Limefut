import type { LucideIcon } from "lucide-react";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons/lib";
import type { CustomIconType } from "@/shared/types/icon";

export type Social = {
  id: string;
  url: string;
  icon: IconType | LucideIcon | CustomIconType;
  css: string;
  active: boolean;
};

export const socialMedia: Social[] = [
  {
    id: "53d1237e-8535-42bf-a5ff-035c9950d206",
    url: "https://www.facebook.com/profile.php?id=100063787951166",
    icon: FaFacebookF,
    css: 'bg-blue-500! text-blue-50! hover:bg-blue-600!',
    active: true,
  },
  {
    id: "ae51ceea-c1a1-4fc4-a384-eb026854966f",
    url: "#",
    icon: FaXTwitter,
    css: 'bg-gray-700! text-gray-50! hover:bg-gray-800!',
    active: false,
  },
  {
    id: "7226e825-e6bd-414d-8205-7f2e9bda9412",
    url: "#",
    icon: FaInstagram,
    css: 'bg-pink-600! text-pink-50! hover:bg-pink-700!',
    active: false,
  },
  {
    id: "b50c7689-6677-471b-9e7a-460ca3a1b913",
    url: "#",
    icon: FaTiktok,
    css: 'bg-gray-700! text-gray-50! hover:bg-gray-800!',
    active: false,
  },
  {
    id: "cf1dbfbc-1db1-4b27-9ffd-5f6b44f3334f",
    url: "#",
    icon: FaYoutube,
    css: 'bg-red-600! text-red-50! hover:bg-red-700!',
    active: false,
  },
];
