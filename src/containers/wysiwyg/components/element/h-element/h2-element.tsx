import { CSSProperties, useMemo } from 'react';
import { RenderElementProps } from 'slate-react';

import { ControlButton } from '@/components/control-button/control-button';

import { getHeadingParams, getUriWithFragment } from '@/utils/utils';
import { ICONS } from '@/icons';

import styles from './header-element.module.scss';

type H2ElementProps = { style: CSSProperties } & RenderElementProps;

export function H2Element({ style, attributes, children, element }: H2ElementProps) {
  const headingParams = useMemo(() => getHeadingParams(element.children), [element.children]);

  const handleCopyClick = () => {
    const pageUri = getUriWithFragment(headingParams.heading.trim());

    navigator.clipboard.writeText(pageUri);
  };

  return (
    <h2
      style={style}
      className={`${styles.subheader} ${styles.headerWrapper}`}
      id={headingParams.hash}
      {...attributes}
    >
      {children}
      <span className={styles.controlWrapper}>
        <ControlButton
          icon={ICONS.verticalLinkIcon}
          label='copy subheader link'
          onClick={handleCopyClick}
        />
      </span>
    </h2>
  );
}
