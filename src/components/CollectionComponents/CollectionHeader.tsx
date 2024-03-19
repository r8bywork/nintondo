import React from 'react';
import CollectionFace from './CollectionFace.tsx';
import CollectionDetails from './CollectionDetails.tsx';
import { v4 } from 'uuid';

interface CollectionHeaderProps {
  data: {
    image: string;
    name: string;
    createdAt: string;
    currency: string;
    details: {
      title: string;
      value: number | number[];
      additionalSymbol?: string;
    }[];
    link: {
      SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      link: string;
      text: string;
      active: boolean;
    }[];
  };
}
const CollectionHeader = ({ data }: CollectionHeaderProps) => {
  return (
    <div className={'flex items-center w-full gap-[58px] max-xl:flex-col'}>
      <CollectionFace
        image={data.image}
        name={data.name}
        createdAt={data.createdAt}
        link={data.link}
        classNames={'min-w-[408px]'}
      />
      <div className='max-xl:hidden h-[168px] w-[1px] border-l border-[#4B4B4B]'></div>
      <div className={'flex flex-col w-full gap-[4px]'}>
        {data.details.map((elem) => (
          <CollectionDetails
            key={v4()}
            title={elem.title.toUpperCase()}
            value={elem.value}
            additionalSymbol={elem.additionalSymbol}
          />
        ))}
      </div>
      <div className='max-xl:hidden h-[168px] w-[1px] border-l border-[#4B4B4B]'></div>
      <span className={'text-[#4B4B4B] text-[20px] leading-[20px] text-justify w-full'}>
        Bitcoin Apes are byte-perfect inscriptions of the Ethereum-based apes to the Bitcoin
        blockchain using Ordinals. They are fully on-chain, Bitcoin native, and completely
        decentralized digital artifacts. Bitcoin Apes is not affiliated or associated with Yuga
        Labs.
      </span>
    </div>
  );
};
export default CollectionHeader;
