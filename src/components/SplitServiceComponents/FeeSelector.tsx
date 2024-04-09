import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { Fees } from '@/interfaces/api';

interface FeeSelectorProps {
  onChange: (value: number | string) => void;
  value: number | string;
  feeRates: Fees;
}

const FeeSelector: FC<FeeSelectorProps> = ({ onChange, value, feeRates }) => {
  const [selected, setSelected] = useState<number | undefined>(feeRates.fast);

  const cards = [
    {
      title: 'Slow',
      description: `${feeRates?.slow ?? '~'} sat/Vb`,
      value: feeRates?.slow ?? 10,
    },
    {
      title: 'Fast',
      description: `${feeRates?.fast ?? '~'} sat/Vb`,
      value: feeRates?.fast ?? 100,
    },
    {
      title: 'Custom',
      value: undefined,
    },
  ];

  useEffect(() => {
    if (selected !== undefined) {
      onChange(selected);
    }
  }, [selected, onChange]);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col border-2 border-[#191919] rounded-lg p-4 gap-3'>
        <p>Select fee rate</p>
        <div className='flex items-center cursor-pointer gap-6'>
          {cards.map((f, i) => (
            <FeeCard
              key={i}
              description={f.description}
              title={f.title}
              onSelect={() => setSelected(f.value as typeof selected)}
              selected={f.value === selected}
            />
          ))}
        </div>
      </div>
      <input
        type='number'
        className={cn('p-4 border-2 border-[#191919] rounded-lg bg-black text-white w-full', {
          hidden: selected !== undefined,
        })}
        placeholder='sat/Vb'
        value={value}
        onChange={(e) => {
          onChange(e.target.value === '' ? '' : Number(e.target.value));
        }}
      />
    </div>
  );
};

interface FeeCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string | undefined;
}

const FeeCard: FC<FeeCardProps> = ({ selected, onSelect, title, description }) => {
  return (
    <div
      className={cn(
        'bg-[#191919] rounded-lg p-2 w-36 h-16 flex flex-col justify-center border-2 border-[#191919]',
        {
          ['border-[#53DCFF]']: selected,
        },
      )}
      onClick={onSelect}
    >
      <div className={cn('')}>{title}</div>
      {description ? <div className=''>{description}</div> : ''}
    </div>
  );
};

export default FeeSelector;
