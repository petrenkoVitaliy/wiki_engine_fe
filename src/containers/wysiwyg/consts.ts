export const BLUR_BACKGROUND_IMAGE =
  'data:image/webp;base64,UklGRhQBAABXRUJQVlA4IAgBAAAwBwCdASoyAB8APpE6mUiloyIhMBQKALASCWYAnTL2hFfHSvq2owJu65+pEmK096AxcSm1sr3R4QVl16lPMStmNYAA/vv/Zqyu8uB3JCA1nHBGI8MLJOPJ0/6Pplgla3axYQA/O3r2Mq7vc4yrPs4RPLQGDXuSp5+JtZGgJ18zsO+LG574pkwhKjglaHZt1J4OyxWaNIfWedReOc66eYlW5cjbzmpmhSLBfXS+oTqdCWggZwNrLKQ23zWM4y2vm/Vj4r1z2iP37pud+9EDBoVHvPzv5s3CbefhR+X6dzCVoeezEPTgpZDJw/BblWj0wECSvc3AK3e0pqlYuywN7OuA35qWLi5tAAA=';

export const MARK_FORMATS = ['bold', 'italic', 'underline', 'code'] as const;

export const TEXT_ALIGN_FORMATS = ['left', 'center', 'right', 'justify'] as const;
export const TEXT_ALIGN_FORMATS_MAP: { [key: string]: boolean } = {
  left: true,
  center: true,
  right: true,
  justify: true,
};

export const LIST_FORMATS = ['numbered_list', 'bulleted_list'] as const;
export const LIST_FORMATS_MAP: { [key: string]: boolean } = {
  numbered_list: true,
  bulleted_list: true,
};

const DEFAULT_BLOCK_FORMATS = ['paragraph', 'list_item'] as const;

const SIMPLE_BLOCK_FORMATS = [
  ...LIST_FORMATS,
  ...DEFAULT_BLOCK_FORMATS,
  'heading_one',
  'heading_two',
  'block_quote',
] as const;

export const VERBOSE_BLOCK_FORMATS = ['link', 'image', 'youtube', 'tweet'] as const;

export const BLOCK_FORMATS = [...SIMPLE_BLOCK_FORMATS, ...VERBOSE_BLOCK_FORMATS] as const;

export const ELEMENT_FORMATS = [...TEXT_ALIGN_FORMATS, ...BLOCK_FORMATS] as const;

export const HOTKEYS: { [key: string]: (typeof MARK_FORMATS)[number] } = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  q: 'code',
};

export const IMAGE_ELEMENT_SIZES = {
  DEFAULT_WIDTH: 200,
  MIN: 100,
  MAX: 1000,
  STEP: 50,
};

export const VIDEO_ASPECT_RATIO = 9 / 16;

export const VIDEO_ELEMENT_SIZES = {
  DEFAULT_WIDTH: 400,
  MIN: 300,
  MAX: 1000,
  STEP: 50,
};

export const TWEET_IMAGE_SIZES = {
  DEFAULT_WIDTH: 200,
  MIN: 100,
  MAX: 1000,
  STEP: 50,
};

export const TWEET_VIDEO_VARIANT_SIZES = {
  DEFAULT_WIDTH: 250,
  MIN: 200,
  MAX: 1000,
  STEP: 50,
};
