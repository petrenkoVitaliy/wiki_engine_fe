import { BaseEditor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { VIDEO_ASPECT_RATIO, VIDEO_ELEMENT_SIZES } from '@/containers/wysiwyg/consts';
import { CustomElement, YoutubeBlockElement } from '@/containers/wysiwyg/types';

import { getYoutubeVideoKeyFromUri } from '@/utils/utils';

import { BlockService } from '../block.service';

export class VideoBlockService extends BlockService {
  public static toggleVideo(editor: BaseEditor & ReactEditor, url?: string): void {
    if (!editor.selection) {
      return;
    }

    if (this.isBlockActiveCheck(editor, 'youtube')) {
      const selected = editor.children[editor.selection.anchor.path[0]] as CustomElement;
      this.removeNode(editor, selected);
    } else {
      const videoKey = url ? this.getYoutubeVideoKeyFromUri(url) : null;

      if (!videoKey) {
        return;
      }

      this.insertVideo(editor, videoKey);
    }
  }

  public static insertVideo(editor: BaseEditor & ReactEditor, videoKey: string): void {
    const videoBlock: YoutubeBlockElement = {
      type: 'youtube',
      videoKey,
      children: [{ text: '' }],
      width: VIDEO_ELEMENT_SIZES.DEFAULT_WIDTH,
      height: VIDEO_ELEMENT_SIZES.DEFAULT_WIDTH * VIDEO_ASPECT_RATIO,
    };

    Transforms.insertNodes(editor, videoBlock);
  }

  public static getYoutubeVideoKeyFromUri(uri: string): string | null {
    return getYoutubeVideoKeyFromUri(uri);
  }

  public static updateVideoSize(
    editor: BaseEditor & ReactEditor,
    videoElement: YoutubeBlockElement,
    direction: 'increase' | 'decrease'
  ): void {
    const path = ReactEditor.findPath(editor, videoElement);

    const updatedWidth =
      direction === 'increase'
        ? videoElement.width + VIDEO_ELEMENT_SIZES.STEP
        : videoElement.width - VIDEO_ELEMENT_SIZES.STEP;

    const updatedHeight = (updatedWidth * 9) / 16;

    if (updatedWidth >= VIDEO_ELEMENT_SIZES.MIN && updatedWidth <= VIDEO_ELEMENT_SIZES.MAX) {
      Transforms.setNodes(
        editor,
        { ...videoElement, width: updatedWidth, height: updatedHeight },
        { at: path }
      );
    }
  }
}
