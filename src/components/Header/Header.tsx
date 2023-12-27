import Link from '../Link/Link';
import { useState, useEffect, useRef } from 'react';
import './Header.css';
import { HeaderLinks } from '../../settings/settings.ts';
import cn from 'classnames';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      ref={headerRef}
      className={cn('header', { 'menu-open': isMenuOpen })}
    >
      <div className='flex justify-between w-[100%] items-center'>
        <Link
          href='/'
          text='NINTONDO.IO'
          className='text-yellow-500 text-2xl font-bold leading-normal text-shadow-md'
        />
        <div
          className={cn('burger-menu', { open: isMenuOpen }, 'md:hidden')}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav
        className={cn('max-md:pb-[20px] md:flex', {
          // max-md:absolute
          // max-md:bg-[#061D3C]
          hidden: !isMenuOpen,
        })}
      >
        {HeaderLinks.map((link) => (
          <Link
            key={link.name}
            text={link.name}
            href={link.url}
            className='md:[&:not(:last-child)]:mr-28 text-white'
            onClick={toggleMenu}
          />
        ))}
      </nav>
    </div>
  );
};

export default Header;
