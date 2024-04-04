import { Ord } from '@/interfaces/nintondo-manager-provider';
import BigArrowRight from '@/assets/BigArrowRight.svg?react';
import { FC } from 'react';
import cn from 'classnames';
import { isValidBitcoinAddress } from '@/utils';
import { PREVIEW_URL } from '@/consts';

interface SplitVisualizerProps {
  selectedOrds: Ord[];
  setSelectedOrds: (ords: Ord[]) => void;
  removeSelectedOrdHandler: (ord: Ord) => void;
}

const SplitVisualizer: FC<SplitVisualizerProps> = ({
  selectedOrds,
  setSelectedOrds,
  removeSelectedOrdHandler,
}) => {
  const switchToInscription = (ord: Ord, direction: 'next' | 'previous') => {
    setSelectedOrds(
      selectedOrds.map((o) => {
        if (o.txid === ord.txid) {
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

  const updateSend = (ord: Ord) => {
    setSelectedOrds(selectedOrds.map((o) => (o.txid === ord.txid ? { ...o, send: ord.send } : o)));
  };

  if (!selectedOrds.length)
    return (
      <div className='flex min-w-[55%] h-128 items-center justify-center border-2 border-[#191919] rounded-lg p-4'>
        <p>Selected ords will appear here</p>
      </div>
    );

  return (
    <div className='flex flex-col min-w-[55%] border-2 border-[#191919] rounded-lg p-4'>
      <div className='flex flex-col'>
        <div className='w-full flex justify-between items-center'>
          <p className='text-lg font-medium'>Splits</p>
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
            {!f.send ? (
              <div className='flex flex-col p-3 m-3 max-w-fit rounded-lg gap-5'>
                <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg items-center'>
                  <div className='p-2 flex items-center gap-3'>
                    {f.inscriptions.length > 1 && (
                      <span
                        onClick={() => switchToInscription(f, 'next')}
                        className='cursor-pointer'
                      >
                        &#10094;
                      </span>
                    )}
                    <div className='flex gap-2 items-center'>
                      <div className='w-20 h-20 overflow-hidden rounded-lg relative group'>
                        <img
                          src={`${PREVIEW_URL}/${
                            f.inscriptions[f.inscriptionIndex ?? 0].inscription_id
                          }`}
                          className='object-cover cursor-pointer'
                        />
                      </div>
                      <div className={cn('flex flex-col')}>
                        <span>
                          Number: #{f.inscriptions[f.inscriptionIndex ?? 0].inscription_number}
                        </span>
                        <span>Value: 0.00001 BEL</span>
                      </div>
                    </div>
                    {f.inscriptions.length > 1 && (
                      <span
                        onClick={() => switchToInscription(f, 'previous')}
                        className='cursor-pointer'
                      >
                        &#10095;
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg'>
                  <span>Retrievable balance:</span>
                  <p>Value: {(f.available_to_free / 10 ** 8).toFixed(4)} BEL</p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col p-3 w-3/5 gap-1'>
                <span className='text-sm'>Enter receivers address</span>
                <input
                  type='text'
                  className={cn('p-2 bg-black border-2 border-[#191919] rounded-lg', {
                    'border-red-500': !f.verifiedSendAddress && f.send,
                    'border-lime-500': f.verifiedSendAddress && f.send,
                  })}
                  value={f.sendToAddress}
                  onChange={(e) => {
                    setSelectedOrds(
                      selectedOrds.map((o) =>
                        o.txid === f.txid
                          ? {
                              ...o,
                              sendToAddress: e.target.value.trim(),
                              verifiedSendAddress: isValidBitcoinAddress(e.target.value.trim()),
                            }
                          : o,
                      ),
                    );
                    setTimeout(() => {
                      console.log(selectedOrds);
                    }, 100);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitVisualizer;
