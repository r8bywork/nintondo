import cn from 'classnames';
import { CSSProperties } from 'react';

interface FilterTagProps {
  text?: string;
  onClick?: () => void;
  activeColor: string;
  active: boolean;
  styles?: CSSProperties;
  classNames?: string;
}
const FilterTag = ({ text, activeColor, active, onClick, styles, classNames }: FilterTagProps) => {
  return (
    <div
      className={cn(
        `w-fit px-[10px] py-[2px] text-[16px] items-center flex font-bold bg-${activeColor} leading-[16px] rounded-[15px] cursor-pointer select-none transition-colors`,
        {
          ['bg-[#4B4B4B]']: !active,
        },
        classNames,
      )}
      style={active ? { ...styles, backgroundColor: activeColor } : {}}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default FilterTag;
