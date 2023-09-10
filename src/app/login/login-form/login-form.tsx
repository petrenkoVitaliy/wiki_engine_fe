'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';

import { loginUser } from '@/redux/stores/user';
import { useAppDispatch } from '@/redux/hooks';

import { ROUTES, RoutesHandler } from '@/routes/routes.handler';
import { User } from '@/api/types/user.types';

import 'react-toastify/dist/ReactToastify.css';
import styles from './form.module.scss';
import { BaseSyntheticEvent, MouseEvent } from 'react';

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
        router.push(from);
      } else {
        router.push(ROUTES.main());
      }
    } else {
      toast('Invalid email or password', { type: 'error' });
    }
  };

  const handleSignup = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const from = searchParams.get('from');

    router.push(RoutesHandler.withQuery(ROUTES.signup(), from ? { from } : {}));
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
      <div className={styles.header}>Login</div>
      <form autoComplete='on'>
        <LabeledInput
          label='email'
          formRegister={register('email', { required: true })}
          error={errors.email}
          type='email'
        />

        <LabeledInput
          label='password'
          formRegister={register('password', { required: true })}
          error={errors.password}
          type='password'
        />

        <div>
          <Button onClick={handleSignup} label='signup' />
          <Button onClick={handleSubmit(onSubmit)} label='submit' />
        </div>
      </form>
    </section>
  );
}
