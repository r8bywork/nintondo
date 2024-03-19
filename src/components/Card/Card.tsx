import Image from '../../assets/card/Image.png';
import BigImage from '../../assets/card/BigImage.jpg';
import CardTag from './CardTag/CardTag.tsx';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
interface CardProps {
  text?: string;
  date?: string;
  tags?: {
    SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    tagText?: string;
    active?: boolean;
  }[];
  BigCard?: boolean;
}
const Card = ({ text, date, tags, BigCard }: CardProps) => {
  const imageSize = BigCard ? '500px' : '200px';
  return (
    <div
      className={`flex flex-col max-w-[${
        BigCard ? '500px' : '200px'
      }] bg-[#1A1A1A] rounded-[15px] p-[15px]`}
    >
      <div className={'mb-[18px]'}>
        <img
          src={BigCard ? BigImage : Image}
          className={'rounded-[15px]'}
          alt={'img'}
          style={{ width: imageSize }}
        />
      </div>
      <div
        className={classNames('flex justify-between', {
          ['mb-[20px]']: BigCard,
          ['mb-[16px]']: !BigCard,
        })}
      >
        <span
          className={classNames('font-bold text-white leading-[16px]', {
            ['text-[32px]']: BigCard,
            ['leading-[32px]']: BigCard,
            ['text-[16px]']: !BigCard,
          })}
        >
          {text}
        </span>
        <span
          className={classNames('font-normal text-[#4B4B4B] text-[14px]', {
            ['text-[20px]']: BigCard,
            ['text-[14px]']: !BigCard,
          })}
        >
          {date}
        </span>
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
                  classNames={BigCard ? 'text-[20px] leading-[23px]' : ''}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
export default Card;
