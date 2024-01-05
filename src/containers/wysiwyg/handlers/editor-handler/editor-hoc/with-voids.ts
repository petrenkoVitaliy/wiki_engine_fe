import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

import { ElementFormat } from '@/containers/wysiwyg/types';
import { VerboseBlockService } from '@/services/verbose-block/verbose-block.service';

const VOID_ELEMENTS: {
  [type in ElementFormat]?: boolean;
} = {
  image: true,
  youtube: true,
  twitter: true,
};

export const withImage = (editor: BaseEditor & ReactEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return (element.type && VOID_ELEMENTS[element.type]) || isVoid(element);
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
              const image = new Image();

              image.src = url;

              image.onload = function () {
                const { width, height } = image;

                VerboseBlockService.blockHandler['image'].insertImage(editor, url, {
                  width,
                  height,
                });
              };
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
