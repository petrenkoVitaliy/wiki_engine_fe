import { BaseEditor, Editor, Transforms, Element } from 'slate';
import { ReactEditor } from 'slate-react';

import { TEXT_ALIGN_FORMATS_MAP } from '@/containers/wysiwyg/consts';
import { CustomElement, ElementFormat } from '@/containers/wysiwyg/types';

export class BlockService {
  public static removeNode(editor: BaseEditor & ReactEditor, element: CustomElement): void {
    const path = ReactEditor.findPath(editor, element);

    Transforms.removeNodes(editor, { at: path });
  }

  public static isBlockActiveCheck(
    editor: BaseEditor & ReactEditor,
    format: ElementFormat
  ): boolean {
    const blockType: keyof CustomElement = TEXT_ALIGN_FORMATS_MAP[format] ? 'align' : 'type';

    const { selection } = editor;

    if (!selection) {
      return false;
    }

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) => {
          return !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format;
        },
      })
    );

    return !!match;
  }
}
