import cn from 'classnames';
import CopySvg from '../../../assets/copy.svg?react';
import { truncate } from '../../../settings/utils';
interface InfoBlockProps {
  title?: string;
  classNames?: string;
  hash?: string;
  SvgIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
        <p className={'max-md:hidden break-all bg-black text-[#53DCFF] text-[14px] mr-[5px]'}>
          {hash}
        </p>
        <p className={'md:hidden bg-black text-[#53DCFF] text-[14px] mr-[5px]'}>
          {truncate(hash ?? '', {
            nPrefix: 20,
            nSuffix: 20,
          })}
        </p>

        <CopySvg onClick={() => navigator.clipboard.writeText(hash ?? '')} />
      </div>
    </div>
  );
};

export default InfoBlock;
