import { FC } from 'react';
import cn from 'classnames';
import { Ord } from '@/interfaces/nintondo-manager-provider';
import { OLD_PREVIEW_URL } from '@/consts';

interface SplitUtxoProps {
  switchToInscription: (ord: Ord, direction: 'next' | 'previous') => void;
  ord: Ord;
}

const SplitUtxo: FC<SplitUtxoProps> = ({ switchToInscription, ord }) => {
  return (
    <div className='flex flex-col p-3 m-3 max-w-fit rounded-lg gap-5'>
      <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg items-center'>
        <div className='p-2 flex items-center gap-3'>
          {ord.inscriptions.length > 1 && (
            <span
              onClick={() => switchToInscription(ord, 'next')}
              className='cursor-pointer'
            >
              &#10094;
            </span>
          )}
          <div className='flex gap-2 items-center'>
            <div className='w-20 h-20 overflow-hidden rounded-lg relative group'>
              <img
                src={`${OLD_PREVIEW_URL}/${
                  ord.inscriptions[ord.inscriptionIndex ?? 0].inscription_id
                }`}
                className='object-cover cursor-pointer'
              />
            </div>
            <div className={cn('flex flex-col')}>
              <span>Number: #{ord.inscriptions[ord.inscriptionIndex ?? 0].inscription_number}</span>
              <span>Value: 0.00001 BEL</span>
            </div>
          </div>
          {ord.inscriptions.length > 1 && (
            <span
              onClick={() => switchToInscription(ord, 'previous')}
              className='cursor-pointer'
            >
              &#10095;
            </span>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg'>
        <span>Retrievable balance:</span>
        <p>Value: {(ord.available_to_free / 10 ** 8).toFixed(4)} BEL</p>
      </div>
    </div>
  );
};

export default SplitUtxo;
