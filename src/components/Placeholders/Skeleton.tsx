import cn from 'classnames';
import Logo from '../../assets/bells.svg?react';
interface SkeletonProps {
  classNames?: string;
}
const Skeleton = ({ classNames }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'w-full max-w-7xl flex items-center h-[480px] border border-opacity-60 rounded-[12px] border-white bg-black/10 backdrop-blur-md relative',
        classNames,
      )}
    >
      <div className={'rounded-full mx-auto animate-bounce'}>
        <Logo className='h-[100px] w-[100px]' />
      </div>
    </div>
  );
};

export default Skeleton;
