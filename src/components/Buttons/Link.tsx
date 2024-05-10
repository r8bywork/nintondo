import { NavLink } from 'react-router-dom';

interface LinkProps {
  href: string;
  text: string;
  className?: string;
  onClick?: () => void;
}

const Link = ({ href, text, className, onClick }: LinkProps) => {
  if (href.startsWith('/')) {
    return (
      <NavLink
        to={href}
        onClick={onClick}
        className={`text-base font-bold leading-normal hover:text-yellow-500 transition-all duration-300 ease-in-out hover:underline ${className}`}
        style={{
          textDecorationColor: '#FBBF24',
          textDecorationThickness: '2px',
          textUnderlineOffset: '8px',
        }}
      >
        {text.toUpperCase()}
      </NavLink>
    );
  }

  return (
    <a
      href={href}
      target={href[2] === '#' ? '_self' : '_target'}
      onClick={onClick}
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
