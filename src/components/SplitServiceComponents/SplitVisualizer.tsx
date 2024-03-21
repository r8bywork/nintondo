import { Ord } from '@/interfaces/nintondo-manager-provider';
import BigArrowRight from '@/assets/BigArrowRight.svg?react';
import { FC } from 'react';

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

  if (!selectedOrds.length)
    return (
      <div className='flex min-w-[55%] h-128 items-center justify-center'>
        <p>Selected ords will appear here</p>
      </div>
    );

  return (
    <div className='flex flex-col min-w-[55%]'>
      <div className='flex flex-col'>
        <div className='w-full flex justify-center items-center'>
          <p className='text-lg font-medium'>Splits</p>
        </div>
      </div>

      <div className='flex flex-col max-h-192 overflow-y-scroll custom_scrollbar_container'>
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
              <div
                onClick={() => removeSelectedOrdHandler(f)}
                className='cursor-pointer'
              >
                &#10005; Remove
              </div>
            </div>
            <BigArrowRight className='h-4' />
            <div className='flex flex-col p-3 m-3 max-w-fit rounded-lg gap-5'>
              <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg'>
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
                    <div className='w-20 h-20 overflow-hidden rounded-lg'>
                      <a
                        target='_blank'
                        href={`http://localhost:8111/pub/preview/${
                          f.inscriptions[f.inscriptionIndex ?? 0].inscription_id
                        }`}
                        rel='noopener noreferrer'
                      >
                        <img
                          src={`http://localhost:8111/pub/preview/${
                            f.inscriptions[f.inscriptionIndex ?? 0].inscription_id
                          }`}
                          className='object-cover'
                        />
                      </a>
                    </div>
                    <div className='flex flex-col'>
                      <span>
                        Number: #{f.inscriptions[f.inscriptionIndex ?? 0].inscription_number}
                      </span>
                      <span>Value: 0.001 BEL</span>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitVisualizer;
