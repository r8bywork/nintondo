import { useEffect, useState } from 'react';

interface ModalOptions {
  mobileScrollDisable: boolean;
}

export const useModal = (defaultValue?: boolean, options?: ModalOptions) => {
  const [isOpen, setIsOpen] = useState(defaultValue || false);

  const scrollClass = options?.mobileScrollDisable ? 'mobile-scroll-disable' : 'scroll-disable';

  const handleClose = () => {
    // enable scroll
    document.body.classList.remove(scrollClass);

    setIsOpen(false);
  };

  const handleOpen = () => {
    // disable scroll from page
    // handleClose make scroll available again
    document.body.classList.add(scrollClass);

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
      document.body.classList.remove(scrollClass);
      document.removeEventListener('keydown', closeModalOnKeyDown);
    };
  }, []);

  return {
    open: handleOpen,
    close: handleClose,
    isOpen,
  };
};
