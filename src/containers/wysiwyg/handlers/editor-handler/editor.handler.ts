import { createEditor, BaseEditor, Descendant } from 'slate';
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

  public blockHandler: BlockEditorHandler;
  public markHandler: MarkEditorHandler;

  private headings: string[] | null;
  private prevState: Descendant[];

  constructor() {
    this.editor = withImage(withInline(withHistory(withReact(createEditor()))));

    this.headings = null;
    this.prevState = [];

    this.blockHandler = new BlockEditorHandler(this.editor);
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
    const activeBlocks = this.blockHandler.getActiveBlocks();

    return { activeMarks, activeBlocks };
  }

  public getUpdatedHeadings(values: Descendant[]): string[] | null {
    const updatedHeadings = this.getHeadings(values);

    const previousHeadings = this.headings;
    if (!previousHeadings) {
      this.headings = updatedHeadings;

      return this.headings;
    }

    const isUpdatedHeadings =
      updatedHeadings.length !== previousHeadings.length ||
      updatedHeadings.some((heading, index) => heading !== previousHeadings[index]);

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
    }
  }
}
