import { Ord } from '@/interfaces/nintondo-manager-provider';
import { FC } from 'react';

interface SplitSummaryProps {
  selectedOrds: Ord[];
}

const SplitSummary: FC<SplitSummaryProps> = ({ selectedOrds }) => {
  if (!selectedOrds.length) return undefined;

  return (
    <div className='max-w-fit flex flex-col text-lg border-2 border-[#191919] rounded-lg p-4'>
      <p>Total utxos to split: {selectedOrds.length}</p>
      <p>
        Total inscriptions: {selectedOrds.reduce((acc, val) => acc + val.inscriptions.length, 0)}
      </p>
      <p>
        Total bells save:{' '}
        <span className='text-lime-500'>
          {selectedOrds.reduce((acc, val) => acc + val.available_to_free, 0) / 10 ** 8} BEL
        </span>
      </p>
    </div>
  );
};

export default SplitSummary;
