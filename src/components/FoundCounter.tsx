import cn from 'classnames';

interface FoundCounterProps {
  count: number;
  customText: string;
  classNames?: string;
}
const FoundCounter = ({ count, customText, classNames }: FoundCounterProps) => {
  return (
    <span className={cn('text-[#4B4B4B] font-16px', classNames)}>
      Found <span className={'text-white'}>{Number(count).toLocaleString()}</span> {customText}
    </span>
  );
};

export default FoundCounter;
