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
      className='bg-black text-white p-[8px] rounded-[30px] text-[20px] flex justify-center items-center border border-white hover:bg-gray-900'
    >
      <span className='mr-2'>
        <Icon />
      </span>
      {text}
    </a>
  );
};

export default DownloadLink;
