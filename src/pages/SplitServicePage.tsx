import { Ord } from '@/interfaces/nintondo-manager-provider';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import BigArrowRight from '@/assets/BigArrowRight.svg?react';

const SplitServicePage = () => {
  const { address, verifiedAddress } = useNintondoManagerContext();
  const [ords, setOrds] = useState<Ord[]>([]);
  const [loading, setLoading] = useState(false);

  const getUserInscriptions = useCallback(async (): Promise<Ord[]> => {
    const response = (await axios.get(`http://localhost:3001/offset_ords/address/${address}`)).data;
    return response.ords as Ord[];
  }, [address]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!address || !verifiedAddress) return;
      const ords = await getUserInscriptions();
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

  if (!ords.length)
    return (
      <div className={'bg-black'}>
        <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white'>
          You cannot split any ords
        </div>
      </div>
    );

  return (
    <div className={'bg-black'}>
      <div className='min-h-screen max-w-[1700px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white'>
        {ords.map((f, i) => (
          <div
            key={i}
            className='flex items-center'
          >
            <div className='flex flex-col p-3 m-3 border-[#191919] border-2 max-w-fit rounded-lg'>
              <p>Value: {(f.value / 10 ** 8).toFixed(4)} BEL</p>
              <p>Inscriptions: {f.inscriptions.length}</p>
              <p>Retrievable bells amount: {(f.available_to_free / 10 ** 8).toFixed(4)} BEL</p>
            </div>
            <BigArrowRight className='h-4' />
            <div className='flex flex-col p-3 m-3 max-w-fit rounded-lg gap-5'>
              <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg'>
                <span>Inscription(s):</span>
                <div className='flex gap-3 justify-center'>
                  {f.inscriptions.map((inscription, index) => (
                    <a
                      key={index}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex flex-col items-center gap-2'
                      href={`http://localhost:8111/pub/preview/${inscription.inscription_id}`}
                    >
                      <div className='w-28 h-28 overflow-hidden rounded-lg'>
                        <img
                          src={`http://localhost:8111/pub/preview/${inscription.inscription_id}`}
                          className='object-cover'
                        />
                      </div>
                      <span>Value: 0.001 BEL</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg'>
                <span>Retrievable balance:</span>
                <p>Value: {(f.available_to_free / 10 ** 8).toFixed(4)} BEL</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitServicePage;
