// declare module "*.svg" {
//   import React from "react";
//   const src: string;
//   export default src;
//   export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
// }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        poster?: string;
        alt?: string;
        'shadow-intensity'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        // Добавьте другие необходимые свойства здесь
      };
    }
  }
}

export {};
