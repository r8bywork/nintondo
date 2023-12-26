import { ComponentType, SVGProps } from 'react';

interface IProps {
  text: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
}

const DownloadLink = ({ text, Icon, href }: IProps) => {
  return (
    <a
      href={href}
      className='bg-black text-white h-[80px] p-[8px] rounded-[12px] text-[18px] flex justify-center items-center'
    >
      <span className='mr-[8px]'>
        <Icon />
      </span>
      {text}
    </a>
  );
};

export default DownloadLink;
