import { Ord } from '@/interfaces/nintondo-manager-provider';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import UtxoSelector from '@/components/SplitServiceComponents/UtxoSelector';
import SplitVisualizer from '@/components/SplitServiceComponents/SplitVisualizer';
import SplitSummary from '@/components/SplitServiceComponents/SplitSummary';
import { BACKEND_URL, NINTONDO_API_URL } from '@/consts';
import Loading from 'react-loading';
import FeeSelector from '@/components/SplitServiceComponents/FeeSelector';
import { Fees } from '@/interfaces/api';
import { getFees } from '@/hooks/electrs';
import { Split } from '@/interfaces/marketapi';
import { filterOrdsAndFindUnmatchedSplits } from '@/utils';

const SplitServicePage = () => {
  const { address, verifiedAddress } = useNintondoManagerContext();
  const [ords, setOrds] = useState<Ord[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrds, setSelectedOrds] = useState<Ord[]>([]);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);
  const [feeRates, setFeeRate] = useState<Fees>({ fast: 3000, slow: 200 });

  const [selectedFeeRate, setSelectedFeeRate] = useState<number | string>(37);

  const getOffsets = useCallback(async (): Promise<Ord[]> => {
    const response = (await axios.get(`${NINTONDO_API_URL}/offset_ords/address/${address}`)).data;
    return response.ords as Ord[];
  }, [address]);

  const getSplits = useCallback(async () => {
    const result = await axios.get<Split[]>(`${BACKEND_URL}/split`, { withCredentials: true });
    return result.data;
  }, []);

  const confirmSplits = useCallback(async (txs: string[]) => {
    await axios.put(`${BACKEND_URL}/split`, { txs }, { withCredentials: true });
  }, []);

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
    if (!address || !verifiedAddress) return;
    let ords = await getOffsets();
    const splits = await getSplits();
    const { filteredOrds, unmatchedSplits } = filterOrdsAndFindUnmatchedSplits(ords, splits);

    ords = filteredOrds.sort((a, b) => b.available_to_free - a.available_to_free);
    setOrds(ords);
    setLoading(false);
    if (unmatchedSplits.length > 0) await confirmSplits(unmatchedSplits.map((f) => f.txid));
  }, [address, verifiedAddress, getSplits]);

  useEffect(() => {
    setSelectedOrds([]);
    setOrds([]);
    updateOrds();
  }, [updateOrds]);

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
        <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white'>
          You cannot split any ords
        </div>
      </div>
    );

  return (
    <div className={'bg-black'}>
      <div className='min-h-screen max-w-[1700px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white p-4'>
        <div className='flex justify-center flex-col lg:flex-row gap-4'>
          <UtxoSelector
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
      </div>
    </div>
  );
};

export default SplitServicePage;
