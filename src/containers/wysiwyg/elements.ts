import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ICONS } from '@/icons';
import { ElementFormat, MarkFormat } from './types';

export const MarkButtons: { label: string; format: MarkFormat; icon: StaticImport }[] = [
  { icon: ICONS.WYSIWYG.boldIcon, format: 'bold', label: 'bold' },
  { icon: ICONS.WYSIWYG.italicIcon, format: 'italic', label: 'italic' },
  { icon: ICONS.WYSIWYG.underlineIcon, format: 'underline', label: 'underline' },
  { icon: ICONS.WYSIWYG.codeIcon, format: 'code', label: 'code' },
];

export const BlockButtons: { label: string; format: ElementFormat; icon: StaticImport }[] = [
  { icon: ICONS.WYSIWYG.headingH1Icon, format: 'heading_one', label: 'heading one' },
  { icon: ICONS.WYSIWYG.headingH2Icon, format: 'heading_two', label: 'heading two' },
  { icon: ICONS.WYSIWYG.quoteIcon, format: 'block_quote', label: 'quote' },
  { icon: ICONS.WYSIWYG.numberListIcon, format: 'numbered_list', label: 'numbered list' },
  { icon: ICONS.WYSIWYG.bulletListIcon, format: 'bulleted_list', label: 'bulleted list' },
  { icon: ICONS.WYSIWYG.alignLeftIcon, format: 'left', label: 'align left' },
  { icon: ICONS.WYSIWYG.alignCenterIcon, format: 'center', label: 'align center' },
  { icon: ICONS.WYSIWYG.alignRightIcon, format: 'right', label: 'align right' },
  { icon: ICONS.WYSIWYG.alignJustifyIcon, format: 'justify', label: 'align justify' },
];

export const VerboseBlockButtons: { label: string; format: ElementFormat; icon: StaticImport }[] = [
  { icon: ICONS.WYSIWYG.linkIcon, format: 'link', label: 'link' },
  { icon: ICONS.WYSIWYG.youtubeIcon, format: 'youtube', label: 'youtube' },
  { icon: ICONS.WYSIWYG.twitterIcon, format: 'twitter', label: 'twitter' },
];

export const VerboseBlockPlaceholders: { [key in ElementFormat]?: string } = {
  twitter: 'https://twitter.com/user/status/...',
  youtube: 'https://www.youtube.com/watch/...',
  link: 'https://...',
};
