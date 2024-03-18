// import { useEffect, useRef, useState } from 'react';
//
// const useItemsPerRow = (elementsWithText: string[]) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [itemsPerRow, setItemsPerRow] = useState<number>(1);
//
//   useEffect(() => {
//     const handleResize = () => {
//       if (containerRef.current && elementsWithText.length > 0) {
//         const containerWidth = containerRef.current.clientWidth;
//         const hiddenElements = elementsWithText.map((text) => {
//           const hiddenElement = document.createElement('div');
//           hiddenElement.style.position = 'absolute';
//           hiddenElement.style.visibility = 'hidden';
//           hiddenElement.style.whiteSpace = 'nowrap';
//           hiddenElement.style.fontSize = '16px';
//           hiddenElement.style.paddingLeft = '10px';
//           hiddenElement.style.paddingRight = '10px';
//           hiddenElement.style.marginRight = '12px';
//           hiddenElement.style.fontFamily = 'Inconsolata, sans-serif';
//           hiddenElement.innerText = text;
//           document.body.appendChild(hiddenElement);
//           return hiddenElement;
//         });
//
//         const itemWidths = hiddenElements.map((element) => element.offsetWidth);
//         const maxItemWidth = Math.max(...itemWidths);
//
//         const newItemsPerRow = Math.floor(containerWidth / maxItemWidth);
//         setItemsPerRow(newItemsPerRow);
//
//         hiddenElements.forEach((element) => {
//           document.body.removeChild(element);
//         });
//       }
//     };
//
//     handleResize();
//     window.addEventListener('resize', handleResize);
//
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [elementsWithText]);
//
//   return { containerRef, itemsPerRow };
// };
//
// export default useItemsPerRow;

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
  const [itemsPerRow, setItemsPerRow] = useState<number>(1);

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

        const itemWidths = hiddenElements.map((element) => element.offsetWidth);
        const maxItemWidth = Math.max(...itemWidths);

        const newItemsPerRow = Math.floor(containerWidth / maxItemWidth);
        setItemsPerRow(newItemsPerRow);

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
  }, [elementsWithText, hiddenElementStyles]);

  return { containerRef, itemsPerRow };
};

export default useItemsPerRow;
