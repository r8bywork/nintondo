import { Ord } from '@/interfaces/nintondo-manager-provider';
import { FC } from 'react';

interface UtxoSelectorProps {
  ords: Ord[];
  selectOrdHandler: (ord: Ord) => void;
  selectedAll: boolean;
  setSelectedAll: () => void;
}

const UtxoSelector: FC<UtxoSelectorProps> = ({
  ords,
  selectOrdHandler,
  selectedAll,
  setSelectedAll,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <div className='flex flex-col min-w-[45%]'>
      <div className='w-full flex justify-between items-center'>
        <p className='text-lg font-medium'>Select utxos to split</p>
        <div className='flex justify-center gap-3 items-center'>
          <input
            type='checkbox'
            checked={selectedAll}
            className='p-3 cursor-pointer'
            onChange={() => {
              setSelectedAll();
            }}
          />
          <span className='text-lg font-medium'>Select all</span>
        </div>
      </div>
      {!ords.length && (
        <div className='flex justify-center items-center min-h-128'>
          <p>No ords to select</p>
        </div>
      )}
      <div className='grid grid-cols-2 max-h-192 overflow-y-scroll custom_scrollbar_container'>
        {ords.map((f, i) => (
          <div
            key={i}
            className='flex items-center'
            onClick={() => selectOrdHandler(f)}
          >
            <div className='flex flex-col p-3 m-3 border-[#191919] border-2 max-w-fit rounded-lg cursor-pointer hover:border-[#53DCFF] transition-all'>
              <p>Value: {(f.value / 10 ** 8).toFixed(4)} BEL</p>
              <p>Inscriptions: {f.inscriptions.length}</p>
              <p>Retrievable bells amount: {(f.available_to_free / 10 ** 8).toFixed(4)} BEL</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UtxoSelector;
