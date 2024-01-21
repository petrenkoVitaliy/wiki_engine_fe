import { ToastRequestOptions } from './types';

const EDITOR_REQUEST_TOAST_TYPE = [
  'UPDATING_ARTICLE',
  'CREATING_ARTICLE',
  'FAILED_TO_UPDATE',
  'SUCCESSFUL_UPDATE',
  'SUCCESSFUL_CREATION',
  'FAILED_TO_CREATE_IMAGES',
  'CONFIRMATION_SENT',
  'FAILED_TO_RESET_PASSWORD',
  'INVALID_EMAIL_PASSWORD',
] as const;

const AUTOCLOSE_TTL = 2000;

export const EDITOR_REQUEST_TOAST: {
  [key in (typeof EDITOR_REQUEST_TOAST_TYPE)[number]]: ToastRequestOptions;
} = {
  UPDATING_ARTICLE: { message: 'Updating article...', type: 'info' },
  CREATING_ARTICLE: { message: 'Creating article...', type: 'info' },

  FAILED_TO_CREATE_IMAGES: { message: 'Image size is too large', type: 'error' },
  FAILED_TO_UPDATE: { message: 'Failed to save article', type: 'error' },

  SUCCESSFUL_UPDATE: {
    message: 'Article was successfully updated',
    type: 'success',
    autoClose: AUTOCLOSE_TTL,
  },
  SUCCESSFUL_CREATION: {
    message: 'Article was successfully created',
    type: 'success',
    autoClose: AUTOCLOSE_TTL,
  },

  CONFIRMATION_SENT: {
    message: "We've sent you an email with confirmation, please check it",
    type: 'info',
  },
  FAILED_TO_RESET_PASSWORD: {
    message: 'Cannot reset password',
    type: 'error',
    autoClose: AUTOCLOSE_TTL,
  },
  INVALID_EMAIL_PASSWORD: {
    message: 'Invalid email or password',
    type: 'error',
    autoClose: AUTOCLOSE_TTL,
  },
};
