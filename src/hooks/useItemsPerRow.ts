import { useEffect, useRef, useState } from 'react';

interface HiddenElementStyles {
  [key: string]: string;
}

const defaultHiddenElementStyles: HiddenElementStyles = {
  position: 'absolute',
  visibility: 'hidden',
  whiteSpace: 'nowrap',
  fontSize: '16px',
  paddingLeft: '10px',
  paddingRight: '10px',
  marginRight: '12px',
  fontFamily: 'Inconsolata, sans-serif',
};

const useItemsPerRow = (
  elementsWithText: string[],
  hiddenElementStyles: HiddenElementStyles = {},
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerRow, setItemsPerRow] = useState<number[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && elementsWithText.length > 0) {
        const containerWidth = containerRef.current.clientWidth;
        const hiddenElements = elementsWithText.map((text) => {
          const hiddenElement = document.createElement('div');
          Object.assign(hiddenElement.style, defaultHiddenElementStyles, hiddenElementStyles);
          hiddenElement.innerText = text;
          document.body.appendChild(hiddenElement);
          return hiddenElement;
        });

        const itemWidths = hiddenElements.map((element) => element.offsetWidth + 15);

        if (containerRef.current) {
          let currentRowWidth = 0;
          let currentRowCount = 0;
          const newRowItems: number[] = [];

          itemWidths.forEach((width, index) => {
            currentRowWidth += width;
            currentRowCount++;

            if (currentRowWidth >= containerWidth) {
              newRowItems.push(currentRowCount - 1);
              currentRowWidth = width;
              currentRowCount = 1;
            } else if (index === itemWidths.length) {
              newRowItems.push(currentRowCount);
            }
          });
          if (currentRowCount > 0) {
            newRowItems.push(currentRowCount);
          }

          setItemsPerRow(newRowItems);
        }

        hiddenElements.forEach((element) => {
          document.body.removeChild(element);
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return { containerRef, itemsPerRow };
};

export default useItemsPerRow;
