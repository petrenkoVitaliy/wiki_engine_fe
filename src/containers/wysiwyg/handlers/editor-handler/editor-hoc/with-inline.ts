import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { BlockEditorHandler } from '../block-editor.handler';
import { isUri } from '@/utils/utils';

export const withInline = (editor: BaseEditor & ReactEditor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    element.type === 'link' || element.type === 'image' || isInline(element);

  editor.insertText = (text) => {
    if (text && isUri(text)) {
      BlockEditorHandler.wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUri(text)) {
      BlockEditorHandler.wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
