import { ChangeEvent, ReactNode } from 'react';
import { Slider } from '../Controls/Slider';

export interface BottomSelectProps {
  children: ReactNode;
  onChange: (length: number) => void;
  selectedCount: number;
  dataCount: number;
}

export const BottomSelect = ({
  children,
  dataCount,
  selectedCount,
  onChange,
}: BottomSelectProps) => {
  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);

    onChange(value);
  };

  return (
    <div className='fixed flex justify-center items-center w-screen bottom-0 left-0 bg-[rgba(0,0,0,0.2)] backdrop-blur-xl border-t-[1px] border-[#191919]'>
      <div className='max-w-[1390px] flex items-center justify-between p-5 w-full max-medium:flex-col gap-[18px]'>
        <div className='items-center flex gap-2 font-bold text-[16px] border-[1px] border-white rounded-[30px] h-[32px] w-[336px] max-medium:w-full justify-center px-[15px]'>
          {dataCount && (
            <>
              <Slider
                min={0}
                max={dataCount}
                value={selectedCount}
                onChange={handleSliderChange}
              />
              <span className='w-[16px] text-[18px]'>{selectedCount}</span>
            </>
          )}
        </div>
        <div className='flex gap-[18px] max-medium:flex-col max-medium:w-full'>{children}</div>
      </div>
    </div>
  );
};
