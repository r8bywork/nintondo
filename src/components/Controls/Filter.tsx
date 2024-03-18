import FilterTag from './components/FilterTag.tsx';
import { FC, useEffect, useState } from 'react';
import { FilterConfig } from '../../settings/settings.ts';
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
    config.filters.map((elem) => elem.text),
    containParams,
  );

  const handleSelectAll = () => {
    const updatedFilters = filters.map((filter) => ({ ...filter, isActive: !selectAllBtn }));
    setFilters(updatedFilters);
    setSelectAllBtn(!selectAllBtn);
  };

  const handleFilterClick = (filter: FilterConfig['filters'][0]) => {
    const updatedFilters = filters.map((f) =>
      singleSelect
        ? { ...f, isActive: f === filter }
        : f === filter
          ? { ...f, isActive: !f.isActive }
          : f,
    );
    setFilters(updatedFilters);
  };

  useEffect(() => {
    const allFiltersActive = filters.every((filter) => filter.isActive);
    setSelectAllBtn(allFiltersActive);
  }, [filters]);

  const renderRows = () => {
    let filterIndex = 0;

    return itemsPerRow.map((itemsCount, rowIndex) => (
      <div
        key={rowIndex}
        className={
          'my-[10px] w-fit px-[10px] py-[7px] border-[2px] flex flex-wrap border-[#191919] rounded-[18px]'
        }
      >
        {Array(itemsCount)
          .fill(null)
          .map((_) => {
            const filter = filterIndex < filters.length ? filters[filterIndex++] : null;
            return (
              filter && (
                <FilterTag
                  key={filter.text}
                  activeColor={config.activeColor}
                  active={filter.isActive}
                  text={filter.text}
                  onClick={() => handleFilterClick(filter)}
                  styles={config.styles}
                  classNames={'last:mr-[0px] mr-[12px]'}
                />
              )
            );
          })}
      </div>
    ));
  };

  return (
    <div ref={containerRef}>
      {selectAll && (
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
      )}
      {renderRows()}
    </div>
  );
};

export default Filter;
