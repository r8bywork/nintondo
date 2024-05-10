import React, { useEffect, useState } from 'react';
import ArrowSVG from '../../../assets/filters/filterarrow.svg?react';

interface FilterRangeProps {
  min: number | string | 0;
  max: number | string | 'max';
  onRangeChange: (filter: string) => void;
}

const FilterRange = ({ min, max, onRangeChange }: FilterRangeProps) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState<number | string | 'max'>(max);

  useEffect(() => {
    const handler = setTimeout(() => {
      onRangeChange(`${minValue},${maxValue}`);
    }, 500);

    return () => clearTimeout(handler);
  }, [minValue, maxValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, isMin: boolean) => {
    let { value } = e.target;
    value = value.replace(/[^0-9]/g, '');
    if (value.startsWith('0') && value !== '0') {
      value = value.replace(/^0+/, '');
    }
    if (isMin) {
      setMinValue(value || '0');
    } else {
      setMaxValue(value || 'max');
    }
  };

  return (
    <div className='flex items-center px-[8px] text-[16px] font-bold leading-[16px] text-black bg-black'>
      <div className='px-[10px] bg-white rounded-full'>
        <input
          type='number'
          value={minValue}
          min={0}
          onChange={(e) => handleChange(e, true)}
          className='text-center focus:outline-none'
          style={{ maxWidth: '70px', width: `${Math.max(String(minValue).length, 1)}ch` }}
        />
      </div>

      <ArrowSVG className='mx-2' />

      <div className='px-[10px] bg-white rounded-full'>
        <input
          type='number'
          value={maxValue === 'max' ? '' : maxValue}
          onChange={(e) => handleChange(e, false)}
          placeholder='Max'
          className='text-center focus:outline-none focus:placeholder-black/50 placeholder-black max-w-[300px]'
          style={{
            maxWidth: '70px',
            width: `${Math.max(String(maxValue).length || 'Max'.length, 1)}ch`,
          }}
        />
      </div>
    </div>
  );
};

export default FilterRange;
