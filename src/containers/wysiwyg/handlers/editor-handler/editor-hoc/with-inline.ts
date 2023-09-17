import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

import { getYoutubeVideoKeyFromUri, isUri } from '@/utils/utils';

import { BlockEditorHandler } from '../block-editor.handler';
import { ElementFormat } from '@/containers/wysiwyg/types';

const INLINE_ELEMENTS: {
  [type in ElementFormat]?: boolean;
} = {
  link: true,
  image: true,
  youtube: true,
};

const handleInsertUri = (editor: BaseEditor & ReactEditor, text: string): boolean => {
  if (!text || !isUri(text)) {
    return false;
  }

  const youtubeKey = getYoutubeVideoKeyFromUri(text);

  if (youtubeKey) {
    BlockEditorHandler.insertVideo(editor, youtubeKey);
  } else {
    BlockEditorHandler.wrapLink(editor, text);
  }

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
