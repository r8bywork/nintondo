import CardTag from './CardTag/CardTag.tsx';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cn from 'classnames';
import ContentComponent from './ContentComponent.tsx';
import { convertTimestampToFormattedDate, formattedStringFromTimestamp } from '@/utils/index.ts';

interface CardProps {
  onClick?: () => void;
  image: string;
  text?: number;
  date?: number;
  owner?: string;
  tags?: {
    SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    tagText?: string;
    active?: boolean;
  }[];
  BigCard?: boolean;
  contentType: string;
  blurImage?: boolean;
  onLoadHandler: () => void;
}

const Card = ({
  onClick,
  text,
  date,
  tags,
  BigCard,
  image,
  contentType,
  owner,
  onLoadHandler,
  blurImage,
}: CardProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mobileWidthThreshold = 768;
  const imageSize = BigCard ? (windowWidth < mobileWidthThreshold ? '350px' : '480px') : '180px';

  return (
    <div
      className={`flex flex-col max-w-[${
        BigCard ? '500px' : '200px'
      }] bg-[#1A1A1A] rounded-[15px] p-[10px]`}
      onClick={onClick}
    >
      <ContentComponent
        contentType={contentType}
        imageSize={imageSize}
        image={image}
        onLoadHandler={onLoadHandler}
        blurImage={blurImage}
      />
      <div
        className={cn('flex justify-between items-center mb-[16px]', {
          ['mb-[20px]']: BigCard,
        })}
      >
        <span
          className={cn('font-bold text-white leading-[16px] text-[16px]', {
            ['text-[25px] leading-[32px]']: BigCard,
          })}
        >
          {text?.toLocaleString()}
        </span>
        <span
          className={cn('font-normal text-[#4B4B4B] text-[14px]', {
            ['text-[20px]']: BigCard,
          })}
        >
          {(owner && '') ||
            (BigCard
              ? convertTimestampToFormattedDate(date ?? 0)
              : formattedStringFromTimestamp(date ?? 0))}
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
