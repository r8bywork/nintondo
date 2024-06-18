import { Ord, OriginalOrd } from '@/interfaces/nintondo-manager-provider';
import BigArrowRight from '@/assets/BigArrowRight.svg?react';
import { Dispatch, FC, SetStateAction } from 'react';
import SplitUtxo from './components/SplitUtxo';
import SendUtxo from './components/SendUtxo';
import Search from '@/pages/components/Search/Search';
import { useGetRawHex } from '@/hooks/explorerapi';
import { transformOrd } from '@/utils';

interface SplitVisualizerProps {
  selectedOrds: Ord[];
  setSelectedOrds: (ords: Ord[]) => void;
  removeSelectedOrdHandler: (ord: Ord) => void;
  onHistoryClick: () => void;
  setOrds: Dispatch<SetStateAction<Ord[]>>;
}

const SplitVisualizer: FC<SplitVisualizerProps> = ({
  setOrds,
  selectedOrds,
  setSelectedOrds,
  removeSelectedOrdHandler,
  onHistoryClick,
}) => {
  const getRawHex = useGetRawHex()
  const switchToInscription = (ord: Ord, direction: 'next' | 'previous') => {
    setSelectedOrds(
      selectedOrds.map((o) => {
        if (o.txid === ord.txid && o.vout === ord.vout) {
          const maxIndex = o.inscriptions.length - 1;
          let newIndex = o.inscriptionIndex ?? 0;
          if (direction === 'next') {
            newIndex = newIndex < maxIndex ? newIndex + 1 : 0;
          } else {
            newIndex = newIndex > 0 ? newIndex - 1 : maxIndex;
          }
          return { ...o, inscriptionIndex: newIndex };
        }
        return o;
      }),
    );
  };

  const pressOrds = async (ord: OriginalOrd) => {
    const raw_hex = await getRawHex(ord.txid)
    if (!selectedOrds || !setSelectedOrds) return
    const existingOrd = selectedOrds.find(f => f.txid === ord.txid);
    if (!existingOrd && raw_hex) {
      setSelectedOrds([...selectedOrds, transformOrd(ord, raw_hex)]);
      setOrds((prev: Ord[]): Ord[] => {
        const index = prev.findIndex((f) => f.txid === ord.txid && f.vout === ord.vout);
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      });
    }
  }

  const updateSend = (ord: Ord) => {
    setSelectedOrds(
      selectedOrds.map((o) =>
        o.txid === ord.txid && o.vout === ord.vout ? { ...o, send: ord.send } : o,
      ),
    );
  };

  if (!selectedOrds.length)
    return (
      <div className='flex flex-col min-w-[55%] border-2 border-[#191919] rounded-lg p-4'>
        <div className='w-full flex justify-between items-center max-md:flex-col max-md:gap-[20px] pb-[15px]'>
          <p className='text-lg font-medium'>Splits</p>
          <div className='max-w-[600px] w-full mx-[15px]'>
            <Search placeholder='txid' utxo={true} pressResults={pressOrds} />
          </div>
          <button
            className={
              'text-[20px] flex items-center border px-[20px] py-[6px] gap-[10px] leading-[21px] transition rounded-[50px]'
            }
            onClick={onHistoryClick}
          >
            History
          </button>
        </div>
        <div className='flex-1 flex justify-center items-center'>
          <p>Selected ords will appear here</p>
        </div>
      </div>
    );

  return (
    <div className='flex flex-col min-w-[55%] border-2 border-[#191919] rounded-lg p-4'>
      <div className='flex flex-col pb-[]'>
        <div className='w-full flex justify-between items-center pb-[15px]'>
          <p className='text-lg font-medium'>Splits</p>
          <div className='max-w-[600px] w-full mx-[15px]'>
            <Search placeholder='txid' utxo={true} pressResults={pressOrds} />
          </div>
          <button
            className={
              'text-[20px] flex border items-center px-[20px] py-[6px] gap-[10px] leading-[21px] transition rounded-[50px]'
            }
            onClick={onHistoryClick}
          >
            History
          </button>
        </div>
      </div>

      <div className='flex flex-col max-h-160 overflow-y-scroll custom_scrollbar_container items-center w-full'>
        {selectedOrds.map((f, i) => (
          <div
            key={i}
            className='flex items-center'
          >
            <div className='flex flex-col items-center'>
              <div className='flex flex-col p-3 m-3 border-[#191919] border-2 max-w-fit rounded-lg'>
                <p>Value: {(f.value / 10 ** 8).toFixed(4)} BEL</p>
                <p>Inscriptions: {f.inscriptions.length}</p>
                <p>Retrievable bells amount: {(f.available_to_free / 10 ** 8).toFixed(4)} BEL</p>
              </div>
              <div className='flex justify-evenly w-full align-center'>
                <div
                  onClick={() => removeSelectedOrdHandler(f)}
                  className='cursor-pointer hover:text-red-700 transition-all'
                >
                  &#10005; Remove
                </div>
                <div
                  onClick={() =>
                    updateSend({
                      ...f,
                      send: f.send ? false : true,
                    })
                  }
                  className='cursor-pointer hover:text-[#53DCFF] transition-all'
                >
                  {f.send ? 'Split' : 'Send'}
                </div>
              </div>
            </div>
            <BigArrowRight className='h-4' />
            <div className='h-60 w-96 flex justify-center items-center'>
              {!f.send ? (
                <SplitUtxo
                  ord={f}
                  switchToInscription={switchToInscription}
                />
              ) : (
                <SendUtxo
                  selectedOrds={selectedOrds}
                  ord={f}
                  setSelectedOrds={setSelectedOrds}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitVisualizer;
