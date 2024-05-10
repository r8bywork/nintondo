import cn from 'classnames';
import React from 'react';

interface CardTag {
  SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text?: string;
  active?: boolean;
  classNames?: string;
  onSvgClick?: () => void;
}
const CardTag = ({ SvgIcon, text, active, classNames, onSvgClick }: CardTag) => {
  return (
    <div
      className={cn(
        'rounded-[5px] border-[1px] flex items-center px-[5px] mr-[8px] leading-[14px]',
        {
          'border-[#FFBB00]': active,
          'border-[#4B4B4B]': !active,
          'text-[#FFBB00]': active,
          'text-[#4B4B4B]': !active,
        },
        classNames,
      )}
    >
      {SvgIcon && (
        <div onClick={onSvgClick}>
          <SvgIcon
            className={cn({
              ['mr-[3px]']: text,
              ['mr-0']: !text,
            })}
          />
        </div>
      )}
      <span>{text}</span>
    </div>
  );
};
export default CardTag;
