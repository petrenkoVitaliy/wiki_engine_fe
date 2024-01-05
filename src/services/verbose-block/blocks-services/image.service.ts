import { BaseEditor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { IMAGE_ELEMENT_SIZES } from '@/containers/wysiwyg/consts';
import { ImageBlockElement } from '@/containers/wysiwyg/types';

export class ImageBlockService {
  public static insertImage(
    editor: BaseEditor & ReactEditor,
    url: string,
    { width, height }: { width: number; height: number }
  ): void {
    const image: ImageBlockElement = {
      ...this.getImageSize(width, height),
      type: 'image',
      url,
      children: [{ text: '' }],
    };

    Transforms.insertNodes(editor, image);
  }

  public static updateImageSize(
    editor: BaseEditor & ReactEditor,
    imageElement: ImageBlockElement,
    direction: 'increase' | 'decrease'
  ): void {
    const path = ReactEditor.findPath(editor, imageElement);

    const updatedWidth =
      direction === 'increase'
        ? imageElement.width + IMAGE_ELEMENT_SIZES.STEP
        : imageElement.width - IMAGE_ELEMENT_SIZES.STEP;

    const updatedHeight = Math.round((imageElement.height * updatedWidth) / imageElement.width);

    if (updatedWidth >= IMAGE_ELEMENT_SIZES.MIN && updatedWidth <= IMAGE_ELEMENT_SIZES.MAX) {
      Transforms.setNodes(
        editor,
        { ...imageElement, width: updatedWidth, height: updatedHeight },
        { at: path }
      );
    }
  }

  private static getImageSize(
    naturalWidth: number,
    naturalHeight: number
  ): { width: number; height: number } {
    return {
      width: IMAGE_ELEMENT_SIZES.DEFAULT_WIDTH,
      height: (IMAGE_ELEMENT_SIZES.DEFAULT_WIDTH * naturalHeight) / naturalWidth,
    };
  }
}
