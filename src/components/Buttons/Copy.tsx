import { ComponentType, SVGProps, useState } from 'react';
import cn from 'classnames';
import toast from 'react-hot-toast';

interface CopyProps {
  text?: string;
  SvgIcon: ComponentType<SVGProps<SVGSVGElement>>;
  svgClassname?: string;
  useToast?: boolean;
}

export const Copy = ({ text, SvgIcon, svgClassname, useToast = false }: CopyProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const copyToClipboard = () => {
    if (useToast) {
      toast('Copied!');
      return;
    }
    navigator.clipboard.writeText(text ?? '');
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };
  return (
    <div className='relative'>
      <SvgIcon
        className={cn('cursor-copy', svgClassname)}
        onClick={copyToClipboard}
      />

      {showTooltip && (
        <div
          className={cn(
            'absolute top-0 left-0 bg-black text-white px-2 py-1 rounded-md ml-[-30px] mt-[-2.5rem]',
          )}
        >
          Copied!
        </div>
      )}
    </div>
  );
};
export default Copy;
