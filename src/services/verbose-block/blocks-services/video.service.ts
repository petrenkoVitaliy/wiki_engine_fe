import { BaseEditor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { VIDEO_ASPECT_RATIO, VIDEO_ELEMENT_SIZES } from '@/containers/wysiwyg/consts';
import { YoutubeBlockElement } from '@/containers/wysiwyg/types';

export class VideoBlockService {
  public static toggleVideo(editor: BaseEditor & ReactEditor, url?: string): void {
    if (!editor.selection) {
      return;
    }

    const videoKey = url ? this.getYoutubeVideoKeyFromUri(url) : null;

    if (!videoKey) {
      return;
    }

    this.insertVideo(editor, videoKey);
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
    const youtubeRegex =
      /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(?:\S+)?$/;

    const matchResult = uri.match(youtubeRegex);

    if (!matchResult || !matchResult[1]) {
      return null;
    }

    return matchResult[1];
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
