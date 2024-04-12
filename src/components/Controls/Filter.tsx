import FilterTag from './components/FilterTag.tsx';
import { FC, useState } from 'react';
import useItemsPerRow from '../../hooks/useItemsPerRow.ts';
import { FilterConfig } from '../../interfaces/intefaces.ts';

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
  onChange: (filter: string) => void;
  state: string;
}

const Filter = ({ config, selectAll, SvgIcon, containParams, onChange, state }: FilterProps) => {
  const [filters] = useState<FilterConfig['filters']>(config.filters);
  const { containerRef, itemsPerRow } = useItemsPerRow(
    config.filters.map((elem) => elem.text),
    containParams,
  );

  const handleSelectAll = () => {
    if (state === 'all') {
      onChange(filters[0].text.toLowerCase());
    } else {
      onChange('all');
    }
  };

  const handleFilterClick = (filterText: string) => {
    onChange(filterText);
  };

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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map((_) => {
            const filter = filterIndex < filters.length ? filters[filterIndex++] : null;
            return (
              filter && (
                <FilterTag
                  key={filter.text}
                  activeColor={config.activeColor}
                  active={state === filter.text.toLowerCase() || state === 'all'}
                  text={filter.text}
                  onClick={() => handleFilterClick(filter?.text)}
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
              activecolor={state === 'all' ? config.activeColor : ''}
            />
          )}
          <FilterTag
            text={selectAll.text}
            activeColor={config.activeColor}
            active={state === 'all'}
            onClick={handleSelectAll}
          />
        </div>
      )}
      {renderRows()}
    </div>
  );
};

export default Filter;
