import Link from '@/components/Buttons/Link.tsx';
import { useState, useEffect, useRef } from 'react';
import './Header.css';
import { IHeader, HeaderLinks, HeaderLinksMarketPlace } from '@/settings/settings.ts';
import cn from 'classnames';
import { useNintondoManagerContext } from '@/utils/bell-provider.tsx';
import { NavLink, useLocation } from 'react-router-dom';
import { shortAddress } from '@/utils/index.ts';
import DropdownIcon from '@/assets/dropdown.svg?react';
import DroprightIcon from '@/assets/dropright.svg?react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverButtonRef = useRef<HTMLDivElement | null>(null);
  const {
    nintondoExists,
    address,
    verifyAddress,
    connectWallet,
    verifiedAddress,
    getPublicKey,
    disconnect,
  } = useNintondoManagerContext();
  const [config, setConfig] = useState<IHeader[]>(HeaderLinks);
  const location = useLocation();
  const [showPopover, setShowPopover] = useState<boolean>(false);

  useEffect(() => {
    location.pathname.startsWith('/marketplace')
      ? setConfig(HeaderLinksMarketPlace)
      : setConfig(HeaderLinks);
  }, [location]);

  useEffect(() => {
    (async () => {
      if (nintondoExists && address === undefined && (await getPublicKey()) !== undefined)
        await connectWallet();
    })();
  }, [nintondoExists, address]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        popoverRef.current &&
        popoverButtonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !popoverButtonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
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
          className={cn('burger-menu', { open: isMenuOpen }, 'lg:hidden')}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav
        className={cn('max-lg:pb-[20px] lg:flex lg:items-center', {
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
        {!verifiedAddress ? (
          <div className='text-white text-base font-bold leading-normal hover:text-yellow-500 transition-all duration-300 ease-in-out'>
            <button
              className='btn'
              onClick={verifyAddress}
            >
              CONNECT
            </button>
          </div>
        ) : (
          <div className='relative'>
            <div
              ref={popoverButtonRef}
              onClick={() => setShowPopover((prev) => !prev)}
              className='flex gap-3 items-center text-white text-base font-bold leading-normal hover:text-yellow-500 transition-all duration-300 ease-in-out border-2 border-[#191919] rounded-lg px-2 cursor-pointer'
            >
              {shortAddress(address)} <DropdownIcon className='w-3' />
            </div>
            {showPopover && (
              <div
                ref={popoverRef}
                className='absolute bg-[#1A1A1A] text-white p-4 rounded-lg mt-2 z-10 animate-[slide-in_0.1s_ease-out] -left-1/3 w-[150%] flex flex-col items-center justify-center gap-2'
              >
                <div className='text-white hover:text-yellow-500 cursor-pointer'>
                  <NavLink
                    className='flex items-center gap-3'
                    to='/split-service'
                    onClick={() => setShowPopover(false)}
                  >
                    Split inscriptions <DroprightIcon className='w-3' />
                  </NavLink>
                </div>
                <div
                  className='flex items-center gap-3 text-white hover:text-yellow-500 cursor-pointer'
                  onClick={async () => {
                    setShowPopover(false);
                    await disconnect();
                  }}
                >
                  Disconnect
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
