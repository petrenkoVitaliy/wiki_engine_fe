import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

import { isUri } from '@/utils/utils';

import { BlockEditorHandler } from '../block-editor.handler';
import { ElementFormat } from '@/containers/wysiwyg/types';

const INLINE_ELEMENTS: {
  [type in ElementFormat]?: boolean;
} = {
  link: true,
  image: true,
};

export const withInline = (editor: BaseEditor & ReactEditor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    (element.type && INLINE_ELEMENTS[element.type]) || isInline(element);

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
