import { Ord } from '@/interfaces/nintondo-manager-provider';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import UtxoSelector from '@/components/SplitServiceComponents/UtxoSelector';
import SplitVisualizer from '@/components/SplitServiceComponents/SplitVisualizer';
import SplitSummary from '@/components/SplitServiceComponents/SplitSummary';
import { OLD_ELECTRS } from '@/consts';
import Loading from 'react-loading';
import FeeSelector from '@/components/SplitServiceComponents/FeeSelector';
import { Fees } from '@/interfaces/api';
import { getFees } from '@/hooks/electrs';
import { useMakeAuthRequests } from '@/hooks/auth';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/Modal';
import { HistoryModal } from '@/components/SplitServiceComponents/HistoryModal';
import { useSearchParams } from 'react-router-dom';

const SplitServicePage = () => {
  const { address, verifiedAddress } = useNintondoManagerContext();
  const [ords, setOrds] = useState<Ord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const [selectedOrds, setSelectedOrds] = useState<Ord[]>([]);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);
  const [feeRates, setFeeRate] = useState<Fees>({ fast: 3000, slow: 200 });

  const [hideSmall, setHideSmall] = useState<boolean>(false);
  const [selectedFeeRate, setSelectedFeeRate] = useState<number | string>(37);

  const { isOpen, open, close } = useModal();

  const makeAuthRequests = useMakeAuthRequests();
  useEffect(() => {
    if (hideSmall) {
      searchParams.set('hide_small', 'true');
    } else {
      searchParams.delete('hide_small');
    }
  }, [hideSmall]);

  const getOffsets = useCallback(async (): Promise<Ord[]> => {
    const response = (
      await makeAuthRequests(() =>
        axios.get(
          `${OLD_ELECTRS}/offset_ords/address/${address}${searchParams.size ? `?${searchParams}` : ''
          }`,
        ),
      )
    )?.data;
    return response as Ord[];
  }, [address]);

  // const getSplits = useCallback(async () => {
  //   const result = await makeAuthRequests(() =>
  //     axios.get<Split[]>(`${BACKEND_URL}/split`, { withCredentials: true }),
  //   );
  //   return result?.data ?? [];
  // }, []);

  // const confirmSplits = useCallback(async (txs: string[]) => {
  //   await makeAuthRequests(() =>
  //     axios.put(`${BACKEND_URL}/split`, { txs }, { withCredentials: true }),
  //   );
  // }, []);

  const selectedOrdHandler = (ord: Ord) => {
    setSelectedOrds((prev) => [...prev, ord]);
    setOrds((prev) => {
      const index = prev.findIndex((f) => f.txid === ord.txid && f.vout === ord.vout);
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const selectAll = () => {
    setSelectedOrds((prev) => [...prev, ...ords]);
    setOrds([]);
  };

  const removeSelectedOrdHandler = (ord: Ord) => {
    setSelectedAll(false);
    setOrds((prev) => [...prev, ord]);
    setSelectedOrds((prev) => {
      const index = prev.findIndex((f) => f.txid === ord.txid && f.vout === ord.vout);
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const updateFees = useCallback(async () => {
    const fees = await getFees();
    if (selectedFeeRate === 37) setSelectedFeeRate(fees.fast);
    setFeeRate(fees);
  }, []);

  const updateOrds = useCallback(async () => {
    setLoading(true);
    setSelectedOrds([]);
    setOrds([]);

    if (!address || !verifiedAddress) {
      return;
    }

    const ords = await getOffsets();
    // const splits = await getSplits();
    // const { filteredOrds, unmatchedSplits } = filterOrdsAndFindUnmatchedSplits(
    //   ords ?? [],
    //   splits ?? [],
    // );
    // ords = filteredOrds.sort((a, b) => b.available_to_free - a.available_to_free);

    setOrds(ords);
    setLoading(false);

    // if (ords.length > 0) {
    //   await confirmSplits(ords.map((f) => f.txid));
    // }
  }, [address, verifiedAddress]);

  useEffect(() => {
    setSelectedOrds([]);
    setOrds([]);
    updateOrds();
  }, [updateOrds, hideSmall]);

  useEffect(() => {
    updateFees();
    const interval = setInterval(async () => {
      updateFees;
    }, 5000);

    return () => clearInterval(interval);
  }, [updateFees]);

  if (!verifiedAddress)
    return (
      <div className={'bg-black'}>
        <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white'>
          Please connect your wallet
        </div>
      </div>
    );

  if (loading)
    return (
      <div className={'bg-black'}>
        <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white'>
          <Loading type='balls' />
        </div>
      </div>
    );

  if (!ords.length && !selectedOrds.length)
    return (
      <div className={'bg-black'}>
        <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white flex-col gap-[20px]'>
          You cannot split any ords
          <button
            className={
              'text-[20px] flex items-center border px-[20px] py-[6px] gap-[10px] leading-[21px] transition rounded-[50px]'
            }
            onClick={open}
          >
            History
          </button>
        </div>
        <Modal
          isOpen={isOpen}
          onClose={close}
        >
          <HistoryModal onClose={close} />
        </Modal>
      </div>
    );

  return (
    <div className='min-h-screen max-w-[1700px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white p-4'>
      <div className='flex justify-center flex-col lg:flex-row gap-4'>
        <UtxoSelector
          switchProps={{
            hideSmall: hideSmall,
            onToggle: () => setHideSmall(!hideSmall),
          }}
          ords={ords}
          selectOrdHandler={selectedOrdHandler}
          setSelectedAll={() => {
            setSelectedAll((prev) => {
              if (!prev) selectAll();
              return !prev;
            });
          }}
          selectedAll={selectedAll}
        />
        <SplitVisualizer
          selectedOrds={selectedOrds}
          setSelectedOrds={setSelectedOrds}
          removeSelectedOrdHandler={removeSelectedOrdHandler}
          onHistoryClick={open}
        />
      </div>
      <div className='flex gap-6'>
        <FeeSelector
          onChange={(value) => {
            setSelectedFeeRate(value);
          }}
          value={selectedFeeRate}
          feeRates={feeRates}
        />
        <SplitSummary
          selectedFeeRate={typeof selectedFeeRate === 'string' ? 0 : selectedFeeRate}
          selectedOrds={selectedOrds}
          updateOrds={updateOrds}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={close}
      >
        <HistoryModal onClose={close} />
      </Modal>
    </div>
  );
};

export default SplitServicePage;
