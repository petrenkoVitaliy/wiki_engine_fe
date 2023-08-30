import { createEditor, BaseEditor, Descendant, Transforms } from 'slate';
import { withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { KeyboardEvent } from 'react';

import { CustomElement, CustomText, ActiveElementsMap } from '../../types';
import { HOTKEYS } from '../../consts';

import { BlockEditorHandler } from './block-editor.handler';
import { MarkEditorHandler } from './mark-editor.handler';
import { withInline } from './editor-hoc/with-inline';
import { withImage } from './editor-hoc/with-image';

export class EditorHandler {
  public editor: BaseEditor & ReactEditor;

  public blochHandler: BlockEditorHandler;
  public markHandler: MarkEditorHandler;

  private headings: string[];
  private prevState: Descendant[];

  constructor(initialValue: Descendant[]) {
    this.editor = withImage(withInline(withHistory(withReact(createEditor()))));

    this.headings = this.getHeadings(initialValue);
    this.prevState = initialValue;

    this.blochHandler = new BlockEditorHandler(this.editor);
    this.markHandler = new MarkEditorHandler(this.editor);
  }

  private getHeadings(values: Descendant[]): string[] {
    const headingsList: string[] = [];

    for (const value of values as CustomElement[]) {
      if (value.type === 'heading_one' || value.type === 'heading_two') {
        let heading = '';
        for (const headingElement of value.children as CustomText[]) {
          heading += headingElement.text;
        }

        headingsList.push(heading);
      }
    }

    return headingsList;
  }

  public getActiveElements(): ActiveElementsMap {
    const activeMarks = this.editor.getMarks();
    const activeBlocks = this.blochHandler.getActiveBlocks();

    return { activeMarks, activeBlocks };
  }

  public getUpdatedHeadings(values: Descendant[]): string[] | null {
    const updatedHeadings = this.getHeadings(values);

    const isUpdatedHeadings =
      updatedHeadings.length !== this.headings.length ||
      updatedHeadings.some((heading, index) => heading !== this.headings[index]);

    this.headings = updatedHeadings;

    return isUpdatedHeadings ? this.headings : null;
  }

  public hasChanged(value: Descendant[]): boolean {
    const isChanged = value !== this.prevState;

    this.prevState = value;

    return isChanged;
  }

  public handleHotKey(event: KeyboardEvent<HTMLDivElement>): void {
    if ((event.ctrlKey || event.metaKey) && event.key) {
      const format = HOTKEYS[event.key];

      if (format) {
        this.markHandler.toggleMark(format);
        event.preventDefault();
      }
    } else {
      if (event.key === 'ArrowRight') {
        Transforms.move(this.editor, { unit: 'offset' });
      }
    }
  }
}
