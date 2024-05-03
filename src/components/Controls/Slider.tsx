import { ChangeEvent } from 'react';
import './Slider.css';

interface SliderProps {
  value: number;
  max: number;
  min: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Slider = ({ value, min, max, onChange }: SliderProps) => {
  const progress = (value / max) * 100;

  return (
    <input
      type='range'
      className='styled-range'
      max={max}
      min={min}
      value={value}
      style={{
        background: `linear-gradient(to right, #FFFFFF ${progress}%, #4b4b4b ${progress}%)`,
      }}
      onChange={onChange}
    />
  );
};
