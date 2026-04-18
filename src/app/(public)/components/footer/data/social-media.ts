import type { LucideIcon } from 'lucide-react';
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons/lib';
import type { CustomIconType } from '@/shared/types/icon';
import type { SOCIAL_PLATFORM } from '@/shared/enums/social-platform';

export type Social = {
  url: string;
  icon: IconType | LucideIcon | CustomIconType;
  platform: SOCIAL_PLATFORM;
  css: string;
};

export const socialMediaData: Social[] = [
  {
    platform: 'facebook',
    url: '#',
    icon: FaFacebookF,
    css: 'bg-blue-500! text-blue-50! hover:bg-blue-600!',
  },
  {
    platform: 'twitterX',
    url: '#',
    icon: FaXTwitter,
    css: 'bg-gray-700! text-gray-50! hover:bg-gray-800!',
  },
  {
    platform: 'instagram',
    url: '#',
    icon: FaInstagram,
    css: 'bg-pink-600! text-pink-50! hover:bg-pink-700!',
  },
  {
    platform: 'tikTok',
    url: '#',
    icon: FaTiktok,
    css: 'bg-gray-700! text-gray-50! hover:bg-gray-800!',
  },
  {
    platform: 'youtube',
    url: '#',
    icon: FaYoutube,
    css: 'bg-red-600! text-red-50! hover:bg-red-700!',
  },
];
