import React, { useEffect, useState } from 'react';

interface FilterAccountProps {
    text: number | string | '';
    onClick: (filter: string) => void;
}

const FilterAccount = ({ text, onClick }: FilterAccountProps) => {
    const [value, setValue] = useState<number | string>(text);

  useEffect(() => {
    const handler = setTimeout(() => {
        onClick(`${value}`);
    }, 500);

    return () => clearTimeout(handler);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    setValue(value);
    // value = value.replace(/[^0-9]/g, '');
    // if (value.startsWith('0') && value !== '0') {
    //   value = value.replace(/^0+/, '');
    // }
    // if (isMin) {
    //   setMinValue(value || '0');
    // } else {
    //   setMaxValue(value || 'max');
    // }
  };

  return (
    <div className='flex items-center px-[8px] text-[16px] font-bold leading-[16px] text-black bg-black'>
      <div className='px-[10px] bg-white rounded-full'>
        <input
          type='text'
          value={value}
          onChange={(e) => handleChange(e)}
          className='text-center focus:outline-none'
          placeholder='all'
          style={{ maxWidth: '120px', width: `120px` }}
        />
      </div>
    </div>
  );
};

export default FilterAccount;
