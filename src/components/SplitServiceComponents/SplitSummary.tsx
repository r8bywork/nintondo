import { useSplitOrds } from '@/hooks/split';
import { Ord } from '@/interfaces/nintondo-manager-provider';
import { FC } from 'react';

interface SplitSummaryProps {
  selectedOrds: Ord[];
}

const SplitSummary: FC<SplitSummaryProps> = ({ selectedOrds }) => {
  const splitOrds = useSplitOrds();

  if (!selectedOrds.length) return;

  return (
    <div className='max-w-fit flex flex-col items-center text-lg border-2 border-[#191919] rounded-lg p-4 gap-1'>
      <div>
        <p>Total utxos to split: {selectedOrds.length}</p>
        <p>
          Total inscriptions: {selectedOrds.reduce((acc, val) => acc + val.inscriptions.length, 0)}
        </p>
        <p>
          Total save inscriptions:{' '}
          {selectedOrds.reduce(
            (acc, val) => (acc += val.inscriptions.filter((f) => !f.burn).length),
            0,
          )}
        </p>
        <p>
          Total bells save:{' '}
          <span className='text-lime-500'>
            {selectedOrds.reduce((acc, val) => acc + val.available_to_free, 0) / 10 ** 8} BEL
          </span>
        </p>
      </div>
      <button
        className='m-2 px-8 py-0.5 border-[1px] rounded-lg max-w-fit hover:border-[#53DCFF] transition-all'
        onClick={() => splitOrds(selectedOrds)}
      >
        Split
      </button>
    </div>
  );
};

export default SplitSummary;
