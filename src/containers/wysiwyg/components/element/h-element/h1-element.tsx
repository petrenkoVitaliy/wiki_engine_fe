import { CSSProperties, useMemo } from 'react';
import { RenderElementProps } from 'slate-react';

import { ControlButton } from '@/components/control-button/control-button';
import { getHeadingParams, getUriWithFragment } from '@/utils/utils';

import { ICONS } from './icons';

import styles from './header-element.module.scss';

type H1ElementProps = { style: CSSProperties } & RenderElementProps;

export function H1Element({ style, attributes, children, element }: H1ElementProps) {
  const headingParams = useMemo(() => getHeadingParams(element.children), [element.children]);

  const handleCopyClick = () => {
    const pageUri = getUriWithFragment(headingParams.heading.trim());

    navigator.clipboard.writeText(pageUri);
  };

  return (
    <h1 style={style} className={styles.headerWrapper} id={headingParams.hash} {...attributes}>
      {children}
      <div className={styles.controlWrapper}>
        <ControlButton
          icon={ICONS.verticalLinkIcon}
          label='decrease image size'
          onClick={handleCopyClick}
        />
      </div>
    </h1>
  );
}
