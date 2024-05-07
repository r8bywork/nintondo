import classNames from 'classnames';
import { ReactNode, MouseEvent } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  mobileOnly?: boolean;
}

export const Modal = ({ isOpen, onClose, children, mobileOnly }: ModalProps) => {
  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <div
      className={classNames(
        'fixed top-[0] left-[0] w-full h-full z-[999] bg-[#0000007d] justify-center items-center overflow-auto',
        {
          flex: !mobileOnly && isOpen,
          hidden: mobileOnly || !isOpen,
          'max-medium:flex': mobileOnly || isOpen,
        },
      )}
      onClick={handleOutsideClick}
    >
      {children}
    </div>
  );
};
