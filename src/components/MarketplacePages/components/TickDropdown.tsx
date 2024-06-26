import ButtonSvg from '../../../assets/Button.svg?react';
import Reload from '../../../assets/reload.svg?react';
import { Field, InlineTable, ItemField } from '@/components/InlineTable/InlineTable';
import { Dropdown } from '@/components/Dropdown/Dropdown';
import { useState } from 'react';
import { createFavoriteWithGroup } from './Favorite';
import { useSearchParams } from 'react-router-dom';
import { useFavorites } from '@/hooks/favorites';
import FilledStar from '@/assets/filled-star.svg?react';
import { Select } from '@/components/Controls/Select';

const FIELDS: Field[] = [
  { key: 'num', title: '#', Component: createFavoriteWithGroup('tick') },
  { key: 'tick', title: 'TICK' },
  { key: 'volume', title: 'VOLUME BEL' },
  { key: 'price', title: 'PRICE' },
  { key: 'day', title: '24H' },
];

const DATA: ItemField[] = [
  {
    num: { value: '1' },
    tick: { value: 'amid' },
    volume: { value: '0.0000' },
    price: { value: '0', under: 'sats/atom' },
    day: { value: '0.00%', marked: true },
  },
  {
    num: { value: '2' },
    tick: { value: 'nook' },
    volume: { value: '0.0000' },
    price: { value: '0', under: 'sats/atom' },
    day: { value: '0.00%', marked: true },
  },
];

export const TickDropdown = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { favorites, removeFromFavorite } = useFavorites();

  const tick = searchParams.get('tick') || DATA[0].tick?.value;

  const handleTickChange = (tick: string) => {
    searchParams.set('tick', tick);

    setSearchParams(searchParams);

    handleDropdownClose();
  };

  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
  };

  const handleDropdownOpen = () => {
    setIsDropdownVisible(true);
  };

  const handleRowClick = (item: ItemField) => {
    handleTickChange(`${item.tick?.value}`);
  };

  return (
    <Dropdown
      isVisible={isDropdownVisible}
      onClose={handleDropdownClose}
      onOpen={handleDropdownOpen}
      target={<Select isActive={isDropdownVisible}>{tick}</Select>}
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
          <div className='flex flex-wrap gap-[13px]'>
            {favorites.tick?.map((item) => (
              <button
                onClick={() => handleTickChange(item)}
                key={item}
                className='flex gap-[8px] text-[20px] items-center px-[8px] bg-[#4B4B4B] rounded-[5px]'
              >
                <FilledStar
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorite('tick', item);
                  }}
                />
                {item}
              </button>
            ))}
          </div>
          <div className='w-full overflow-x-auto'>
            <InlineTable
              selectedId={tick}
              firstCellClassName='py-[13px]'
              fields={FIELDS}
              data={DATA}
              cellClassName='pl-[27px] py-[13px]'
              onRowClick={handleRowClick}
              keyId='tick'
            />
          </div>
        </div>
      }
      dropdownClassName='max-medium:w-full origin-top-left max-medium:origin-top z-10'
    />
  );
};
