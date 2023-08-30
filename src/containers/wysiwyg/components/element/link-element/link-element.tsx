import { CSSProperties } from 'react';
import { RenderElementProps } from 'slate-react';

import { LinkBlockElement } from '../../../types';

type LinkProps = { style: CSSProperties } & Omit<RenderElementProps, 'element'> & {
    element: LinkBlockElement;
  };

export function LinkElement({ style, attributes, children, element }: LinkProps) {
  return (
    <a style={style} {...attributes} href={element.url}>
      {children}
    </a>
  );
}
