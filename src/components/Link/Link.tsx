interface LinkProps {
  href: string;
  text: string;
  className?: string;
}

const Link = ({ href, text, className }: LinkProps) => {
  return (
    <a
      href={href}
      target={href.startsWith('#') ? '_self' : '_target'}
      className={`text-base font-bold leading-normal hover:text-yellow-500 transition-all duration-300 ease-in-out hover:underline ${className}`}
      style={{
        textDecorationColor: '#FBBF24',
        textDecorationThickness: '2px',
        textUnderlineOffset: '8px',
      }}
    >
      {text.toUpperCase()}
    </a>
  );
};

export default Link;
