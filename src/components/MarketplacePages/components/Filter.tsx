import { Dropdown } from '@/components/Dropdown/Dropdown';
import { useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { Select } from '@/components/Controls/Select';

interface FilterProps {
  filters: Record<string, string>;
  defaultFilter: keyof FilterProps['filters'];
  filterKey: string;
  tag?: string;
  className?: string;
}

export const Filter = ({ filters, defaultFilter, filterKey, tag, className }: FilterProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const filter =
    (searchParams.get(filterKey) as string) in filters
      ? (searchParams.get(filterKey) as keyof typeof filters)
      : defaultFilter;

  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
  };

  const handleDropdownOpen = () => {
    setIsDropdownVisible(true);
  };

  const handleSelect = (filter: keyof typeof filters) => {
    searchParams.set(filterKey, filter);

    setSearchParams(searchParams);

    handleDropdownClose();
  };

  return (
    <Dropdown
      isVisible={isDropdownVisible}
      onOpen={handleDropdownOpen}
      onClose={handleDropdownClose}
      target={
        <Select
          isActive={isDropdownVisible}
          className={className}
        >
          {tag ? `${tag} ` : ''}
          {filters[filter]}
        </Select>
      }
      dropdown={
        <div
          className={classNames(
            'border-[2px] border-[rgba(255,255,255,0.5)] rounded-[28px] bg-[rgba(0,0,0,0.8)] flex flex-col gap-[10px] backdrop-blur-lg p-[10px]',
          )}
        >
          {Object.entries(filters).map(([key, value]) => (
            <button
              key={key}
              className={classNames(
                'leading-[19px] px-[16px] py-[8px] bg-[#4b4b4b] text-[#000] text-[18px] font-bold rounded-[50px] text-left',
                {
                  'bg-[#FFBB00]': key === filter,
                },
              )}
              onClick={() => handleSelect(key as keyof typeof filters)}
            >
              {value}
            </button>
          ))}
        </div>
      }
      dropdownClassName='max-medium:w-full origin-top-left max-medium:origin-top w-full'
      containerClassName='w-full'
    />
  );
};
