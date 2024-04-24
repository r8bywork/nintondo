import ButtonSvg from '../../../assets/Button.svg?react';
import Reload from '../../../assets/reload.svg?react';
import { Field, InlineTable } from '@/components/InlineTable/InlineTable';
import { Dropdown } from '@/components/Dropdown/Dropdown';
import FilterTag from '@/components/Controls/components/FilterTag';
import { useState } from 'react';
import ArrowDown from '../../../assets/marketplace/arrow-down.svg?react';
import classNames from 'classnames';

const FIELDS: Field[] = [
  { key: 'num', title: '#' },
  { key: 'tick', title: 'TICK' },
  { key: 'volume', title: 'VOLUME BTC' },
  { key: 'price', title: 'PRICE' },
  { key: 'day', title: '24H' },
];

export const TickDropdown = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
  };

  const handleDropdownOpen = () => {
    setIsDropdownVisible(true);
  };

  return (
    <Dropdown
      isVisible={isDropdownVisible}
      onClose={handleDropdownClose}
      onOpen={handleDropdownOpen}
      target={
        <div className='w-fit items-center px-[10px] py-[8px] border-[2px] flex flex-wrap gap-[9px] border-[#fff] rounded-[18px] max-medium:my-[0] max-medium:w-full'>
          <ArrowDown className={classNames('transition', { 'rotate-180': isDropdownVisible })} />
          <FilterTag
            activeColor='#FFBB00'
            active
            text='atom'
            classNames='text-[#000] text-[16px] leading-[17px] py-[2px] px-[30px] max-medium:flex-1 justify-center'
          />
        </div>
      }
      dropdown={
        <div className='shadow-[0_0_20px_0_rgba(0,0,0,0.3)] flex flex-col gap-[22px] rounded-[15px] p-[25px] bg-[#191919] left-0'>
          <div className='flex gap-[13px]'>
            <input
              onChange={() => {}}
              className='w-[374px] max-medium:w-full rounded-full py-[7px] bg-black/80 border-2 text-white text-[14px] placeholder-white/50 px-5 outline-none focus:border-orange-500 transition-colors leading-[14px]'
              placeholder='Search'
              type='text'
            />
            <button className='flex shadow-[0_1px_20px_0_#FFD45C80] bg-transparent rounded-full'>
              <ButtonSvg className='flex' />
            </button>
            <button className='flex shrink-0 bg-white rounded-full h-[33px] w-[33px] items-center justify-center'>
              <Reload />
            </button>
          </div>
          <div className='w-full overflow-x-auto'>
            <InlineTable
              fields={FIELDS}
              data={[]}
              cellClassName='pl-[27px]'
            />
          </div>
        </div>
      }
      dropdownClassName='max-medium:w-full'
    />
  );
};
