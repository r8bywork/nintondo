import CardTag from './CardTag/CardTag.tsx';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import { AsyncImage } from 'loadable-image';
interface CardProps {
  onClick?: () => void;
  image: string | undefined;
  text?: number;
  date?: string;
  tags?: {
    SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    tagText?: string;
    active?: boolean;
  }[];
  BigCard?: boolean;
}

const formattedString = (startDate: Date, endDate: Date) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInTime = Math.abs(endDate.getTime() - startDate.getTime());
  const differenceInDays = Math.floor(differenceInTime / millisecondsPerDay);

  return differenceInDays === 1 ? '1 day ago' : `${differenceInDays} days ago`;
};

const Card = ({ onClick, text, date, tags, BigCard, image }: CardProps) => {
  const today = new Date();
  const specifiedDate = new Date(date ? date : '');
  const imageSize = BigCard ? '480px' : '180px';

  return (
    <div
      className={`flex flex-col max-w-[${
        BigCard ? '500px' : '200px'
      }] bg-[#1A1A1A] rounded-[15px] p-[10px]`}
      onClick={onClick}
    >
      <div style={{ imageRendering: 'pixelated' }}>
        <AsyncImage
          src={`http://0.0.0.0:8111/pub/preview/${image}`}
          style={{ width: imageSize, height: imageSize }}
          loader={<div className={''}></div>}
          className={'rounded-[10px] mb-[18px]'}
        />
      </div>
      <div
        className={classNames('flex justify-between items-center mb-[16px]', {
          ['mb-[20px]']: BigCard,
        })}
      >
        <span
          className={classNames('font-bold text-white leading-[16px] text-[16px]', {
            ['text-[32px] leading-[32px]']: BigCard,
          })}
        >
          {text?.toLocaleString()}
        </span>
        <span
          className={classNames('font-normal text-[#4B4B4B] text-[14px]', {
            ['text-[20px]']: BigCard,
          })}
        >
          {formattedString(specifiedDate, today)}
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
                  classNames={BigCard ? 'text-[20px] leading-[23px]' : 'text-[14px] leading-[14px]'}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
export default Card;
