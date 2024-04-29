import { Dropdown } from '@/components/Dropdown/Dropdown';
import ArrowDown from '@/assets/marketplace/arrow-down.svg?react';
import FilterTag from '@/components/Controls/components/FilterTag';
import { useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

const FILTERS = {
  low: 'Price: Low → High',
  high: 'Price: High → Low',
  latest: 'List Time: Latest → Earliest',
  earliest: 'List Time: Earliest → Latest',
};

export const Filter = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const filter =
    (searchParams.get('filter') as string) in FILTERS
      ? (searchParams.get('filter') as keyof typeof FILTERS)
      : 'low';

  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
  };

  const handleDropdownOpen = () => {
    setIsDropdownVisible(true);
  };

  const handleSelect = (filter: keyof typeof FILTERS) => {
    searchParams.set('filter', filter);

    setSearchParams(searchParams);

    handleDropdownClose();
  };

  return (
    <Dropdown
      isVisible={isDropdownVisible}
      onOpen={handleDropdownOpen}
      onClose={handleDropdownClose}
      target={
        <button className='w-fit items-center px-[10px] py-[8px] border-[2px] flex gap-[9px] flex-wrap flex-1 rounded-[18px] max-medium:my-[0]'>
          <ArrowDown className={classNames('transition', { 'rotate-180': isDropdownVisible })} />
          <FilterTag
            activeColor='#FFBB00'
            active
            text={FILTERS[filter]}
            classNames='text-[#000] flex-1 align-center flex justify-center text-nowrap px-[60px]'
          />
        </button>
      }
      dropdown={
        <div className='border-[2px] rounded-[19px] bg-[rgba(0,0,0,0.1)] flex flex-col gap-[10px] backdrop-blur-lg px-[10px] py-[7px]'>
          {Object.entries(FILTERS).map(([key, value]) => (
            <button
              key={key}
              className={classNames(
                'leading-[17px] px-[10px] py-[2px] bg-[#4b4b4b] text-[#000] text-[16px] font-bold rounded-[16px] text-left',
                {
                  'bg-[#FFBB00]': key === filter,
                },
              )}
              onClick={() => handleSelect(key as keyof typeof FILTERS)}
            >
              {value}
            </button>
          ))}
        </div>
      }
      dropdownClassName='max-medium:w-full origin-top-left max-medium:origin-top w-full'
    />
  );
};
