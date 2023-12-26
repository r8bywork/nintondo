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
  { text: 'Wallet', svg: NewWalletIcon, url: '#wallet' },
  { text: 'Markets', svg: Market, url: '#markets' },
  { text: 'Explorer', svg: Explorer, url: 'https://bells.quark.blue/' },
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
        link: 'https://belswap.org/',
        name: 'Belswap',
      },
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
  { name: 'POOL', url: '/' },
  { name: 'wallet', url: '#wallet' },
  { name: 'markets', url: '#markets' },
  { name: 'explorer', url: 'https://bells.quark.blue/' },
];
