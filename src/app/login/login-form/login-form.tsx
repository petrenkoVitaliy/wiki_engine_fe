'use client';

import { BaseSyntheticEvent, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { loginUser } from '@/redux/stores/user';
import { useAppDispatch } from '@/redux/hooks';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';
import { EMAIL_PATTERN } from '@/components/input/consts';

import { ROUTES, RoutesHandler } from '@/routes/routes.handler';
import { User } from '@/api/types/user.types';

import 'react-toastify/dist/ReactToastify.css';
import styles from './login-form.module.scss';

type FormValues = {
  password: string;
  email: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const handleLogin = (user: User | null) => {
    if (user) {
      const from = searchParams.get('from');

      if (from) {
        router.push(RoutesHandler.withQuery(from, { q: 'a' }));
      } else {
        router.push(ROUTES.main());
      }
    } else {
      toast('Invalid email or password', { type: 'error' });
    }
  };

  const handleSignupClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const from = searchParams.get('from');
    router.push(RoutesHandler.withQuery(ROUTES.signup(), from ? { from } : {}));
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

    dispatch(
      loginUser({
        credentials: formValues,
        callback: handleLogin,
      })
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.preHeaderWrapper}>
        <Button onClick={handleReturnBackClick} label='Return back' />
      </div>

      <div className={styles.header}>Login</div>
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

        <LabeledInput
          label='password'
          formRegister={register('password', {
            required: { value: true, message: 'field is mandatory' },
            maxLength: { value: 30, message: 'should be less than 30 symbols' },
            minLength: { value: 10, message: 'should be longer than 10 symbols' },
          })}
          error={errors.password}
          type='password'
        />

        <div className={styles.submitWrapper}>
          <Button primary type='submit' onClick={handleSubmit(onSubmit)} label='Sign In' />
        </div>
      </form>

      <div className={styles.signupWrapper}>
        <p>Need an account?</p>
        <Button onClick={handleSignupClick} label='Sign Up' />
      </div>
    </section>
  );
}
