import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

import { BlockEditorHandler } from '../block-editor.handler';

export const withImage = (editor: BaseEditor & ReactEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;

            if (url && typeof url === 'string') {
              BlockEditorHandler.insertImage(editor, url);
            }
          });

          reader.readAsDataURL(file);
        }
      }
    } else {
      insertData(data);
    }
  };

  return editor;
};
