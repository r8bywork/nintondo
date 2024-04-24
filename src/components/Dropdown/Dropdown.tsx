import classNames from 'classnames';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface DropdownProps {
  target: ReactNode;
  dropdown: ReactNode;
  containerClassName?: string;
  dropdownClassName?: string;
  isVisible: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const Dropdown = ({
  target,
  dropdown,
  containerClassName,
  isVisible: outsideIsVisible,
  onClose,
  onOpen,
  dropdownClassName,
}: DropdownProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!onOpen && !onClose) {
      setIsDropdownVisible((isDropdownVisible) => !isDropdownVisible);
      return;
    }

    if (outsideIsVisible) {
      onClose();
    } else {
      onOpen();
    }
  };

  const isVisible = useMemo(() => {
    if (!onOpen && !onClose) {
      return isDropdownVisible;
    } else {
      return outsideIsVisible;
    }
  }, [onClose, onOpen, isDropdownVisible, outsideIsVisible]);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (isVisible && !dropdownRef.current?.contains(e.target as Node)) {
        if (!onOpen && !onClose) {
          setIsDropdownVisible(false);
        } else {
          onClose();
        }
      }
    },
    [isVisible, dropdownRef],
  );

  useEffect(() => {
    const removeEventListener = document.addEventListener('mousedown', handleOutsideClick);

    return removeEventListener;
  }, [handleOutsideClick, onOpen, onClose]);

  return (
    <div
      className={classNames('relative', containerClassName)}
      ref={dropdownRef}
    >
      <button
        className='w-full'
        onClick={handleToggle}
      >
        {target}
      </button>
      <div
        className={classNames(
          'absolute left-0',
          {
            hidden: !isVisible,
          },
          dropdownClassName,
        )}
        style={{ top: 'calc(100% + 10px)' }}
      >
        {dropdown}
      </div>
    </div>
  );
};
