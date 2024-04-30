import { ReactNode } from 'react';
import ArrowDown from '@/assets/marketplace/arrow-down.svg?react';
import classNames from 'classnames';

interface SelectProps {
  isActive: boolean;
  children: ReactNode;
}

export const Select = ({ isActive, children }: SelectProps) => {
  return (
    <button className='flex h-[33px] bg-[#FFBB00] items-center px-[15px] rounded-[27px] gap-[10px] text-[#000] font-bold max-medium:w-full'>
      <ArrowDown className={classNames('transition duration-300', { 'rotate-180': isActive })} />
      {children}
    </button>
  );
};
