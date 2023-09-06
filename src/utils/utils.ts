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
