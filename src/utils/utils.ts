import { Descendant } from 'slate';

import { CustomText } from '@/containers/wysiwyg/types';

export function scrollToBeginning(): void {
  window.scrollTo({
    behavior: 'smooth',
    top: 0,
  });
}

export function scrollToElementWithId(hashId: string | null): boolean {
  const SCROLL_OFFSET = -50;

  if (!hashId) {
    return false;
  }

  const element = document.getElementById(hashId);

  if (!element) {
    return false;
  }

  window.scrollTo({
    behavior: 'smooth',
    top: element.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET,
  });

  return true;
}

export function uriHashToHashId(hash: string | undefined): string | null {
  if (!hash) {
    return null;
  }

  const uriHashPointer = hash.split('#')[1];
  const hashPointer = decodeURIComponent(uriHashPointer);

  return stringToHashId(hashPointer);
}

export function stringToHashId(input: string): string {
  const str = input.trim();

  let hash = 0;

  if (str.length == 0) {
    return String(hash);
  }

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }

  return String(hash);
}

export function getHeadingParams(headingBlock: Descendant[]): {
  heading: string;
  hash: string;
} {
  let heading = '';

  for (const headingElement of headingBlock as CustomText[]) {
    heading += headingElement.text;
  }

  return {
    heading,
    hash: stringToHashId(heading),
  };
}

export function getUriWithFragment(fragment: string): string {
  return `${window.location.origin}${window.location.pathname}#${encodeURIComponent(fragment)}`;
}

export function pick<T, U extends keyof T>(parent: T, keys: U[]): Pick<T, U> {
  return keys.reduce<Partial<T>>((acc, key) => {
    acc[key] = parent[key];

    return acc;
  }, {}) as Pick<T, U>;
}

export function pickAndExtend<
  T,
  U extends keyof T,
  L extends keyof T,
  K extends { [P in L]?: T[P] },
  R extends Pick<T, U> & K = Pick<T, U> & K,
>(parent: T, keys: U[], extraFields: K): R {
  const pickedValues = pick(parent, keys);

  return Object.keys(extraFields).reduce((acc, key) => {
    acc[key as L] = extraFields[key as L] as unknown as R[L];

    return acc;
  }, pickedValues as R);
}

export function isUri(uri: string): boolean {
  const protocolAndDomainRegex = /^(?:\w+:)?\/\/(\S+)$/;
  const localhostDomainRegex = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
  const nonLocalhostDomainRegex = /^[^\s.]+\.\S{2,}$/;

  const match = uri.match(protocolAndDomainRegex);
  if (!match?.[1]) {
    return false;
  }

  const urn = match[1];

  return localhostDomainRegex.test(urn) || nonLocalhostDomainRegex.test(urn);
}

export function getTweetToken(tweetId: string): string {
  return ((Number(tweetId) / 1e15) * Math.PI).toString(6 ** 2).replace(/(0+|\.)/g, '');
}

export function formatDateTime(timestamp: string | undefined): string {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);

  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', { month: '2-digit' });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return `${[day, month, year].join('-')} ${date.toLocaleTimeString()}`;
}
