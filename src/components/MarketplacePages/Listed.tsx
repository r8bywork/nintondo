/* eslint-disable camelcase */
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
import { DEFAULT_FEE_RATE, MARKET_API_URL } from '@/consts';
import { useSearchParams } from 'react-router-dom';
import { shortAddress } from '@/utils';
import Loading from 'react-loading';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BottomSelect } from '../BottomSelect/BottomSelect';
import { useModal } from '@/hooks/useModal';
import { useWithStatistic } from '@/hooks/useWithStatistics';
import {
  getMarketplaceFilters,
  useCheckInscription,
  useCreateBuyingSignedPsbt,
  usePrepareInscriptions,
} from '@/hooks/market';
import toast from 'react-hot-toast';
import { YesNoModal } from './components/YesNoModal';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import { useMakeAuthRequests } from '@/hooks/auth';
import { PreparedToBuyInscription } from '@/interfaces/intefaces';
import { ApiOrdUTXO } from '@/interfaces/api';

const Listed = () => {
  // Modal logic
  const { isOpen, open: openModal, close: closeModal } = useModal();
  const { isOpen: isYesNoOpen, open: openYesNo, close: closeYesNo } = useModal();

  const [tokensToBuy, setTokensToBuy] = useState<MarketplaceTokenView[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTokens, { stats, forceSet, addItem, removeItem }] =
    useWithStatistic<MarketplaceTokenView>([], ['amount']);

  const prepareInscriptions = usePrepareInscriptions();
  const checkInscription = useCheckInscription();
  const createBuyingSignedPsbt = useCreateBuyingSignedPsbt();
  const [tokenUtxos, setTokenUtxos] = useState<ApiOrdUTXO[]>([]);

  const makeAuthRequests = useMakeAuthRequests();

  const { verifiedAddress, getPublicKey } = useNintondoManagerContext();

  const { tick, page, filter } = getMarketplaceFilters(searchParams);

  const { isSuccess, data, isLoading } = useQuery<MarketplaceTokensView>({
    queryKey: ['listed-tokens', tick, page, filter],
    queryFn: async () => {
      const { data } = await axios.get(
        `${MARKET_API_URL}/pub/tokens?tick=${tick}&page=${page}&filter=${filter}`,
      );

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

  const handleYesNoClose = () => {
    closeYesNo();
  };

  const handleModalClose = () => {
    closeModal();
  };

  const handleModalCloseClick = () => {
    setTokensToBuy([]);
    handleModalClose();
  };

  const handleYesNoCancel = () => {
    handleYesNoClose();
    handleModalCloseClick();
  };

  const checkUtxos = async () => {
    if (!verifiedAddress) {
      toast.error('Connect your wallet first');
      return false;
    }
    const tokenUtxos: ApiOrdUTXO[] = [];
    for (const tokenToBuy of tokensToBuy) {
      const utxo = await checkInscription(tokenToBuy);
      if (!utxo) {
        toast.error('Failed to find inscription utxo');
        return;
      }
      tokenUtxos.push(utxo);
    }
    setTokenUtxos(tokenUtxos);
    const utxos = await prepareInscriptions(
      tokensToBuy.map((f, i) => ({
        price: f.amount * f.price_per_token,
        seller: f.owner,
        sellerUtxo: tokenUtxos[i],
      })),
    );
    if (!utxos) {
      openYesNo();
      return false;
    }
    return true;
  };

  const handleBuyClick = async (token: MarketplaceTokenView) => {
    setTokensToBuy([token]);
    if (await checkUtxos()) openModal();
  };

  const handleBuySelectedClick = async () => {
    setTokensToBuy(selectedTokens);
    if (await checkUtxos()) openModal();
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

  const handleBuy = async (tokens: MarketplaceTokenView[], fee: number) => {
    if (!verifiedAddress) toast.error('Please connect your wallet first');
    let preparedToBuyInscriptions: PreparedToBuyInscription[] = [];
    while (preparedToBuyInscriptions.length < tokens.length) {
      const receivedPreparedToBuyInscriptions = await prepareInscriptions(
        tokens.map((f, i) => ({
          price: f.amount * f.price_per_token,
          seller: f.owner,
          sellerUtxo: tokenUtxos[i],
        })),
      );
      if (receivedPreparedToBuyInscriptions) {
        preparedToBuyInscriptions = receivedPreparedToBuyInscriptions;
        break;
      }
      await new Promise((resolve) => setTimeout(() => resolve(''), 1000));
    }
    const partiallySignedPsbts = await createBuyingSignedPsbt(preparedToBuyInscriptions, fee);
    if (partiallySignedPsbts === undefined) return;
    const pubKey = await getPublicKey();
    const result = await makeAuthRequests(() =>
      axios.post(
        `${MARKET_API_URL}/tokens/buy-tokens`,
        {
          psbts_base64: partiallySignedPsbts,
          public_key_hex: pubKey,
        },
        { withCredentials: true },
      ),
    );
    console.log(result);
  };

  return (
    <div className='max-w-[1490px] flex max-mobile:gap-[5px] gap-[10px] max-lg:justify-center flex-col pb-[72px]'>
      {isSuccess && !data.tokens.length && (
        <p className='text-[28px] font-bold text-center pt-[50px]'>
          No listed tokens found for <span className='text-[#FFBB00]'> {tick}</span>
        </p>
      )}
      {isSuccess && Boolean(data.tokens.length) && (
        <div
          className='w-full grid gap-[18px] min-h-[760px] max-medium:min-h-auto'
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gridTemplateRows: 'repeat(auto-fill, 280px)',
          }}
        >
          {data?.tokens.map((f, i) => (
            <Token
              tick={tick}
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
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
      >
        <ConfirmationModal
          onClose={handleModalCloseClick}
          onConfirm={handleBuy}
          tokensToBuy={tokensToBuy}
          tick={tick}
          data={{ fee: DEFAULT_FEE_RATE }}
        />
      </Modal>
      <Modal
        isOpen={isYesNoOpen}
        onClose={handleYesNoClose}
      >
        <YesNoModal
          onCancel={handleYesNoCancel}
          onError={handleYesNoCancel}
          onSuccess={handleYesNoClose}
          inscriptionPrices={tokensToBuy.map((f) => f.amount * f.price_per_token)}
        />
      </Modal>
    </div>
  );
};

export { Listed };
