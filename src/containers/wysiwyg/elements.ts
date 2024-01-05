import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ICONS } from './components/toolbar/icons';
import { ElementFormat, MarkFormat } from './types';

export const MarkButtons: { label: string; format: MarkFormat; icon: StaticImport }[] = [
  { icon: ICONS.boldIcon, format: 'bold', label: 'bold' },
  { icon: ICONS.italicIcon, format: 'italic', label: 'italic' },
  { icon: ICONS.underlineIcon, format: 'underline', label: 'underline' },
  { icon: ICONS.codeIcon, format: 'code', label: 'code' },
];

export const BlockButtons: { label: string; format: ElementFormat; icon: StaticImport }[] = [
  { icon: ICONS.headingH1Icon, format: 'heading_one', label: 'heading one' },
  { icon: ICONS.headingH2Icon, format: 'heading_two', label: 'heading two' },
  { icon: ICONS.quoteIcon, format: 'block_quote', label: 'quote' },
  { icon: ICONS.numberListIcon, format: 'numbered_list', label: 'numbered list' },
  { icon: ICONS.bulletListIcon, format: 'bulleted_list', label: 'bulleted list' },
  { icon: ICONS.alignLeftIcon, format: 'left', label: 'align left' },
  { icon: ICONS.alignCenterIcon, format: 'center', label: 'align center' },
  { icon: ICONS.alignRightIcon, format: 'right', label: 'align right' },
  { icon: ICONS.alignJustifyIcon, format: 'justify', label: 'align justify' },
];

export const VerboseBlockButtons: { label: string; format: ElementFormat; icon: StaticImport }[] = [
  { icon: ICONS.linkIcon, format: 'link', label: 'link' },
  { icon: ICONS.youtubeIcon, format: 'youtube', label: 'youtube' },
  { icon: ICONS.twitterIcon, format: 'twitter', label: 'twitter' },
];
