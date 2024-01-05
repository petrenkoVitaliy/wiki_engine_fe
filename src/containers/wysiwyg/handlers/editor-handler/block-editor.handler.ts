import { Editor, BaseEditor, Element, Transforms, Path } from 'slate';
import { ReactEditor } from 'slate-react';

import {
  ElementFormat,
  CustomElement,
  TextAlignFormat,
  BlockFormat,
  ListFormat,
  VerboseBlockOptions,
} from '../../types';

import { VerboseBlockService } from '@/services/verbose-block/verbose-block.service';

import { TEXT_ALIGN_FORMATS_MAP, LIST_FORMATS_MAP } from '../../consts';

export class BlockEditorHandler {
  private editor: BaseEditor & ReactEditor;

  constructor(editor: BaseEditor & ReactEditor) {
    this.editor = editor;
  }

  public updateChildren(children: CustomElement[]) {
    if (this.editor.children.length) {
      Transforms.delete(this.editor, {
        at: {
          anchor: Editor.start(this.editor, []),
          focus: Editor.end(this.editor, []),
        },
      });

      Transforms.removeNodes(this.editor, {
        at: [0],
      });
    }

    Transforms.insertNodes(this.editor, children);
  }

  public getActiveBlocks(): { [key in ElementFormat]?: boolean } {
    const activeBlocks: { [key in ElementFormat]?: boolean } = {};

    const { selection } = this.editor;

    if (!selection) {
      return activeBlocks;
    }

    const match = Array.from(
      Editor.nodes(this.editor, {
        at: Editor.unhangRange(this.editor, selection),
        match: (n) => {
          return !Editor.isEditor(n);
        },
      })
    );

    const selectedBlocks = match as [CustomElement, Path][];

    for (const [selectedBlock] of selectedBlocks) {
      if (selectedBlock.align) {
        activeBlocks[selectedBlock.align] = true;
      }

      if (selectedBlock.type) {
        activeBlocks[selectedBlock.type] = true;
      }
    }

    return activeBlocks;
  }

  public toggleBlock(format: ElementFormat): void {
    const isActive = this.isBlockActiveCheck(format);

    const isList = LIST_FORMATS_MAP[format];

    Transforms.unwrapNodes(this.editor, {
      split: true,
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        !!n.type &&
        LIST_FORMATS_MAP[n.type] &&
        !TEXT_ALIGN_FORMATS_MAP[format],
    });

    const updatedElement: Partial<Element> = {};

    if (TEXT_ALIGN_FORMATS_MAP[format]) {
      updatedElement.align = isActive ? undefined : (format as TextAlignFormat);
    } else {
      updatedElement.type = isActive ? 'paragraph' : isList ? 'list_item' : (format as BlockFormat);
    }

    Transforms.setNodes(this.editor, updatedElement);

    if (!isActive && isList) {
      const block = { type: format as ListFormat, children: [] };
      Transforms.wrapNodes(this.editor, block);
    }
  }

  public toggleVerboseBlock(format: ElementFormat, options: VerboseBlockOptions): void {
    switch (format) {
      case 'link':
        VerboseBlockService.blockHandler['link'].toggleLink(this.editor, options.url);
        break;
      case 'youtube':
        VerboseBlockService.blockHandler['youtube'].toggleVideo(this.editor, options.url);
        break;
      case 'twitter':
        VerboseBlockService.blockHandler['twitter'].toggleTweet(this.editor, options.url);
        break;
    }
  }

  private isBlockActiveCheck(format: ElementFormat): boolean {
    const blockType: keyof CustomElement = TEXT_ALIGN_FORMATS_MAP[format] ? 'align' : 'type';

    const { selection } = this.editor;

    if (!selection) {
      return false;
    }

    const [match] = Array.from(
      Editor.nodes(this.editor, {
        at: Editor.unhangRange(this.editor, selection),
        match: (n) => {
          return !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format;
        },
      })
    );

    return !!match;
  }

  public static removeNode(editor: BaseEditor & ReactEditor, element: CustomElement): void {
    const path = ReactEditor.findPath(editor, element);

    Transforms.removeNodes(editor, { at: path });
  }
}
