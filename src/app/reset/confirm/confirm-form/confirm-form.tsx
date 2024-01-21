'use client';

import { BaseSyntheticEvent, MouseEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { confirmPasswordReset } from '@/redux/stores/user';
import { useAppDispatch } from '@/redux/hooks';
import { EDITOR_REQUEST_TOAST } from '@/redux/consts';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';

import { ROUTES, RoutesHandler } from '@/routes/routes.handler';
import { User } from '@/api/types/user.types';

import 'react-toastify/dist/ReactToastify.css';
import styles from './confirm-form.module.scss';

type FormValues = {
  password: string;
};

export function ConfirmForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = searchParams.get('key');
    const email = searchParams.get('email');

    if (!key || !email) {
      router.push(ROUTES.main()); // TODO check
    }
  }, [searchParams]);

  const handleReset = (user: User | null) => {
    if (user) {
      const from = searchParams.get('from');

      if (from) {
        router.push(RoutesHandler.withQuery(from, { q: 'a' }));
      } else {
        router.push(ROUTES.main());
      }
    } else {
      const { message, ...toastOptions } = EDITOR_REQUEST_TOAST.FAILED_TO_RESET_PASSWORD;

      toast(message, toastOptions);
    }
  };

  const onSubmit = async (formValues: FormValues, e?: BaseSyntheticEvent) => {
    e?.preventDefault();

    const key = searchParams.get('key');
    const email = searchParams.get('email');

    if (!key || !email) {
      return;
    }

    dispatch(
      confirmPasswordReset({
        credentials: { ...formValues, email, otp: key },
        callback: handleReset,
      })
    );
  };

  const handleLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const from = searchParams.get('from');

    router.push(RoutesHandler.withQuery(ROUTES.login(), from ? { from } : {}));
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>Reset password</div>
      <form autoComplete='on'>
        <LabeledInput
          label='create new password'
          formRegister={register('password', {
            required: { value: true, message: 'field is mandatory' },
            maxLength: { value: 30, message: 'should be less than 30 symbols' },
            minLength: { value: 10, message: 'should be longer than 10 symbols' },
          })}
          error={errors.password}
          type='password'
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
