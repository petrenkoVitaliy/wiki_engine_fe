import { ToastRequestOptions } from './types';

const EDITOR_REQUEST_TOAST_TYPE = [
  'UPDATING_ARTICLE',
  'CREATING_ARTICLE',
  'FAILED_TO_UPDATE',
  'SUCCESSFUL_UPDATE',
  'SUCCESSFUL_CREATION',
  'FAILED_TO_CREATE_IMAGES',
] as const;

export const EDITOR_REQUEST_TOAST: {
  [key in (typeof EDITOR_REQUEST_TOAST_TYPE)[number]]: ToastRequestOptions;
} = {
  UPDATING_ARTICLE: { message: 'Updating article...', type: 'info' },
  CREATING_ARTICLE: { message: 'Creating article...', type: 'info' },

  FAILED_TO_CREATE_IMAGES: { message: 'Image size is too large', type: 'error' },
  FAILED_TO_UPDATE: { message: 'Failed to save article', type: 'error' },

  SUCCESSFUL_UPDATE: { message: 'Article was successfully updated', type: 'success' },
  SUCCESSFUL_CREATION: { message: 'Article was successfully created', type: 'success' },
};
