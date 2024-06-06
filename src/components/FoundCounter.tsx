import cn from 'classnames';

interface FoundCounterProps {
  count?: number;
  customText: string;
  classNames?: string;
}

const FoundCounter = ({ count, customText, classNames }: FoundCounterProps) => {
  return (
    <span className={cn('flex items-center text-[#4B4B4B] font-16px gap-2', classNames)}>
      Found{' '}
      {count ? (
        <span className={'text-white'}>{Number(count).toLocaleString() + ' '}</span>
      ) : (
        <span className='w-6 h-3 bg-slate-800 animate-pulse inline-block'></span>
      )}
      {customText}
    </span>
  );
};

export default FoundCounter;
