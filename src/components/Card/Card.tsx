import Image from '../../assets/card/Image.png';
import CardTag from '../CardTag/CardTag.tsx';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
interface CardProps {
  text?: string;
  date?: string;
  tags?: {
    SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    tagText?: string;
    active?: boolean;
  }[];
}
const Card = ({ text, date, tags }: CardProps) => {
  return (
    <div className={'flex flex-col w-[200px] bg-[#1A1A1A] rounded-[15px] p-[10px]'}>
      <div className={'mb-[16px]'}>
        <img
          src={Image}
          alt={'img'}
        />
      </div>
      <div className={'flex justify-between mb-[16px]'}>
        <div className={'font-bold text-white text-[16px] leading-[16px]'}>{text}</div>
        <div className={'font-normal text-[#4B4B4B] text-[14px]'}>{date}</div>
      </div>
      <div className={'flex'}>
        {tags
          ? tags.map((elem) => {
              return (
                <CardTag
                  key={uuidv4()}
                  text={elem.tagText}
                  active={elem.active}
                  SvgIcon={elem.SvgIcon}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
export default Card;
