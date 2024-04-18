import cn from 'classnames';
import { CSSProperties } from 'react';

interface FilterTagProps {
  text?: string;
  onClick?: () => void;
  onDeleteClick?: (filter: string) => void;
  activeColor: string;
  active: boolean;
  styles?: CSSProperties;
  classNames?: string;
  deletable?: boolean;
}
const FilterTag = ({
  text,
  activeColor,
  onDeleteClick,
  active,
  onClick,
  styles,
  classNames,
  deletable = false,
}: FilterTagProps) => {
  return (
    <div
      className={cn(
        `w-fit max-md:px-[6px] px-[10px] py-[2px] text-[16px] items-center flex font-bold bg-${activeColor} leading-[16px] rounded-[15px] cursor-pointer select-none transition-colors`,
        {
          ['bg-[#4B4B4B]']: !active,
        },
        classNames,
      )}
      style={active ? { ...styles, backgroundColor: activeColor } : {}}
      onClick={onClick}
    >
      {text}
      {deletable && text && (
        <svg
          onClick={() => (onDeleteClick ? onDeleteClick(text) : '')}
          xmlns='http://www.w3.org/2000/svg'
          className='h-4 w-4 ml-1 cursor-pointer'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      )}
    </div>
  );
};

export default FilterTag;
