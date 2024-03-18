import cn from 'classnames';
import React from 'react';

interface CardTag {
  SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text?: string;
  active?: boolean;
  classNames?: string;
}
const CardTag = ({ SvgIcon, text, active, classNames }: CardTag) => {
  return (
    <div
      className={cn(classNames, 'rounded-[5px] border-[1px] flex items-center px-[5px] mr-[8px]', {
        'border-[#FFBB00]': active,
        'border-[#4B4B4B]': !active,
        'text-[#FFBB00]': active,
        'text-[#4B4B4B]': !active,
      })}
    >
      {SvgIcon && <SvgIcon className={'mr-[3px]'} />}
      <span>{text}</span>
    </div>
  );
};
export default CardTag;
