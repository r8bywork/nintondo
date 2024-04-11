import { FC } from 'react';

interface CardSkeletonProps {
  BigCard?: boolean;
}

const CardSkeleton: FC<CardSkeletonProps> = () => {
  return (
    <div
      className={
        'flex flex-col w-[200px] bg-[#1A1A1A] rounded-[15px] p-[10px] border border-black border-opacity-60 bg-black/10 backdrop-blur-md absolute h-[271px]'
      }
    >
      {/* <div className='size-[180px] border border-black border-opacity-80 rounded-[15px] backdrop-blur-md'></div>
      <div className='w-[180px] h-[21px] mt-[18px] mb-[16px] border border-black border-opacity-80 rounded-[15px] backdrop-blur-md'></div>
      <div className='w-[180px] h-[16px]'>
        <div className='rounded-[5px] border-[1px] flex items-center px-[5px] mr-[8px] leading-[14px] border-[#FFBB00] text-[14px] leading-[14px] w-[40px] h-[16px] backdrop-blur-md'></div>
      </div> */}
    </div>
  );
};

export default CardSkeleton;
