import { getHeadingId } from '@/utils/utils';
import { RenderElementProps } from 'slate-react';

import { ImageElement } from './image-element/image-element';
import { LinkElement } from './link-element/link-element';

import { ImageBlockElement, LinkBlockElement } from '../../types';

type LeafProps = RenderElementProps;

export function Element({ attributes, children, element }: LeafProps) {
  const style = { textAlign: element.align };

  switch (element.type) {
    case 'image': {
      return (
        <ImageElement
          attributes={attributes}
          children={children}
          element={element as ImageBlockElement}
        />
      );
    }
    case 'link':
      return (
        <LinkElement
          style={style}
          attributes={attributes}
          children={children}
          element={element as LinkBlockElement}
        />
      );
    case 'block_quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulleted_list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'numbered_list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'heading_one':
      return (
        <h1 style={style} id={getHeadingId(element.children)} {...attributes}>
          {children}
        </h1>
      );
    case 'heading_two':
      return (
        <h2 style={style} id={getHeadingId(element.children)} {...attributes}>
          {children}
        </h2>
      );
    case 'list_item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );

    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
}
