import Token from './Token/Token';
import Pagination from '../Table/Pagination';
import Arrow from '@/assets/TableArrow.svg?react';
import { ListedToken, ListedTokenCard } from '@/interfaces/marketapi';
import { useEffect, useState } from 'react';
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

  const [tokenCard, setTokenCard] = useState<ListedTokenCard>({ count: 0, pages: 0, tokens: [] });
  const [selectedTokens, setSelectedBuyTokens] = useState<ListedToken[]>([]);

  useEffect(() => {
    setTokenCard(generateFakeListedTokenCard(28));
  }, []);

  return (
    <div className='max-w-[1490px] mx-auto flex max-mobile:gap-[5px] gap-[10px] max-lg:justify-center flex-col pb-[72px]'>
      <div className='w-full mx-auto flex flex-wrap pt-[10px] max-mobile:gap-[5px] gap-[10px] max-lg:justify-center'>
        {tokenCard.tokens.map((f, i) => (
          <Token
            checked={selectedTokens.includes(f)}
            token={f}
            key={i}
          />
        ))}
      </div>
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
      <div className='fixed flex justify-center items-center w-screen bottom-0 left-0 h-[113px] mobile:h-[72px] backdrop-blur-sm border-t-[1px] border-[#191919]'>
        <div className='max-w-[1490px] flex justify-between px-5 w-full flex-col mobile:flex-row'>
          <div className='flex gap-2 font-bold text-[16px] border-[1px] border-white rounded-[30px] h-[24px] w-[336px] justify-center'>
            {/* <input
              type='range'
              max={tokenCard.tokens.length}
              min={0}
              value={selectedTokens.length}
              onChange={(e) => {
                setSelectedBuyTokens(tokenCard.tokens.slice(0, Number(e.target.value)));
              }}
            /> */}
            <input
              type='range'
              max={tokenCard.tokens.length}
              min={0}
              value={selectedTokens.length}
              onChange={(e) => {
                const tempSliderValue = Number(e.target.value);
                setSelectedBuyTokens(tokenCard.tokens.slice(0, tempSliderValue));

                const sliderEl = e.target as HTMLInputElement;
                const progress =
                  tokenCard.tokens.length === 0
                    ? 0
                    : (tempSliderValue / tokenCard.tokens.length) * 100;
                sliderEl.style.background = `linear-gradient(to right, #FFFFFF ${progress}%, #000000 ${progress}%)`;
              }}
            />
            <span className='w-[16px]'>{selectedTokens.length}</span>
          </div>
          <p>SHIT2</p>
        </div>
      </div>
    </div>
  );
};

export { Listed };
