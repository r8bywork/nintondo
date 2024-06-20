import './ToogleSwitch.css';

interface ToggleSwitchProps {
  isChecked: boolean;
  onToggle: () => void;
  title?: string;
}

const ToggleSwitch = ({ isChecked, title, onToggle }: ToggleSwitchProps) => {
  return (
    <div className='flex text-[18px] gap-[10px] items-center'>
      <span>{title}</span>
      <label className='switch'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={onToggle}
        />
        <span className='slider round'></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
