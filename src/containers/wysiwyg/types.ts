import { BaseElement } from 'slate';
import {
  MARK_FORMATS,
  ELEMENT_FORMATS,
  TEXT_ALIGN_FORMATS,
  BLOCK_FORMATS,
  LIST_FORMATS,
  VERBOSE_BLOCK_FORMATS,
} from './consts';

type MarkFormats = typeof MARK_FORMATS;
export type MarkFormat = MarkFormats[number];

type ElementFormats = typeof ELEMENT_FORMATS;
export type ElementFormat = ElementFormats[number];

type TextAlignFormats = typeof TEXT_ALIGN_FORMATS;
export type TextAlignFormat = TextAlignFormats[number];

type ListFormats = typeof LIST_FORMATS;
export type ListFormat = ListFormats[number];

type VerboseBlockFormats = typeof VERBOSE_BLOCK_FORMATS;
export type VerboseBlockFormat = VerboseBlockFormats[number];

type BlockFormats = typeof BLOCK_FORMATS;
export type BlockFormat = BlockFormats[number];

export type VerboseBlockOptions = {
  url?: string;
};

export type CustomText = {
  text: string;
} & { [key in MarkFormat]?: boolean };

export type LinkBlockElement = BaseElement & {
  align?: TextAlignFormat;
  type: 'link';
  url: string;
};

export type YoutubeBlockElement = BaseElement & {
  align?: TextAlignFormat;
  type: 'youtube';
  videoKey: string;
  width: number;
  height: number;
};

export type TweetBlock = {
  tweetId: string;
  message: string;
  source: string;
  author: string;
  selectedVideoIndex: number | null;
  videoWidth: number;
  videoVariants: {
    qualityWidth: number;
    qualityHeight: number;
    url: string;
    type: string;
  }[];
  photos: {
    width: number;
    height: number;
    url: string;
  }[];
  parentId?: string;
};

export type TwitterBlockElement = BaseElement &
  TweetBlock & {
    align?: TextAlignFormat;
    type: 'tweet';
    parentTweets: TweetBlock[];
  };

export type ImageBlockElement = BaseElement & {
  align?: TextAlignFormat;
  type: 'image';
  url: string;
  width: number;
  height: number;
};

type BlockElement = BaseElement & {
  align?: TextAlignFormat;
  type?: BlockFormat;
};

export type CustomElement =
  | BlockElement
  | LinkBlockElement
  | ImageBlockElement
  | YoutubeBlockElement
  | TwitterBlockElement;

export type ActiveElementsMap = {
  activeMarks: Omit<CustomText, 'text'> | null;
  activeBlocks: { [key in ElementFormat]?: boolean };
};

declare module 'slate' {
  export interface CustomTypes {
    Text: CustomText;
    Element: CustomElement;
  }
}
