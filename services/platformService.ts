
import { Platform } from '../types';

export interface PlatformConfigItem {
  label: string;
  color: string;
  iconStr: string;
  description: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfigItem> = {
  [Platform.Twitter]: { label: 'Twitter (X)', color: 'bg-black text-white', iconStr: 'X', description: 'Microblogging & News' },
  [Platform.Discord]: { label: 'Discord', color: 'bg-indigo-500 text-white', iconStr: 'Ds', description: 'Community Chat' },
  [Platform.Slack]: { label: 'Slack', color: 'bg-amber-500 text-white', iconStr: 'Sl', description: 'Team Communication' },
  [Platform.Facebook]: { label: 'Facebook', color: 'bg-blue-600 text-white', iconStr: 'Fb', description: 'Social Networking' },
  [Platform.LinkedIn]: { label: 'LinkedIn', color: 'bg-blue-700 text-white', iconStr: 'in', description: 'Professional Network' },
  [Platform.Instagram]: { label: 'Instagram', color: 'bg-pink-600 text-white', iconStr: 'Ig', description: 'Photo & Video' },
  [Platform.TikTok]: { label: 'TikTok', color: 'bg-black text-white', iconStr: 'Tk', description: 'Short Video' },
  [Platform.YouTube]: { label: 'YouTube', color: 'bg-red-600 text-white', iconStr: 'Yt', description: 'Video Sharing' },
  [Platform.Pinterest]: { label: 'Pinterest', color: 'bg-red-500 text-white', iconStr: 'Pn', description: 'Visual Discovery' },
  [Platform.GoogleBusiness]: { label: 'Google Business', color: 'bg-blue-500 text-white', iconStr: 'G', description: 'Business Profile' },
  [Platform.WhatsApp]: { label: 'WhatsApp', color: 'bg-green-500 text-white', iconStr: 'Wa', description: 'Messaging' },
  [Platform.Telegram]: { label: 'Telegram', color: 'bg-sky-500 text-white', iconStr: 'Tg', description: 'Messaging' },
  [Platform.Mastodon]: { label: 'Mastodon', color: 'bg-purple-600 text-white', iconStr: 'Ma', description: 'Decentralized Social' },
  [Platform.WordPress]: { label: 'WordPress', color: 'bg-gray-700 text-white', iconStr: 'Wp', description: 'Content Management' },
  [Platform.Snapchat]: { label: 'Snapchat', color: 'bg-yellow-400 text-black', iconStr: 'Sc', description: 'Multimedia Messaging' }
};

// Default enabled platforms
let enabledPlatforms: Platform[] = [
  Platform.Twitter,
  Platform.Discord,
  Platform.LinkedIn,
  Platform.Facebook
];

export const getEnabledPlatforms = (): Platform[] => {
  return [...enabledPlatforms];
};

export const getAllPlatforms = (): Platform[] => Object.values(Platform);

export const setPlatformStatus = (platform: Platform, enabled: boolean) => {
  if (enabled) {
    if (!enabledPlatforms.includes(platform)) {
      enabledPlatforms.push(platform);
    }
  } else {
    enabledPlatforms = enabledPlatforms.filter(p => p !== platform);
  }
  // Dispatch a custom event to notify components of the change
  window.dispatchEvent(new Event('platforms-changed'));
};