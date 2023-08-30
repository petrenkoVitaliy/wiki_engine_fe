import { Editor, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

import { MarkFormat } from '../../types';
import { MARK_FORMATS } from '../../consts';

export class MarkEditorHandler {
  private editor: BaseEditor & ReactEditor;

  constructor(editor: BaseEditor & ReactEditor) {
    this.editor = editor;
  }

  public isMarkActiveCheck(format: MarkFormat): boolean {
    const marks = Editor.marks(this.editor) as
      | { [key in (typeof MARK_FORMATS)[number]]: boolean }
      | null;

    return !!marks?.[format];
  }

  public toggleMark(format: MarkFormat): void {
    const isActive = this.isMarkActiveCheck(format);

    if (isActive) {
      this.editor.removeMark(format);
    } else {
      this.editor.addMark(format, true);
    }
  }
}
