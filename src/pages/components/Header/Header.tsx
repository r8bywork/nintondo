import Link from '../../../components/Buttons/Link.tsx';
import { useState, useEffect, useRef } from 'react';
import './Header.css';
import { HeaderLinks, HeaderLinksMarketPlace } from '../../../settings/settings.ts';
import cn from 'classnames';
import { useNintondoManagerContext } from '../../../utils/bell-provider.tsx';
import { useLocation } from 'react-router-dom';
import { Header } from '../../../interfaces/intefaces.ts';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { address, connectWallet } = useNintondoManagerContext();
  const [config, setConfig] = useState<Header[]>(HeaderLinks);
  const location = useLocation();

  useEffect(() => {
    location.pathname.startsWith('/marketplace')
      ? setConfig(HeaderLinksMarketPlace)
      : setConfig(HeaderLinks);
  }, [location]);

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
      style={{ background: 'linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.00) 100%)' }}
      className={cn('header', { 'menu-open': isMenuOpen })}
    >
      <div className='flex justify-between w-[100%] items-center'>
        <Link
          href='/public'
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
          hidden: !isMenuOpen,
        })}
      >
        {config.map((link) => (
          <Link
            key={link.name}
            text={link.name}
            href={link.url}
            className={cn('md:[&:not(:last-child)]:mr-28 text-white', {
              ['text-yellow-500 underline']: location.pathname === link.url,
            })}
            onClick={toggleMenu}
          />
        ))}
        {!address ? (
          <div className='text-white text-base font-bold leading-normal hover:text-yellow-500 transition-all duration-300 ease-in-out'>
            <button
              className='btn'
              onClick={connectWallet}
            >
              CONNECT
            </button>
          </div>
        ) : null}
      </nav>
    </div>
  );
};

export default Header;
