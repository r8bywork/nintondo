import Token from './Token/Token';
import Pagination from '../Table/Pagination';
import Arrow from '@/assets/TableArrow.svg?react';
import {
  MarketplaceTokens,
  MarketplaceTokensView,
  MarketplaceTokenView,
} from '@/interfaces/marketapi';
import { Modal } from '../Modal';
import { useState } from 'react';
import './style.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MARKET_API_URL } from '@/consts';
import { useSearchParams } from 'react-router-dom';
import { shortAddress } from '@/utils';
import Loading from 'react-loading';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BottomSelect } from '../BottomSelect/BottomSelect';
import { useModal } from '@/hooks/useModal';
import { useWithStatistic } from '@/hooks/useWithStatistics';

const Listed = () => {
  const { isOpen, open: openModal, close: closeModal } = useModal();
  const [tokensToBuy, setTokensToBuy] = useState<MarketplaceTokenView[]>([]);
  // const { tokenCard, onPageChange } = useTokenFilters();
  // const [selectedTokens, setSelectedBuyTokens] = useState<MarketplaceTokenView[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTokens, { stats, forceSet, addItem, removeItem }] =
    useWithStatistic<MarketplaceTokenView>([], ['amount']);

  const [tick, page] = [
    searchParams.get('tick') || 'amid',
    isNaN(Number(searchParams.get('page'))) ? 1 : Number(searchParams.get('page')) || 1,
  ];

  const { isSuccess, data, isLoading } = useQuery<MarketplaceTokensView>({
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

  const handleModalCloseClick = () => {
    setTokensToBuy([]);
    closeModal();
  };

  const handleBuyClick = (token: MarketplaceTokenView) => {
    setTokensToBuy([token]);
    openModal();
  };

  const handleBuySelectedClick = () => {
    setTokensToBuy(selectedTokens);
    openModal();
  };

  const handleRangeChange = (value: number) => {
    forceSet(data?.tokens.slice(0, value) || []);
  };

  const handleSelect = (token: MarketplaceTokenView) => {
    if (selectedTokens.some((s) => s.number === token.number)) {
      return removeItem(token, 'number');
    }

    addItem(token);
  };

  return (
    <div className='max-w-[1490px] flex max-mobile:gap-[5px] gap-[10px] max-lg:justify-center flex-col pb-[72px]'>
      {isSuccess && (
        <div
          className='w-full grid gap-[18px]'
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          }}
        >
          {data?.tokens.map((f, i) => (
            <Token
              tick='yes'
              checked={selectedTokens.some((s) => s.number === f.number)}
              onBuyClick={handleBuyClick}
              token={f}
              key={i}
              full
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
      {isLoading && <Loading type='balls' />}
      {Number(data?.total_pages || 0) > 1 && (
        <Pagination
          activeClassName='bg-[#FFBB00] text-black'
          leftBtnPlaceholder={<Arrow />}
          rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
          buttonsClassName='flex items-center justify-center w-auto min-w-[2.25rem] px-[6px] h-9 bg-[#191919] rounded-full'
          currentPage={page - 1}
          arrowsClassName='h-full flex items-center p-[10px] bg-[#191919] rounded-[26px]'
          className={
            'text-white flex justify-center pt-[30px] pb-[30px] items-center gap-x-[10px] text-center align-middle'
          }
          pageCount={Number(data?.total_pages) - 1 || 0}
          onPageChange={(page) => {
            searchParams.set('page', (page + 1).toString());

            setSearchParams(searchParams);
          }}
        />
      )}
      <BottomSelect
        dataCount={data?.tokens.length || 0}
        selectedCount={selectedTokens.length}
        onChange={handleRangeChange}
      >
        <button
          className={
            'px-[31px] py-[6px] border font-bold text-[20px] leading-[21px] transition rounded-[50px] border-[#FFBB00] text-[#FFBB00] disabled:border-[#262626] disabled:text-[#262626] disabled:cursor-default'
          }
          onClick={handleBuySelectedClick}
          disabled={!selectedTokens.length}
        >
          BUY {stats.amount.toLocaleString()} {tick} for 0 BTC
        </button>
      </BottomSelect>
      {isOpen && (
        <Modal
          isOpen
          onClose={closeModal}
        >
          <ConfirmationModal
            onClose={handleModalCloseClick}
            onConfirm={() => console.log('Dont care about this logic')}
            tokensToBuy={tokensToBuy}
            tick={tick}
          />
        </Modal>
      )}
    </div>
  );
};

export { Listed };
