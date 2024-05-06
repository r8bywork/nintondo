import { useEffect, useState } from 'react';

export const useModal = (defaultValue?: boolean) => {
  const [isOpen, setIsOpen] = useState(defaultValue || false);

  const handleClose = () => {
    // enable scroll
    document.body.classList.remove('mobile-scroll-disable');

    setIsOpen(false);
  };

  const handleOpen = () => {
    // disable scroll from page
    // handleClose make scroll available again
    document.body.classList.add('mobile-scroll-disable');

    setIsOpen(true);
  };

  useEffect(() => {
    const closeModalOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', closeModalOnKeyDown);

    return () => {
      // force enable scroll when dismounted
      document.body.classList.remove('mobile-scroll-disable');
      document.removeEventListener('keydown', closeModalOnKeyDown);
    };
  }, []);

  return {
    open: handleOpen,
    close: handleClose,
    isOpen,
  };
};
