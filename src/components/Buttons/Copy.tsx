import { ComponentType, SVGProps, useState } from 'react';

interface CopyProps {
  text?: string;
  SvgIcon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const Copy = ({ text, SvgIcon }: CopyProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text ?? '');
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };
  return (
    <div className='relative'>
      <SvgIcon
        className='cursor-copy'
        onClick={copyToClipboard}
      />

      {showTooltip && (
        <div className='absolute top-0 left-0 bg-black text-white px-2 py-1 rounded-md ml-[-30px] mt-[-2.5rem]'>
          Copied!
        </div>
      )}
    </div>
  );
};
export default Copy;
