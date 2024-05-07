import { FC, useMemo } from 'react';
import FilterTag from './components/FilterTag';
import FilterRange from './components/FilterRange';
import useItemsPerRow from '@/hooks/useItemsPerRow.ts';
import { FilterConfig, IFilter } from '@/interfaces/intefaces.ts';
import classNames from 'classnames';
import { Modal } from '../Modal';
import { useModal } from '@/hooks/useModal';
import { SelectAll } from './components/SelectAll';

export interface SvgProps {
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
  className?: string;
  mobileHorizontally?: boolean;
  // Keep modal heading button is active state
  mobileAlwaysActive?: boolean;
}

const Filter: FC<FilterProps> = ({
  config,
  selectAll,
  SvgIcon,
  containParams,
  onChange,
  state,
  className,
  mobileHorizontally,
  mobileAlwaysActive,
}) => {
  const { open, close, isOpen } = useModal(false, { mobileScrollDisable: true });
  const filters = useMemo(() => config.filters, [config.filters]);
  const { containerRef, itemsPerRow } = useItemsPerRow(
    filters.map((elem) => ('text' in elem ? elem.text : 'Range')),
    containParams,
  );
  const urlSearchParams = new URLSearchParams(window.location.search);
  const handleSelectAll = () => {
    // @ts-expect-error some shit
    onChange(state === 'all' ? filters[0].text.toLowerCase() : 'all');
    close();
  };

  const handleFilterClick = (filterText: string) => {
    onChange(filterText);
    close();
  };

  const renderFilter = (filter: IFilter, index: number, isFullWidth?: boolean) =>
    filter.type === 'range' ? (
      <FilterRange
        key={`filter-range-${index}`}
        min={state[0]}
        max={state[1]}
        onRangeChange={onChange}
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
        classNames={'last:mr-[0px] mr-[12px] shrink-0 text-nowrap'}
      />
    ) : (
      <FilterTag
        key={filter.text}
        activeColor={config.activeColor}
        active={state === filter.text.toLowerCase() || state === 'all'}
        text={filter.text}
        onClick={() => handleFilterClick(filter.text)}
        styles={config.styles}
        classNames={classNames(
          'last:mr-[0px] mr-[12px] last:mr-[0px] mr-[12px] shrink-0 text-nowrap',
          {
            ['w-full flex']: isFullWidth,
          },
        )}
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
    <div
      ref={containerRef}
      className={className}
    >
      {selectAll && (
        <div
          className={classNames(
            'my-[10px] w-fit items-center px-[10px] py-[7px] border-[2px] flex flex-wrap border-[#191919] rounded-[18px] max-medium:my-[0]',
            {
              'max-medium:hidden': mobileHorizontally,
            },
          )}
        >
          {/* Desktop select all */}
          <SelectAll
            rotate={config.filters[0].type === 'genesis'}
            color={config.activeColor}
            text={selectAll.text}
            active={
              state === 'all' ||
              config.filters[0].type === 'range' ||
              config.filters[0].type === 'genesis'
            }
            SvgIcon={SvgIcon}
            className='max-medium:hidden'
            onClick={handleSelectAll}
          />
          {/* Mobile select all */}
          <SelectAll
            color={config.activeColor}
            text={selectAll.text}
            active
            SvgIcon={SvgIcon}
            className='hidden max-medium:flex'
            onClick={open}
          />
        </div>
      )}
      {/* Modal is only for mobile usage */}
      {isOpen && (
        <Modal
          isOpen
          onClose={close}
          mobileOnly
        >
          <div className='flex flex-col jusify-center gap-[6px]'>
            {selectAll && (
              <div
                className={classNames(
                  'w-full flex justify-center px-[10px] py-[7px] border-[2px] border-[#191919] rounded-[18px] bg-black',
                )}
              >
                <SelectAll
                  // rotate={config.filters[0].type === 'genesis'}
                  color={config.activeColor}
                  text={selectAll.text}
                  active={
                    mobileAlwaysActive ||
                    state === 'all' ||
                    config.filters[0].type === 'range' ||
                    config.filters[0].type === 'genesis' ||
                    selectAll.text === 'Trending'
                  }
                  SvgIcon={SvgIcon}
                  onClick={mobileAlwaysActive ? handleSelectAll : undefined}
                />
              </div>
            )}
            <div className='px-[10px] py-[7px] border-[2px] border-[#191919] rounded-[18px] bg-black flex flex-col gap-[10px]'>
              {filters.map((item, idx) => renderFilter(item, idx, true))}
            </div>
          </div>
        </Modal>
      )}
      {mobileHorizontally && (
        <div className='w-full px-[10px] py-[7px] border-[2px] border-[#191919] rounded-[18px] overflow-auto hidden max-medium:flex no-scrollbar'>
          {selectAll && (
            <>
              <SelectAll
                // rotate={config.filters[0].type === 'genesis'}
                color={config.activeColor}
                text={selectAll.text}
                active={
                  state === 'all' ||
                  config.filters[0].type === 'range' ||
                  config.filters[0].type === 'genesis'
                }
                SvgIcon={SvgIcon}
                onClick={handleSelectAll}
                tagClassName='mr-[10px]'
              />
            </>
          )}
          {filters.map((item, idx) => renderFilter(item, idx))}
        </div>
      )}
      <div className='max-medium:hidden'>{renderRows()}</div>
    </div>
  );
};

export default Filter;
