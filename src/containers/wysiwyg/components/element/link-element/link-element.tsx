import { CSSProperties } from 'react';
import { RenderElementProps } from 'slate-react';

import { LinkBlockElement } from '../../../types';

import styles from './link-element.module.scss';

type LinkProps = { style: CSSProperties } & Omit<RenderElementProps, 'element'> & {
    element: LinkBlockElement;
  };

export function LinkElement({ style, attributes, children, element }: LinkProps) {
  return (
    <a style={style} {...attributes} className={styles.link} href={element.url} target='_blank'>
      {children}
    </a>
  );
}
