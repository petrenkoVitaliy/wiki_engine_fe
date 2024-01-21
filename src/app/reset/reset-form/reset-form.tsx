'use client';

import { BaseSyntheticEvent, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { resetPassword } from '@/redux/stores/user';
import { useAppDispatch } from '@/redux/hooks';
import { EDITOR_REQUEST_TOAST } from '@/redux/consts';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';
import { EMAIL_PATTERN } from '@/components/input/consts';

import { ROUTES, RoutesHandler } from '@/routes/routes.handler';

import 'react-toastify/dist/ReactToastify.css';
import styles from './reset-form.module.scss';

type FormValues = {
  email: string;
};

export function ResetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const handleReset = (isSuccessful: boolean) => {
    const { message, ...toastOptions } = isSuccessful
      ? EDITOR_REQUEST_TOAST.CONFIRMATION_SENT
      : EDITOR_REQUEST_TOAST.FAILED_TO_RESET_PASSWORD;

    toast(message, toastOptions);

    if (isSuccessful) {
      router.push(ROUTES.main());
    }
  };

  const handleLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const from = searchParams.get('from');

    router.push(RoutesHandler.withQuery(ROUTES.login(), from ? { from } : {}));
  };

  const handleReturnBackClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const from = searchParams.get('from');

    if (from) {
      router.push(from);
    } else {
      router.back();
    }
  };

  const onSubmit = async (formValues: FormValues, e?: BaseSyntheticEvent) => {
    e?.preventDefault();

    const from = searchParams.get('from');

    dispatch(
      resetPassword({
        from,
        credentials: formValues,
        callback: handleReset,
      })
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.preHeaderWrapper}>
        <Button onClick={handleReturnBackClick} label='Return back' />
      </div>

      <div className={styles.header}>Reset password</div>
      <form autoComplete='on'>
        <LabeledInput
          label='email'
          formRegister={register('email', {
            required: { value: true, message: 'field is mandatory' },
            maxLength: { value: 30, message: 'should be less than 30 symbols' },
            pattern: { value: EMAIL_PATTERN, message: 'invalid email format' },
          })}
          error={errors.email}
          type='email'
        />

        <div className={styles.submitWrapper}>
          <Button primary type='submit' onClick={handleSubmit(onSubmit)} label='Reset' />
        </div>
      </form>

      <div className={styles.loginWrapper}>
        <p>Remember your password?</p>
        <Button onClick={handleLoginClick} label='Login' />
      </div>
    </section>
  );
}
