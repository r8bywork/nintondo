import { useState } from 'react';

export const useModal = (defaultValue?: boolean) => {
  const [isOpen, setIsOpen] = useState(defaultValue || false);

  const handleClose = () => {
    // enable scroll
    document.body.removeAttribute('style');

    setIsOpen(false);
  };

  const handleOpen = () => {
    // disable scroll from page
    // handleClos make scroll available again
    document.body.setAttribute('style', 'overflow: hidden;');

    setIsOpen(true);
  };

  return {
    open: handleOpen,
    close: handleClose,
    isOpen,
  };
};
