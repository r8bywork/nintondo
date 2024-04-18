import classNames from 'classnames';
import { FC } from 'react';
import FilterTag from './FilterTag';
import { SvgProps } from '../Filter';

interface SelectAllProps {
  text: string;
  SvgIcon?: FC<SvgProps>;
  className?: string;
  color: string;
  active: boolean;
  onClick?: () => void;
  rotate?: boolean;
  tagClassName?: string;
}

export const SelectAll = ({
  SvgIcon,
  text,
  color,
  active,
  onClick,
  className,
  rotate,
  tagClassName,
}: SelectAllProps) => {
  return (
    <>
      {SvgIcon && (
        <SvgIcon
          className={classNames(
            'mr-[10px]',
            {
              ['rotate-45']: rotate,
            },
            className,
          )}
          activecolor={active ? color : ''}
        />
      )}
      <FilterTag
        text={text}
        activeColor={color}
        active={active}
        onClick={onClick}
        classNames={classNames(className, tagClassName)}
      />
    </>
  );
};
