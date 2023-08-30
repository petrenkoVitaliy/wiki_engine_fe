import { Editor, BaseEditor, Element, Transforms, Range, Path } from 'slate';
import { ReactEditor } from 'slate-react';

import {
  ElementFormat,
  CustomElement,
  TextAlignFormat,
  BlockFormat,
  ListFormat,
  VerboseBlockOptions,
  LinkBlockElement,
  ImageBlockElement,
} from '../../types';

import { TEXT_ALIGN_FORMATS_MAP, LIST_FORMATS_MAP, IMAGE_ELEMENT_SIZES } from '../../consts';

export class BlockEditorHandler {
  private editor: BaseEditor & ReactEditor;

  constructor(editor: BaseEditor & ReactEditor) {
    this.editor = editor;
  }

  public isBlockActiveCheck(format: ElementFormat): boolean {
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
        this.toggleLink(options.url);
    }
  }

  private toggleLink(url?: string): void {
    if (!this.editor.selection) {
      return;
    }

    if (this.isBlockActiveCheck('link')) {
      this.unwrapLink();
    } else {
      if (url) {
        BlockEditorHandler.wrapLink(this.editor, url);
      }
    }
  }

  private unwrapLink(): void {
    Transforms.unwrapNodes(this.editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
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
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }

    Transforms.move(editor, { unit: 'offset' });
  }

  public static insertImage(editor: BaseEditor & ReactEditor, url: string): void {
    const image: ImageBlockElement = {
      type: 'image',
      url,
      width: IMAGE_ELEMENT_SIZES.DEFAULT,
      children: [{ text: '' }],
    };

    Transforms.insertNodes(editor, image);
  }

  public static removeNode(editor: BaseEditor & ReactEditor, element: CustomElement): void {
    const path = ReactEditor.findPath(editor, element);

    Transforms.removeNodes(editor, { at: path });
  }

  public static updateImageSize(
    editor: BaseEditor & ReactEditor,
    element: CustomElement,
    direction: 'increase' | 'decrease'
  ): void {
    const path = ReactEditor.findPath(editor, element);

    const imageElement = element as ImageBlockElement;

    const updatedWidth =
      direction === 'increase'
        ? imageElement.width + IMAGE_ELEMENT_SIZES.STEP
        : imageElement.width - IMAGE_ELEMENT_SIZES.STEP;

    if (updatedWidth >= IMAGE_ELEMENT_SIZES.MIN && updatedWidth <= IMAGE_ELEMENT_SIZES.MAX) {
      Transforms.setNodes(editor, { ...imageElement, width: updatedWidth }, { at: path });
    }
  }
}
