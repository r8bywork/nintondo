import styles from './ToggleSwitch.module.scss';

interface ToggleSwitchProps {
  isChecked: boolean;
  onToggle: () => void;
  title?: string;
}

const ToggleSwitch = ({ isChecked, title, onToggle }: ToggleSwitchProps) => {
  return (
    <div className={styles.switchContainer}>
      {title && <span className={styles.title}>{title}</span>}
      <label className={styles.switch}>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={onToggle}
        />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
