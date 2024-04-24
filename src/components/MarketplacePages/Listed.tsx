import Token from './Token/Token';
import Pagination from '../Table/Pagination';
import Arrow from '@/assets/TableArrow.svg?react';
import { ListedToken, ListedTokenCard } from '@/interfaces/marketapi';
// import { useTokenFilters } from '@/hooks/tokenFilters';

const Listed = () => {
  // const { tokenCard, onPageChange } = useTokenFilters();
  const generateFakeListedToken = (): ListedToken => ({
    tick: Math.random().toString(36).substring(2, 6).toUpperCase(),
    amount: Math.floor(Math.random() * 1000),
    outpoint: `${Math.random().toString(36).substring(2, 15)}:${Math.floor(Math.random() * 1000)}`,
    price: parseFloat((Math.random() * 100).toFixed(2)),
  });

  const generateFakeListedTokenCard = (totalTokens: number): ListedTokenCard => {
    const tokens = Array.from({ length: totalTokens }, generateFakeListedToken);
    return {
      pages: Math.ceil(totalTokens / 10),
      count: totalTokens,
      tokens,
    };
  };

  return (
    <div className='max-w-[1490px] mx-auto flex flex-wrap pt-[10px] max-lowerMobile:gap-[5px] gap-[10px] max-lg:justify-center'>
      {generateFakeListedTokenCard(21).tokens.map((f, i) => (
        <Token
          token={f}
          key={i}
        />
      ))}
      <Pagination
        activeClassName='bg-[#FFBB00] text-black'
        leftBtnPlaceholder={<Arrow />}
        rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
        buttonsClassName='flex items-center justify-center w-auto min-w-[2.25rem] px-[6px] h-9 bg-[#191919] rounded-full'
        currentPage={1}
        arrowsClassName='h-full flex items-center p-[10px] bg-[#191919] rounded-[26px]'
        className={
          'text-white flex justify-center pt-[30px] pb-[30px] items-center gap-x-[10px] text-center align-middle'
        }
        pageCount={300}
        onPageChange={() => {}}
      />
    </div>
  );
};

export { Listed };
