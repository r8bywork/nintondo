import { FC, useMemo } from 'react';
import FilterTag from './components/FilterTag';
import FilterRange from './components/FilterRange';
import FilterAccount from './components/FilterAccount';
import useItemsPerRow from '@/hooks/useItemsPerRow.ts';
import { FilterConfig, Filter } from '@/interfaces/intefaces.ts';
import classNames from 'classnames';

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
  state: string | string[];
}

const Filter: FC<FilterProps> = ({
  config,
  selectAll,
  SvgIcon,
  containParams,
  onChange,
  state,
}) => {
  const filters = useMemo(() => config.filters, [config.filters]);
  const { containerRef, itemsPerRow } = useItemsPerRow(
    filters.map((elem) => ('text' in elem ? elem.text : 'Range')),
    containParams,
  );
  const urlSearchParams = new URLSearchParams(window.location.search);
  // @ts-expect-error some shit
  const handleSelectAll = () => onChange(state === 'all' ? filters[0].text.toLowerCase() : 'all');

  const handleFilterClick = (filterText: string) => onChange(filterText);

  const renderFilter = (filter: Filter, index: number) =>
    filter.type === 'range' ? (
      <FilterRange
        key={`filter-range-${index}`}
        min={state[0]}
        max={state[1]}
        onRangeChange={handleFilterClick}
      />
    ) : filter.type === 'genesis' ? (
      <FilterTag
        key={`genesis-block-${index}`}
        text={
          urlSearchParams.get('genesisBlock')
            ? Number(urlSearchParams.get('genesisBlock')).toLocaleString()
            : 'failed'
        }
        activeColor={config.activeColor}
        active={true}
        deletable={true}
        styles={config.styles}
        onDeleteClick={handleFilterClick}
        classNames={'last:mr-[0px] mr-[12px]'}
      />
    ) : filter.type === 'account' ? (
      <FilterAccount
        key={`account`}
        text={filter.text}
        onClick={handleFilterClick}
        // key={filter.text}
        // text={filter.text}
        // activeColor={config.activeColor}
        // active={true}
        // deletable={true}
        // styles={config.styles}
        // onDeleteClick={handleFilterClick}
        // classNames={'last:mr-[0px] mr-[12px]'}
      />
    ) : (
      <FilterTag
        key={filter.text}
        activeColor={config.activeColor}
        active={state === filter.text.toLowerCase() || state === 'all'}
        text={filter.text}
        onClick={() => handleFilterClick(filter.text)}
        styles={config.styles}
        classNames={'last:mr-[0px] mr-[12px]'}
      />
    );

  const renderRows = () => {
    let filterIndex = 0;

    return itemsPerRow.map((itemsCount, rowIndex) => (
      <div
        key={rowIndex}
        className='my-[10px] w-fit px-[10px] py-[7px] border-[2px] flex flex-wrap border-[#191919] rounded-[18px]'
      >
        {Array.from({ length: itemsCount }, (_, index) => {
          const filter = filterIndex < filters.length ? filters[filterIndex++] : null;
          return filter && renderFilter(filter, index);
        })}
      </div>
    ));
  };

  return (
    <div ref={containerRef}>
      {selectAll && (
        <div className='my-[10px] w-fit items-center px-[10px] py-[7px] border-[2px] flex flex-wrap border-[#191919] rounded-[18px]'>
          {SvgIcon && (
            <SvgIcon
              className={classNames('mr-[10px]', {
                ['rotate-45']: config.filters[0].type === 'genesis',
              })}
              activecolor={
                state === 'all' ||
                config.filters[0].type === 'range' ||
                config.filters[0].type === 'genesis'
                  ? config.activeColor
                  : ''
              }
            />
          )}
          <FilterTag
            text={selectAll.text}
            activeColor={config.activeColor}
            active={
              state === 'all' ||
              config.filters[0].type === 'range' ||
              config.filters[0].type === 'genesis'
            }
            onClick={handleSelectAll}
          />
        </div>
      )}
      {renderRows()}
    </div>
  );
};

export default Filter;
