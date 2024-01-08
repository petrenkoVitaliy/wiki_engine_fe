import { BaseEditor, Transforms, Editor, Element, Range } from 'slate';
import { ReactEditor } from 'slate-react';

import { LinkBlockElement } from '@/containers/wysiwyg/types';

import { BlockService } from '../block.service';

export class LinkBlockService extends BlockService {
  public static toggleLink(editor: BaseEditor & ReactEditor, url?: string): void {
    if (!editor.selection) {
      return;
    }

    if (this.isBlockActiveCheck(editor, 'link')) {
      this.unwrapLink(editor);
    } else {
      if (url) {
        this.wrapLink(editor, url);
      }
    }
  }

  public static wrapLink(editor: BaseEditor & ReactEditor, url: string): void {
    const isCollapsed = editor.selection && Range.isCollapsed(editor.selection);

    const link: LinkBlockElement = {
      type: 'link',
      url,
      children: isCollapsed ? [{ text: url }] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link);
      Transforms.collapse(editor, { edge: 'end' });
    }

    Transforms.move(editor, { unit: 'offset' });
    Transforms.insertNodes(editor, { text: ' ' });
  }

  private static unwrapLink(editor: BaseEditor & ReactEditor): void {
    Transforms.unwrapNodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
  }
}
