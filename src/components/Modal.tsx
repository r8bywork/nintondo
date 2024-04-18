import { ReactNode, MouseEvent } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed top-[0] left-[0] w-full h-full z-[999] bg-[#0000007d] justify-center items-center ${
        isOpen ? 'flex' : 'hidden'
      }`}
      onClick={handleOutsideClick}
    >
      {children}
    </div>
  );
};
