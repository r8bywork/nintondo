import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className='relative inline-block'>
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className='absolute bottom-full left-1/2 mb-2 p-1 text-white bg-black rounded-md text-sm font-medium z-10 transform -translate-x-1/2'
          style={{ minWidth: '120px', maxWidth: '240px', whiteSpace: 'nowrap' }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
