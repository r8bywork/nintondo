interface ButtonProps {
  onClick?: () => void;
  text?: string;
  SvgIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url?: string;
  className?: string;
}

const Button = ({ onClick, text, SvgIcon, url, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-44 h-9 flex-shrink-0 rounded-full bg-gradient-to-r from-white to-yellow-400 flex items-center ${className}`}
    >
      <div className='w-13 h-13 rounded-full bg-white flex items-center justify-center mr-2'>
        <SvgIcon />
      </div>
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-[#1D2127] text-center font-inconsolata text-24px font-bold leading-normal'
      >
        {text?.toUpperCase()}
      </a>
    </button>
  );
};

export default Button;
