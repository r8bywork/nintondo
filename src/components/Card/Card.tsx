import CardTag from './CardTag/CardTag.tsx';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import ContentComponent from './ContentComponent.tsx';
import { formattedStringFromTimestamp } from '../../utils';

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
}

const Card = ({ onClick, text, date, tags, BigCard, image, contentType, owner }: CardProps) => {
  const imageSize = BigCard ? '480px' : '180px';

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
      />
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
          {owner ? owner : formattedStringFromTimestamp(date || Math.floor(Date.now() / 1000))}
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
