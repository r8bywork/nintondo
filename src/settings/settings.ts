import ChromeIcon from '../assets/ChromeIcon.svg?react';
import FirefoxIcon from '../assets/firefox2019.svg?react';
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
  {
    text: 'Chrome extension',
    svg: ChromeIcon,
    url: 'https://github.com/Nintondo/extension/releases/download/0.1.1/chrome-0.1.1.zip',
  },
  {
    text: 'Firefox extension',
    svg: FirefoxIcon,
    url: 'https://github.com/Nintondo/extension/releases/download/0.1.1/firefox-0.1.1.xpi',
  },
];

export const linksData = [
  {
    type: 'CEX',
    links: [
      {
        link: 'https://nonkyc.io/market/BEL_USDT',
        name: 'Nonkyc',
      },
      {
        link: 'https://xeggex.com/market/BEL_USDT',
        name: 'Xeggex',
      },
    ],
  },
  {
    type: 'DEX',
    links: [
      {
        link: 'https://opensea.io/collection/bells-curated',
        name: 'OpenSea',
      },
      {
        link: 'https://looksrare.org/collections/0x19b094c17F29a16F80bE04cdc0C3e274474C7724',
        name: 'LooksRare',
      },
    ],
  },
];

export const HeaderLinks = [
  { name: 'wallet', url: '#wallet' },
  { name: 'markets', url: '#markets' },
  { name: 'explorer', url: 'https://bells.quark.blue/' },
];
