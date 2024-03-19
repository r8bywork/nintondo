import ChromeIcon from '../assets/ChromeIcon.svg?react';
import FirefoxIcon from '../assets/firefox2019.svg?react';
import CommentSvg from '../assets/card/comments.svg?react';
import TrendingSvg from '../assets/card/rating.svg?react';
import FullSizeSvg from '../assets/card/fullsize.svg?react';
import ShareSvg from '../assets/card/share.svg?react';
import { CSSProperties } from 'react';
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

export interface Header {
  name: string;
  url: string;
}

export const HeaderLinks: Header[] = [
  { name: 'wallet', url: '/wallet' },
  { name: 'markets', url: '/markets' },
  { name: 'explorer', url: '/explorer' },
  { name: 'marketplace', url: '/marketplace' },
];

export const HeaderLinksMarketPlace: Header[] = [
  { name: 'inscriptions', url: '/marketplace' },
  { name: 'collections', url: '/collections' },
];

export const cardConfig = [
  {
    text: '447,320',
    date: '359 days ago',
    tags: [
      { tagText: 'WEBP', active: true },
      { tagText: '3.2K', SvgIcon: TrendingSvg },
      { tagText: '87.2K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '1,234',
    date: '30 days ago',
    tags: [
      { tagText: 'PNG', active: true },
      { tagText: '4.5K', SvgIcon: TrendingSvg },
      { tagText: '345', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '550,892',
    date: '180 days ago',
    tags: [
      { tagText: 'JPEG', active: true },
      { tagText: '7.8K', SvgIcon: TrendingSvg },
      { tagText: '12.7K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '987,654',
    date: '90 days ago',
    tags: [
      { tagText: 'SVG', active: true },
      { tagText: '9.3K', SvgIcon: TrendingSvg },
      { tagText: '876', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '333',
    date: '5 days ago',
    tags: [
      { tagText: 'GIF', active: true },
      { tagText: '2.1K', SvgIcon: TrendingSvg },
      { tagText: '59', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '76,543',
    date: '210 days ago',
    tags: [
      { tagText: 'TIFF', active: true },
      { tagText: '1.5K', SvgIcon: TrendingSvg },
      { tagText: '3.4K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '987',
    date: '15 days ago',
    tags: [
      { tagText: 'BMP', active: true },
      { tagText: '4.2K', SvgIcon: TrendingSvg },
      { tagText: '231', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '112,233',
    date: '120 days ago',
    tags: [
      { tagText: 'PSD', active: true },
      { tagText: '6.7K', SvgIcon: TrendingSvg },
      { tagText: '1.2K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '1,000,000',
    date: '250 days ago',
    tags: [
      { tagText: 'EPS', active: true },
      { tagText: '11.2K', SvgIcon: TrendingSvg },
      { tagText: '17.9K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '999',
    date: '60 days ago',
    tags: [
      { tagText: 'ICO', active: true },
      { tagText: '3.9K', SvgIcon: TrendingSvg },
      { tagText: '456', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '24,000',
    date: '300 days ago',
    tags: [
      { tagText: 'JPG', active: true },
      { tagText: '8.4K', SvgIcon: TrendingSvg },
      { tagText: '9.1K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '678',
    date: '45 days ago',
    tags: [
      { tagText: 'ICO', active: true },
      { tagText: '2.8K', SvgIcon: TrendingSvg },
      { tagText: '123', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '876,543',
    date: '150 days ago',
    tags: [
      { tagText: 'GIF', active: true },
      { tagText: '5.6K', SvgIcon: TrendingSvg },
      { tagText: '7.8K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '123,456',
    date: '75 days ago',
    tags: [
      { tagText: 'PNG', active: true },
      { tagText: '3.4K', SvgIcon: TrendingSvg },
      { tagText: '2.3K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '5,432',
    date: '25 days ago',
    tags: [
      { tagText: 'JPEG', active: true },
      { tagText: '1.2K', SvgIcon: TrendingSvg },
      { tagText: '87', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '987,654',
    date: '180 days ago',
    tags: [
      { tagText: 'BMP', active: true },
      { tagText: '8.9K', SvgIcon: TrendingSvg },
      { tagText: '19.3K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '999,999',
    date: '200 days ago',
    tags: [
      { tagText: 'TIFF', active: true },
      { tagText: '10.1K', SvgIcon: TrendingSvg },
      { tagText: '5.6K', SvgIcon: CommentSvg },
    ],
  },
  {
    text: '765,432',
    date: '140 days ago',
    tags: [
      { tagText: 'SVG', active: true },
      { tagText: '6.7K', SvgIcon: TrendingSvg },
      { tagText: '13.4K', SvgIcon: CommentSvg },
    ],
  },
];

export interface FilterConfig {
  activeColor: string;
  styles?: CSSProperties;
  filters: {
    text: string;
    isActive: boolean;
  }[];
}

export const filterConfig: FilterConfig = {
  activeColor: '#FFFFFF',
  styles: { boxShadow: '0 0 12px 0 rgba(255, 255, 255, 0.5)' },
  filters: [
    { text: 'Trending', isActive: false },
    { text: 'Newest', isActive: false },
    { text: 'Oldest', isActive: false },
    { text: 'Top', isActive: false },
    { text: 'Most Replies', isActive: false },
    { text: 'Oldest Sat', isActive: false },
    { text: 'Largest File', isActive: false },
    { text: 'Highest Fee', isActive: false },
  ],
};

export const filterTypeConfig: FilterConfig = {
  activeColor: '#FFBB00',
  styles: { boxShadow: '0 0 12px 0 rgba(255, 187, 0, 0.5)' },
  filters: [
    { text: 'Images', isActive: false },
    { text: 'GIFs', isActive: false },
    { text: 'Videos', isActive: false },
    { text: 'Audio', isActive: false },
    { text: 'SVGs', isActive: false },
    { text: 'Text', isActive: false },
    { text: 'HTML', isActive: false },
    { text: 'JavaScript', isActive: false },
    { text: 'Markdown', isActive: false },
    { text: 'Parents', isActive: false },
    { text: 'Games', isActive: false },
    { text: '3D', isActive: false },
  ],
};

export const filterTimeConfig: FilterConfig = {
  activeColor: '#B75BFF',
  styles: { boxShadow: '0 0 12px 0 rgba(183, 91, 255, 0.5)' },
  filters: [
    { text: '1 Hour', isActive: false },
    { text: '1 Day', isActive: false },
    { text: '1 Week', isActive: false },
    { text: '1 Month', isActive: false },
  ],
};

export const inscriptionInfo = [
  {
    id: 'e1636c83d2b337db7870939f01b5be484a08345c15ece7a1922c4f4e1a33480d',
    ownedBy: 'f9389e3b91abb3537b0827119ff68634d499dcadf2ab81113ac1d9d25136c6dc',
    fileType: 'WEBP',
    fileSize: '12.848 KB',
    created: 'March 5, 2024, 5:59 AM GMT+3',
    creationBlock: 833186,
    creationTransaction: 'e1636c83d2b337db7870939f01b5be484a08345c15ece7a1922c4f4e1a33480d',
    creationFeeSats: 269200,
    tags: '269,200 sats',
  },
];

export const inscriptionCard = [
  {
    text: '447,320',
    date: '359 days ago',
    tags: [
      { tagText: 'WEBP', active: true },
      { tagText: '3.2K', SvgIcon: TrendingSvg },
      { tagText: '87.2K', SvgIcon: CommentSvg },
      { SvgIcon: ShareSvg },
      { SvgIcon: FullSizeSvg },
    ],
  },
];
