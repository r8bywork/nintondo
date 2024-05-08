import { ReactNode } from 'react';
import ArrowDown from '@/assets/marketplace/arrow-down.svg?react';
import classNames from 'classnames';

interface SelectProps {
  isActive: boolean;
  children: ReactNode;
  className?: string;
}

export const Select = ({ isActive, children, className }: SelectProps) => {
  return (
    <div
      className={classNames(
        'flex h-[40px] bg-[#FFBB00] cursor-pointer items-center px-[15px] rounded-[27px] text-[18px] gap-[10px] text-[#000] font-bold max-medium:w-full outline-none',
        className,
      )}
    >
      <ArrowDown className={classNames('transition duration-300', { 'rotate-180': isActive })} />
      {children}
    </div>
  );
};
