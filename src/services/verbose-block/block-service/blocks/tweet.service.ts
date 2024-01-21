import { BaseEditor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { Flip, toast } from 'react-toastify';

import { apiHandler } from '@/api/api-handler/api.handler';
import { TweetDetailsDto } from '@/api/dto/internal.dto';
import { CustomElement, TweetBlock, TwitterBlockElement } from '@/containers/wysiwyg/types';
import { TWEET_IMAGE_SIZES, TWEET_VIDEO_VARIANT_SIZES } from '@/containers/wysiwyg/consts';

import { BlockService } from '../block.service';

export class TweetBlockService extends BlockService {
  public static SUPPORTED_TYPES = ['video/mp4'];

  public static toggleTweet(editor: BaseEditor & ReactEditor, url?: string): void {
    if (!editor.selection) {
      return;
    }

    if (this.isBlockActiveCheck(editor, 'tweet')) {
      const selected = editor.children[editor.selection.anchor.path[0]] as CustomElement;
      this.removeNode(editor, selected);
    } else {
      const tweetId = url ? this.getTweetKeyFromUri(url) : null;

      if (!tweetId) {
        return;
      }

      this.insertTweet(editor, tweetId);
    }
  }

  public static updateSelectedVideoVariant(
    editor: BaseEditor & ReactEditor,
    tweetElement: TwitterBlockElement,
    selectedVideoIndex: number
  ): void {
    const path = ReactEditor.findPath(editor, tweetElement);

    Transforms.setNodes(editor, { ...tweetElement, selectedVideoIndex }, { at: path });
  }

  public static getTweetKeyFromUri(uri: string): string | null {
    const tweetRegex =
      /^(?:(?:https?:)?\/\/)(?:(?:x\.com|twitter.com))(?:\/(?:[\w-]+))(?:\/(?:status)\/)([\w-]+)(?:\S+)?$/;

    const matchResult = uri.match(tweetRegex);

    if (!matchResult || !matchResult[1]) {
      return null;
    }

    return matchResult[1];
  }

  public static removeThreadTweets(
    editor: BaseEditor & ReactEditor,
    element: TwitterBlockElement
  ): void {
    const path = ReactEditor.findPath(editor, element);

    Transforms.setNodes(editor, { ...element, parentTweets: [] }, { at: path });
  }

  public static async uploadThreadTweets(
    editor: BaseEditor & ReactEditor,
    element: TwitterBlockElement
  ): Promise<void> {
    const tweetId = element.parentId;

    if (!tweetId) {
      return;
    }

    const path = ReactEditor.findPath(editor, element);

    const toastId = toast('Downloading thread tweets...', { type: 'info', isLoading: true });

    const tweetsDetails = await this.fetchAndAggregateTweets(tweetId, { isThread: true });

    if (!tweetsDetails?.length) {
      toast.update(toastId, {
        render: 'Failed to download tweets',
        type: 'error',
        isLoading: false,
        transition: Flip,
        autoClose: 2000,
      });

      return;
    }

    toast.update(toastId, {
      render: 'Thread was successfully downloaded',
      type: 'success',
      isLoading: false,
      transition: Flip,
      autoClose: 2000,
    });

    const parentTweets = tweetsDetails.reverse();

    Transforms.setNodes(editor, { ...element, parentTweets }, { at: path });
  }

  public static updateSelectedVideoVariantSize(
    editor: BaseEditor & ReactEditor,
    element: TwitterBlockElement,
    direction: 'increase' | 'decrease'
  ): void {
    const path = ReactEditor.findPath(editor, element);

    const updatedWidth =
      direction === 'increase'
        ? element.videoWidth + TWEET_VIDEO_VARIANT_SIZES.STEP
        : element.videoWidth - TWEET_VIDEO_VARIANT_SIZES.STEP;

    if (
      updatedWidth >= TWEET_VIDEO_VARIANT_SIZES.MIN &&
      updatedWidth <= TWEET_VIDEO_VARIANT_SIZES.MAX
    ) {
      Transforms.setNodes(editor, { ...element, videoWidth: updatedWidth }, { at: path });
    }
  }

  public static updatePhotoSize(
    editor: BaseEditor & ReactEditor,
    element: TwitterBlockElement,
    photoIndex: number,
    direction: 'increase' | 'decrease'
  ): void {
    const path = ReactEditor.findPath(editor, element);

    const photoToUpdate = element.photos[photoIndex];

    const updatedWidth =
      direction === 'increase'
        ? photoToUpdate.width + TWEET_IMAGE_SIZES.STEP
        : photoToUpdate.width - TWEET_IMAGE_SIZES.STEP;

    const updatedHeight = Math.round((photoToUpdate.height * updatedWidth) / photoToUpdate.width);

    if (updatedWidth >= TWEET_IMAGE_SIZES.MIN && updatedWidth <= TWEET_IMAGE_SIZES.MAX) {
      const photos = element.photos.map((photo, index) => {
        if (index === photoIndex) {
          return { ...photo, width: updatedWidth, height: updatedHeight };
        }
        return photo;
      });

      Transforms.setNodes(editor, { ...element, photos }, { at: path });
    }
  }

  public static updateThreadTweetPhotoSize(
    editor: BaseEditor & ReactEditor,
    element: TwitterBlockElement,
    photoIndex: number,
    tweetIndex: number,
    direction: 'increase' | 'decrease'
  ): void {
    const path = ReactEditor.findPath(editor, element);

    const parentTweets = element.parentTweets;
    const tweetToUpdate = element.parentTweets[tweetIndex];

    if (!tweetToUpdate || !parentTweets) {
      return;
    }

    const photoToUpdate = tweetToUpdate.photos[photoIndex];

    const updatedWidth =
      direction === 'increase'
        ? photoToUpdate.width + TWEET_IMAGE_SIZES.STEP
        : photoToUpdate.width - TWEET_IMAGE_SIZES.STEP;

    const updatedHeight = Math.round((photoToUpdate.height * updatedWidth) / photoToUpdate.width);

    if (updatedWidth >= TWEET_IMAGE_SIZES.MIN && updatedWidth <= TWEET_IMAGE_SIZES.MAX) {
      const photos = tweetToUpdate.photos.map((photo, index) => {
        if (index === photoIndex) {
          return { ...photo, width: updatedWidth, height: updatedHeight };
        }

        return photo;
      });

      const updatedParentTweets = parentTweets.map((parentTweet, index) => {
        if (index === tweetIndex) {
          return { ...tweetToUpdate, photos };
        }

        return parentTweet;
      });

      Transforms.setNodes(editor, { ...element, parentTweets: updatedParentTweets }, { at: path });
    }
  }

  public static async insertTweet(
    editor: BaseEditor & ReactEditor,
    tweetId: string
  ): Promise<void> {
    const toastId = toast('Downloading tweet...', { type: 'info', isLoading: true });

    const tweetsDetails = await this.fetchAndAggregateTweets(tweetId, { isThread: false });

    if (!tweetsDetails?.length) {
      toast.update(toastId, {
        render: 'Failed to download tweet',
        type: 'error',
        isLoading: false,
        transition: Flip,
        autoClose: 2000,
      });

      return;
    }

    toast.update(toastId, {
      render: 'Tweet was successfully added',
      type: 'success',
      isLoading: false,
      transition: Flip,
      autoClose: 2000,
    });

    const [rootTweet, ...reversedThreadTweets] = tweetsDetails;

    if (!rootTweet) {
      return;
    }

    const parentTweets = reversedThreadTweets.reverse();

    const tweetBlock: TwitterBlockElement = {
      ...rootTweet,
      type: 'tweet',
      children: [{ text: '' }],
      parentTweets,
    };

    Transforms.insertNodes(editor, tweetBlock);
    Transforms.setNodes(editor, { align: 'center' });
  }

  private static async fetchAndAggregateTweets(
    tweetId: string,
    { isThread }: { isThread: boolean }
  ): Promise<TweetBlock[] | null> {
    const tweets: TweetBlock[] = [];

    return this.fetchAndParseTweets(tweetId, { isThread, tweets });
  }

  private static async fetchAndParseTweets(
    tweetId: string,
    { tweets, isThread }: { isThread: boolean; tweets: TweetBlock[] }
  ): Promise<TweetBlock[] | null> {
    const tweetDetails = await apiHandler.internalApi.getTweetDetails(tweetId);

    if (tweetDetails.status !== 'ok') {
      return null;
    }

    tweets.push(this.parseTweetDetails(tweetDetails.result, tweetDetails.result?.parent?.id_str));

    if (isThread && tweetDetails.result.parent) {
      return this.fetchAndParseTweets(tweetDetails.result.parent.id_str, { isThread, tweets });
    }

    return tweets;
  }

  private static parseTweetDetails(tweetDetails: TweetDetailsDto, parentId?: string): TweetBlock {
    const tweetVideos =
      tweetDetails.video?.variants.reduce<TwitterBlockElement['videoVariants']>((acc, variant) => {
        if (this.SUPPORTED_TYPES.includes(variant.type)) {
          const videoQualitySize = this.getTweetVideoQuality(variant.src);

          if (videoQualitySize) {
            acc.push({
              ...videoQualitySize,
              url: variant.src,
              type: variant.type,
            });
          }
        }

        return acc;
      }, []) || [];

    const tweetPhotos =
      tweetDetails.photos?.reduce<TwitterBlockElement['photos']>((acc, photo) => {
        acc.push({
          ...this.getImageSize(photo.width, photo.height),
          url: photo.url,
        });

        return acc;
      }, []) || [];

    const { message, url } = this.parseTweetMessage(tweetDetails.text);

    return {
      message,
      parentId,
      source: url,
      author: tweetDetails.user.screen_name,
      tweetId: tweetDetails.id_str,

      videoVariants: tweetVideos,
      videoWidth: TWEET_VIDEO_VARIANT_SIZES.DEFAULT_WIDTH,
      selectedVideoIndex: tweetVideos.length ? 0 : null,

      photos: tweetPhotos,
    };
  }

  private static getTweetVideoQuality(
    uri: string
  ): { qualityWidth: number; qualityHeight: number } | null {
    const sizeStr = uri.match(/[0-9]+x[0-9]+/)?.[0];

    if (!sizeStr) {
      return null;
    }

    const [width, height] = sizeStr.split('x');

    return {
      qualityWidth: +width,
      qualityHeight: +height,
    };
  }

  private static parseTweetMessage(rawMessage: string): { message: string; url: string } {
    const prefix = 'https://';
    const [message, urn] = rawMessage.split(`${prefix}`);

    return {
      message,
      url: `${prefix}${urn}`,
    };
  }

  private static getImageSize(
    naturalWidth: number,
    naturalHeight: number
  ): { width: number; height: number } {
    return {
      width: TWEET_IMAGE_SIZES.DEFAULT_WIDTH,
      height: Math.round((TWEET_IMAGE_SIZES.DEFAULT_WIDTH * naturalHeight) / naturalWidth),
    };
  }
}
