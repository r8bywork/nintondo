import CollectionHeader from '../components/CollectionComponents/CollectionHeader.tsx';
import Image from '../assets/collection/Ape.png';
import TwitterLogo from '../assets/social/twitter.svg?react';
import DiscordLogo from '../assets/social/discord.svg?react';
import ExplorerLogo from '../assets/social/explorer.svg?react';
import ShareLogo from '../assets/social/share2.svg?react';
import { cardConfig } from '../settings/settings.ts';
import Card from '../components/Card/Card.tsx';

const links = {
  image: Image,
  name: 'Bitcoin Apes',
  createdAt: 'February 2023',
  currency: 'BTC',
  details: [
    {
      title: 'supply',
      value: 10000,
    },
    {
      title: 'file size',
      value: 1.464,
      additionalSymbol: 'GB',
    },
    {
      title: 'creation fee',
      value: 32.208,
      additionalSymbol: 'BTC',
    },
    {
      title: 'range',
      value: [8962, 568263],
    },
  ],
  link: [
    {
      SvgIcon: TwitterLogo,
      link: 'https://twitter.com',
      text: 'Twitter',
      active: false,
    },
    {
      SvgIcon: DiscordLogo,
      link: 'https://discord.com',
      text: 'Discord',
      active: false,
    },
    {
      SvgIcon: ExplorerLogo,
      link: 'https://bitcoin.com',
      text: 'Explorer',
      active: false,
    },
    {
      SvgIcon: ShareLogo,
      link: 'https://apes.com',
      text: 'Apes',
      active: true,
    },
  ],
};

const CollectionPage = () => {
  return (
    <div className={'pt-[150px] max-lg:pt-[100px] bg-black min-h-screen text-white'}>
      <div className={'max-w-[1670px] w-full mx-auto px-[0px]'}>
        <CollectionHeader data={links} />
        <div className='flex-grow overflow-y-auto mt-[45px]'>
          <span className={'text-[#4B4B4B] font-16px px-[15px]'}>
            Found <span className={'text-white'}>{Number(10000).toLocaleString()}</span>{' '}
            inscriptions
          </span>
          <div className='mx-auto flex flex-wrap pt-[10px] gap-[10px]'>
            {cardConfig.map((card, index) => (
              <Card
                key={index}
                {...card}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CollectionPage;
