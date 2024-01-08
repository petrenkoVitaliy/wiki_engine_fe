import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

import { isUri } from '@/utils/utils';

import { ElementFormat } from '@/containers/wysiwyg/types';
import { VerboseBlockService } from '@/services/verbose-block/verbose-block.service';

const INLINE_ELEMENTS: {
  [type in ElementFormat]?: boolean;
} = {
  link: true,
  image: true,
  youtube: true,
  tweet: true,
};

const handleInsertUri = (editor: BaseEditor & ReactEditor, text: string): boolean => {
  if (!text || !isUri(text)) {
    return false;
  }

  VerboseBlockService.insertVerboseUri(editor, text);

  return true;
};

export const withInline = (editor: BaseEditor & ReactEditor) => {
  const { insertData, isInline, insertText } = editor;

  editor.isInline = (element) =>
    (element.type && INLINE_ELEMENTS[element.type]) || isInline(element);

  editor.insertText = (text) => {
    const isUriHandled = handleInsertUri(editor, text);

    if (!isUriHandled) {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    const isUriHandled = handleInsertUri(editor, text);

    if (!isUriHandled) {
      insertData(data);
    }
  };

  return editor;
};
