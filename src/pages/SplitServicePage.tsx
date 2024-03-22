import { Ord } from '@/interfaces/nintondo-manager-provider';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import UtxoSelector from '@/components/SplitServiceComponents/UtxoSelector';
import SplitVisualizer from '@/components/SplitServiceComponents/SplitVisualizer';
import SplitSummary from '@/components/SplitServiceComponents/SplitSummary';

const SplitServicePage = () => {
  const { address, verifiedAddress } = useNintondoManagerContext();
  const [ords, setOrds] = useState<Ord[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrds, setSelectedOrds] = useState<Ord[]>([]);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  const getUserInscriptions = useCallback(async (): Promise<Ord[]> => {
    const response = (await axios.get(`http://localhost:3001/offset_ords/address/${address}`)).data;
    return response.ords as Ord[];
  }, [address]);

  const selectedOrdHandler = (ord: Ord) => {
    setSelectedOrds((prev) => [...prev, ord]);
    setOrds((prev) => {
      const index = prev.findIndex((f) => f.txid === ord.txid);
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
      const index = prev.findIndex((f) => f.txid === ord.txid);
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const inscriptionBurnAllHandler = (action: 'burn' | 'unburn') => {
    setSelectedOrds((prev: Ord[]) =>
      prev.map((o) => ({
        ...o,
        inscriptions: o.inscriptions.map((inscription) => ({
          ...inscription,
          burn: action === 'burn',
        })),
      })),
    );
  };

  const inscriptionBurnHandler = (ord: Ord, action: 'burn' | 'unburn') => {
    setSelectedOrds((prev: Ord[]) =>
      prev.map((o) =>
        o.txid === ord.txid
          ? {
              ...o,
              inscriptions: o.inscriptions.map((inscription, index) =>
                index === (o.inscriptionIndex ?? 0)
                  ? { ...inscription, burn: action === 'burn' }
                  : inscription,
              ),
            }
          : o,
      ),
    );
  };

  useEffect(() => {
    setSelectedOrds([]);
    setOrds([]);
    (async () => {
      setLoading(true);
      if (!address || !verifiedAddress) return;
      let ords = await getUserInscriptions();
      ords = ords.sort((a, b) => b.available_to_free - a.available_to_free);
      setOrds(ords);
      setLoading(false);
    })();
  }, [address, verifiedAddress]);

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
          Loading
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
            inscriptionBurnHandler={inscriptionBurnHandler}
            inscriptionBurnAllHandler={inscriptionBurnAllHandler}
          />
        </div>
        <SplitSummary selectedOrds={selectedOrds} />
      </div>
    </div>
  );
};

export default SplitServicePage;
