import { useAnimation } from '@/hooks/animations';
import classNames from 'classnames';
import { ReactNode, MouseEvent, useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  mobileOnly?: boolean;
}

export const Modal = ({ isOpen, onClose, children, mobileOnly }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const animation = useAnimation(modalRef, 'fade');

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  useEffect(() => {
    animation.startTransitionTo(isOpen);
  }, [isOpen]);

  if (!animation.isShown) return null;

  return (
    <div
      className={classNames(
        'fixed top-[0] left-[0] w-full h-full z-[999] bg-[#0000007d] justify-center items-center overflow-auto opacity-0',
        {
          flex: !mobileOnly,
          'max-medium:flex': mobileOnly,
        },
      )}
      onClick={handleOutsideClick}
      ref={modalRef}
    >
      {children}
    </div>
  );
};
