import { CSSProperties, useMemo } from 'react';
import { RenderElementProps } from 'slate-react';

import { getHeadingParams, getUriWithFragment } from '@/utils/utils';

import { ControlButton } from '../image-element/control-button/control-button';
import { ICONS } from './icons';

import styles from './header-element.module.scss';

type H2ElementProps = { style: CSSProperties } & RenderElementProps;

export function H2Element({ style, attributes, children, element }: H2ElementProps) {
  const headingParams = useMemo(() => getHeadingParams(element.children), [element.children]);

  const handleCopyClick = () => {
    const pageUri = getUriWithFragment(headingParams.heading.trim());

    navigator.clipboard.writeText(pageUri);
  };

  return (
    <h2 style={style} className={styles.headerWrapper} id={headingParams.hash} {...attributes}>
      {children}
      <div className={styles.controlWrapper}>
        <ControlButton
          icon={ICONS.verticalLinkIcon}
          label='decrease image size'
          onClick={handleCopyClick}
        />
      </div>
    </h2>
  );
}
