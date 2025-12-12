import React from 'react';
import { 
  FaFacebook, 
  FaLinkedin, 
  FaInstagram, 
  FaTiktok, 
  FaYoutube, 
  FaWhatsapp, 
  FaPinterest, 
  FaSnapchat, 
  FaDiscord, 
  FaSlack, 
  FaGoogle, 
  FaWordpress,
  FaGlobe,
  FaTelegram
} from 'react-icons/fa';
import { FaXTwitter, FaMastodon } from 'react-icons/fa6';
import { Platform } from '../types';

interface PlatformIconProps {
  platform: Platform | string;
  size?: number;
  className?: string;
  grayscale?: boolean;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 20, className = '', grayscale = false }) => {
  let IconComponent = FaGlobe;
  let colorClass = 'text-gray-500';
  let styleColor = undefined;

  switch (platform) {
    case Platform.Twitter:
    case 'Twitter':
      IconComponent = FaXTwitter;
      styleColor = '#000000';
      // In dark mode, X logo is usually white, but for "brand color" consistency we handle via parent or specific class
      if (document.documentElement.classList.contains('dark')) styleColor = '#FFFFFF';
      break;
    case Platform.Facebook:
    case 'Facebook':
      IconComponent = FaFacebook;
      styleColor = '#1877F2';
      break;
    case Platform.LinkedIn:
    case 'LinkedIn':
      IconComponent = FaLinkedin;
      styleColor = '#0077B5';
      break;
    case Platform.Instagram:
    case 'Instagram':
      IconComponent = FaInstagram;
      styleColor = '#E4405F';
      break;
    case Platform.TikTok:
    case 'TikTok':
      IconComponent = FaTiktok;
      styleColor = '#000000';
      if (document.documentElement.classList.contains('dark')) styleColor = '#FFFFFF';
      break;
    case Platform.YouTube:
    case 'YouTube':
      IconComponent = FaYoutube;
      styleColor = '#FF0000';
      break;
    case Platform.WhatsApp:
    case 'WhatsApp':
      IconComponent = FaWhatsapp;
      styleColor = '#25D366';
      break;
    case Platform.Pinterest:
    case 'Pinterest':
      IconComponent = FaPinterest;
      styleColor = '#BD081C';
      break;
    case Platform.Snapchat:
    case 'Snapchat':
      IconComponent = FaSnapchat;
      styleColor = '#FFFC00'; // Usually needs a background
      break;
    case Platform.Discord:
    case 'Discord':
      IconComponent = FaDiscord;
      styleColor = '#5865F2';
      break;
    case Platform.Slack:
    case 'Slack':
      IconComponent = FaSlack;
      styleColor = '#4A154B';
      break;
    case Platform.GoogleBusiness:
    case 'Google Business':
      IconComponent = FaGoogle;
      styleColor = '#4285F4';
      break;
    case Platform.Telegram:
    case 'Telegram':
      IconComponent = FaTelegram;
      styleColor = '#0088cc';
      break;
    case Platform.Mastodon:
    case 'Mastodon':
      IconComponent = FaMastodon;
      styleColor = '#6364FF';
      break;
    case Platform.WordPress:
    case 'WordPress':
      IconComponent = FaWordpress;
      styleColor = '#21759B';
      break;
    default:
      IconComponent = FaGlobe;
      colorClass = 'text-gray-400';
      break;
  }

  return (
    <div className={`flex items-center justify-center ${className}`} title={platform.toString()}>
      <IconComponent 
        size={size} 
        style={!grayscale && styleColor ? { color: styleColor } : undefined}
        className={grayscale ? 'text-gray-400' : ''}
      />
    </div>
  );
};