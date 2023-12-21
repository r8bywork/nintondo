import NewWalletIcon from '../assets/newwallet.svg?react';
import Market from '../assets/market.svg?react';
import Explorer from '../assets/explorer.svg?react';
export const footerContent = [
  {
    title: 'LEARN',
    items: [
      { text: 'Docs', href: '#' },
      { text: 'Tutorials', href: '#' },
      { text: 'FAQs', href: '#' },
      { text: 'Case Studies', href: '#' },
    ],
  },
  {
    title: 'CONNECT',
    items: [
      { text: 'Contact Us', href: '#' },
      { text: 'Support Forum', href: '#' },
      { text: 'Social Media', href: '#' },
      { text: 'Blog', href: '#' },
    ],
  },
  {
    title: 'ABOUT',
    items: [
      { text: 'Our Story', href: '#' },
      { text: 'Team', href: '#' },
      { text: 'Careers', href: '#' },
      { text: 'Partners', href: '#' },
    ],
  },
  {
    title: 'RESOURCES',
    items: [
      { text: 'Download Center', href: '#' },
      { text: 'API Documentation', href: '#' },
      { text: 'Community Resources', href: '#' },
      { text: 'Terms & Conditions', href: '#' },
    ],
  },
];

export const buttons = [
  { text: 'Wallet', svg: NewWalletIcon, url: 'https://github.com/Nintondo/extension/releases/' },
  { text: 'Markets', svg: Market, url: '/market' },
  { text: 'Explorer', svg: Explorer, url: '/explorer' },
];
