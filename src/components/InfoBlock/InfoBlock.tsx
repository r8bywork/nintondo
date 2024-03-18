import cn from 'classnames';
import CopySvg from '../../assets/copy.svg?react';
import { truncate } from '../../settings/utils.ts';
import Copy from '../Copy/Copy.tsx';
import { ComponentType, SVGProps } from 'react';

interface InfoBlockProps {
  title?: string;
  classNames?: string;
  hash?: string;
  SvgIcon: ComponentType<SVGProps<SVGSVGElement>>;
}

const InfoBlock = ({ title, classNames, hash, SvgIcon }: InfoBlockProps) => {
  return (
    <div className={cn(classNames, 'text-black')}>
      <div
        style={{ background: 'var(--GRD, linear-gradient(90deg, #FFF 0%, #FB0 99.07%))' }}
        className={'flex items-center rounded-[32px] w-fit px-[20px] mb-[15px]'}
      >
        <SvgIcon className='mr-[15px]' />
        <p className=' text-[24px] font-bold'>{title}</p>
      </div>

      <div className={'flex items-center mb-[16px]'}>
        <p
          className={
            'max-md:hidden px-[10px] rounded-[10px] break-all bg-black text-[#53DCFF] text-[16px] mr-[5px]'
          }
        >
          {hash}
        </p>
        <p
          className={
            'md:hidden px-[5px] rounded-[10px] bg-black text-[#53DCFF] text-[14px] mr-[5px]'
          }
        >
          {truncate(hash ?? '', {
            nPrefix: 15,
            nSuffix: 15,
          })}
        </p>

        <Copy
          text={hash}
          SvgIcon={CopySvg}
        />
      </div>
    </div>
  );
};

export default InfoBlock;
