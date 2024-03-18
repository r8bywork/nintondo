import FilterTag from '../FIlterTag/FilterTag.tsx';
import { FC, useEffect, useState } from 'react';
import { filterConfig, FilterConfig } from '../../settings/settings.ts';
import useItemsPerRow from '../../hooks/useItemsPerRow.ts';

interface SvgProps {
  activecolor: string;
  className: string;
}

interface HiddenElementStyles {
  [key: string]: string;
}

interface FilterProps {
  config: FilterConfig;
  singleSelect?: boolean;
  selectAll?: {
    text: string;
  };
  SvgIcon?: FC<SvgProps>;
  containParams?: HiddenElementStyles;
}

const Filter = ({ config, singleSelect, selectAll, SvgIcon, containParams }: FilterProps) => {
  const [filters, setFilters] = useState<FilterConfig['filters']>(config.filters);
  const [selectAllBtn, setSelectAllBtn] = useState<boolean>(false);
  const { containerRef, itemsPerRow } = useItemsPerRow(
    filterConfig.filters.map((elem) => elem.text),
    containParams,
  );
  const handleSelectAll = () => {
    const updatedFilters = filters.map((filter) => ({
      ...filter,
      isActive: !selectAllBtn,
    }));
    setFilters(updatedFilters);
    setSelectAllBtn(!selectAllBtn);
  };

  const handleFilterClick = (index: number) => {
    const updatedFilters = filters.map((filter, i) => {
      if (singleSelect) {
        if (i === index) {
          return { ...filter, isActive: true };
        } else {
          return { ...filter, isActive: false };
        }
      } else {
        if (i === index) {
          return { ...filter, isActive: !filter.isActive };
        }
        return filter;
      }
    });
    setFilters(updatedFilters);
  };

  useEffect(() => {
    const allFiltersActive = filters.every((filter) => filter.isActive);
    setSelectAllBtn(allFiltersActive);
  }, [filters]);

  const rows = [];
  for (let i = 0; i < filters.length; i += itemsPerRow) {
    const rowFilters = filters.slice(i, i + itemsPerRow);
    rows.push(
      <div
        key={i}
        className={
          'my-[10px] w-fit px-[10px] py-[7px] border-[2px] flex flex-wrap border-[#191919] rounded-[18px]'
        }
      >
        {rowFilters.map((filter, index) => (
          <FilterTag
            key={index}
            activeColor={config.activeColor}
            active={filter.isActive}
            text={filter.text}
            onClick={() => handleFilterClick(i + index)}
            styles={config.styles}
            classNames={'mr-[12px] last:mr-[0px]'}
          />
        ))}
      </div>,
    );
  }

  return (
    <div ref={containerRef}>
      {selectAll ? (
        <div
          className={
            'my-[10px] w-fit items-center px-[10px] py-[7px] border-[2px] flex flex-wrap border-[#191919] rounded-[18px]'
          }
        >
          {SvgIcon && (
            <SvgIcon
              className={'mr-[10px]'}
              activecolor={selectAllBtn ? config.activeColor : ''}
            />
          )}
          <FilterTag
            text={selectAll.text}
            activeColor={config.activeColor}
            active={selectAllBtn}
            onClick={handleSelectAll}
          />
        </div>
      ) : null}
      {rows}
    </div>
  );
};

export default Filter;
