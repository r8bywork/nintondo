import { useCallback, useEffect, useState } from 'react';

interface ModalOptions {
  mobileScrollDisable: boolean;
}

export const useModal = (defaultValue?: boolean, options?: ModalOptions) => {
  const [isOpen, setIsOpen] = useState(defaultValue || false);

  const scrollClass = options?.mobileScrollDisable ? 'mobile-scroll-disable' : 'scroll-disable';

  const closeModalOnKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, []);

  const handleClose = useCallback(() => {
    // enable scroll
    document.body.classList.remove(scrollClass);
    document.removeEventListener('keydown', closeModalOnKeyDown);

    setIsOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    // disable scroll from page
    // handleClose make scroll available again
    // document.body.classList.add(scrollClass);
    document.addEventListener('keydown', closeModalOnKeyDown);

    setIsOpen(true);
  }, []);

  useEffect(() => {
    return () => {
      if (isOpen) {
        // force enable scroll when dismounted
        document.body.classList.remove(scrollClass);
        document.removeEventListener('keydown', closeModalOnKeyDown);
      }
    };
  }, [isOpen]);

  return {
    open: handleOpen,
    close: handleClose,
    isOpen,
  };
};
