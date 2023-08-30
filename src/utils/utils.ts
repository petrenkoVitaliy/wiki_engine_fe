import { Descendant } from 'slate';

import { CustomText } from '@/containers/wysiwyg/types';

export function stringToHash(str: string): string {
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

export function getHeadingId(headingBlock: Descendant[]): string {
  let heading = '';

  for (const headingElement of headingBlock as CustomText[]) {
    heading += headingElement.text;
  }

  return stringToHash(heading);
}

export function isUri(uri: string): boolean {
  const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
  const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
  const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;

  const match = uri.match(protocolAndDomainRE);
  if (!match?.[1]) {
    return false;
  }

  const urn = match[1];

  return localhostDomainRE.test(urn) || nonLocalhostDomainRE.test(urn);
}
