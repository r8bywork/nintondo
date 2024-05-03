import Token from './Token/Token';
import Pagination from '../Table/Pagination';
import Arrow from '@/assets/TableArrow.svg?react';
import {
  MarketplaceTokens,
  MarketplaceTokensView,
  ListedToken,
  ListedTokenCard,
  MarketplaceTokenView,
} from '@/interfaces/marketapi';
import { Modal } from '../Modal';
import { ChangeEvent, useState } from 'react';
import './style.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MARKET_API_URL } from '@/consts';
import { useSearchParams } from 'react-router-dom';
import { shortAddress } from '@/utils';
import { Slider } from '../Controls/Slider';
// import { useTokenFilters } from '@/hooks/tokenFilters';

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

const tokens = generateFakeListedTokenCard(21);

const Listed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokensToBuy, setTokensToBuy] = useState<MarketplaceTokenView[]>([]);
  // const { tokenCard, onPageChange } = useTokenFilters();
  const [selectedTokens, setSelectedBuyTokens] = useState<MarketplaceTokenView[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [tick, page] = [
    searchParams.get('tick') || 'amid',
    isNaN(Number(searchParams.get('page'))) ? 1 : Number(searchParams.get('page')) || 1,
  ];

  const { isSuccess, data } = useQuery<MarketplaceTokensView>({
    queryKey: ['listed-tokens', tick, page],
    queryFn: async () => {
      const { data } = await axios.get(`${MARKET_API_URL}/pub/tokens?tick=${tick}&page=${page}`);

      return {
        ...data,
        tokens: (data as MarketplaceTokens).tokens.map((item) => ({
          ...item,
          shortenOutpoint: shortAddress(item.outpoint),
          fullPrice: ((item.amount * item.price_per_token) / 10 ** 8).toFixed(6),
        })),
      };
    },
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalCloseClick = () => {
    setTokensToBuy([]);
    closeModal();
  };

  const handleBuyClick = (token: MarketplaceTokenView) => {
    setTokensToBuy([token]);
    openModal();
  };

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tempSliderValue = Number(e.target.value);
    setSelectedBuyTokens(data?.tokens.slice(0, tempSliderValue) || []);
  };

  return (
    <div className='max-w-[1490px] mx-auto flex max-mobile:gap-[5px] gap-[10px] max-lg:justify-center flex-col pb-[72px]'>
      {isSuccess && (
        <div className='w-full mx-auto flex flex-wrap justify-center pt-[10px] max-mobile:gap-[5px] gap-[10px] max-lg:justify-center'>
          {data?.tokens.map((f, i) => (
            <Token
              tick='yes'
              checked={selectedTokens.includes(f)}
              onBuyClick={() => handleBuyClick(f)}
              token={f}
              key={i}
              full
            />
          ))}
        </div>
      )}
      <Pagination
        activeClassName='bg-[#FFBB00] text-black'
        leftBtnPlaceholder={<Arrow />}
        rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
        buttonsClassName='flex items-center justify-center w-auto min-w-[2.25rem] px-[6px] h-9 bg-[#191919] rounded-full'
        currentPage={1 - page}
        arrowsClassName='h-full flex items-center p-[10px] bg-[#191919] rounded-[26px]'
        className={
          'text-white flex justify-center pt-[30px] pb-[30px] items-center gap-x-[10px] text-center align-middle'
        }
        pageCount={Number(data?.total_pages) - 1 || 0}
        onPageChange={(page) => {
          searchParams.set('page', page.toString());

          setSearchParams(searchParams);
        }}
      />
      <div className='fixed flex justify-center items-center w-screen bottom-0 left-0 h-[113px] mobile:h-[72px] backdrop-blur-sm border-t-[1px] border-[#191919]'>
        <div className='max-w-[1490px] flex justify-between px-5 w-full flex-col mobile:flex-row'>
          {!data?.tokens.length || (
            <div className='items-center flex gap-2 font-bold text-[16px] border-[1px] border-white rounded-[30px] h-[24px] w-[336px] justify-center px-[15px]'>
              <Slider
                max={data?.tokens.length || 0}
                min={0}
                value={selectedTokens.length}
                onChange={handleRangeChange}
              />
              <span className='w-[16px]'>{selectedTokens.length}</span>
            </div>
          )}
          <p>SHIT2</p>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen
          onClose={closeModal}
        >
          <div className='bg-[#191919] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] rounded-[15px] py-[21px] mx-[17px] px-[62px] max-medium:px-[25px] flex flex-col gap-[34px] items-center'>
            <p className='text-[20px] font-bold'>Confirmation</p>
            <p className='text-[20px] text-[#4b4b4b]'>Please, confirm the transaction below:</p>
            <div>
              {tokensToBuy.map((value) => (
                <Token
                  token={value}
                  tick={tick || ''}
                  key={value.outpoint}
                  background='#292929'
                />
              ))}
            </div>
            <div className='flex flex-col gap-[13px]'>
              <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B] max-w-[620px]'>
                <div className='flex w-[400px] max-medium:w-[220px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>TOTAL VALUE</p>
                  <p className='text-[20px]'>8000000</p>
                </div>
                <div className='flex w-[200px] max-medium:w-[120px] justify-between pt-[6px]'>
                  <p className='text-[20px] max-medium:text-[14px] text-[#4B4B4B]'>sats</p>
                  <p className='text-[20px] max-medium:text-[14px]'>~$5000.00</p>
                </div>
              </div>
              <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] max-medium:w-[220px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>SERVICE FEE</p>
                  <p className='text-[20px] '>40000</p>
                </div>
                <div className='flex w-[200px] max-medium:w-[120px] justify-between pt-[6px]'>
                  <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>sats</p>
                  <p className='text-[20px] max-medium:text-[14px]'>~$25.29</p>
                </div>
              </div>
              <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] max-medium:w-[220px] flex-col gap-[10px]'>
                  <div className='flex justify-between'>
                    <p className='text-[20px] text-[#4B4B4B]'>TRANSACTION FEE RATE</p>
                    <p className='text-[20px]'>321</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-[20px] text-[#4B4B4B]'></p>
                    <p className='text-[20px]'>10778</p>
                  </div>
                </div>
                <div className='flex w-[200px] max-medium:w-[120px] flex-col gap-[10px] max-medium:gap-[49px] pt-[6px]'>
                  <div className='flex justify-between items-center'>
                    <p className='text-[20px] max-medium:text-[14px] text-[#4B4B4B]'>sats/vB</p>
                    <button className='text-[20px] text-[#FFBB00] border border-[#FFBB00] px-2 rounded-[4px] leading-5 max-medium:text-[14px] max-medium:px-[2px]'>
                      Customize
                    </button>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>sats</p>
                    <p className='text-[20px] max-medium:text-[14px]'>~$25.29</p>
                  </div>
                </div>
              </div>
              <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] max-medium:w-[220px] flex-col gap-[10px]'>
                  <div className='flex justify-between'>
                    <p className='text-[20px] text-[#4B4B4B]'>TOTAL</p>
                    <p className='text-[20px] text-[#FFBB00] font-bold'>~8,050,778</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-[20px]'></p>
                    <p className='text-[20px] text-[#4B4B4B]'>0.08050778</p>
                  </div>
                </div>
                <div className='flex w-[200px] max-medium:w-[120px] flex-col gap-[19px] pt-[6px]'>
                  <div className='flex justify-between items-center'>
                    <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>sats</p>
                    <p className='text-[20px] max-medium:text-[14px]'>~$4325.29</p>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>BTC</p>
                    <p className='text-[20px]'></p>
                  </div>
                </div>
              </div>
              <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] max-medium:w-[220px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>AVAILABLE BALANCE</p>
                  <p className='text-[20px] text-[#4B4B4B]'>0</p>
                </div>
                <div className='flex w-[200px] max-medium:w-[120px] justify-between pt-[6px]'>
                  <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>BTC</p>
                  <p className='text-[20px]'></p>
                </div>
              </div>
            </div>
            <div className='flex gap-[27px]'>
              <button
                onClick={handleModalCloseClick}
                className='py-[6px] px-[45px] rounded-full bg-[#fff] text-[#000] text-[20px] font-bold'
              >
                CANCEL
              </button>
              <button className='shadow-[0px_1px_18px_0px_#FFD45C80] py-[6px] px-[45px] rounded-full bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)] text-[#000] text-[20px] font-bold '>
                CONFIRM
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { Listed };
