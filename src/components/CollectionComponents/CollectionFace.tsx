import React from 'react';
import CardTag from '../Card/CardTag/CardTag.tsx';
import { v4 } from 'uuid';
import cn from 'classnames';

interface CollectionFaceProps {
  classNames: string;
  image: string;
  name: string;
  createdAt: string;
  link: {
    SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    link: string;
    text: string;
    active: boolean;
  }[];
}
const CollectionFace = ({ image, name, createdAt, link, classNames }: CollectionFaceProps) => {
  return (
    <div className={cn('flex', classNames)}>
      <img
        src={image}
        alt='image'
        className={'mr-[50px]'}
      />
      <div className={'flex flex-col justify-center gap-[10px]'}>
        <span className={'text-[32px] font-bold leading-[32px]'}>{name}</span>
        <span className={'text-[#4B4B4B] leading-[16px] text-[16px]'}>
          Created <span className={'text-white'}>{createdAt}</span>
        </span>
        <div className={'flex'}>
          {link.map((elem) => {
            return (
              <CardTag
                key={v4()}
                SvgIcon={elem.SvgIcon}
                active={elem.active}
                classNames={'p-[3px]'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CollectionFace;
