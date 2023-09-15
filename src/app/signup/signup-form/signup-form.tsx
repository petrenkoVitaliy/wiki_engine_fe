'use client';
import { MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { signUp } from '@/redux/stores/user';
import { useAppDispatch } from '@/redux/hooks';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';
import { EMAIL_PATTERN } from '@/components/input/consts';

import { ROUTES, RoutesHandler } from '@/routes/routes.handler';

import 'react-toastify/dist/ReactToastify.css';
import styles from './form.module.scss';

type FormValues = {
  password: string;
  email: string;
  name: string;
};

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const handleSignup = (isSuccessful: boolean) => {
    if (isSuccessful) {
      toast('User was successfully created', { type: 'success' });
      toast("We've sent you an email with confirmation,  please check it", {
        type: 'info',
        progress: 1,
      });

      router.push(ROUTES.main());
    } else {
      toast('Cannot register new user', { type: 'error' });
    }
  };

  const onSubmit = async (formValues: FormValues) => {
    const from = searchParams.get('from');

    dispatch(
      signUp({
        from,
        credentials: formValues,
        callback: handleSignup,
      })
    );
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

  return (
    <section className={styles.section}>
      <div className={styles.preHeaderWrapper}>
        <Button onClick={handleReturnBackClick} label='Return back' />
      </div>

      <div className={styles.header}>Sign up</div>
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
          label='name'
          formRegister={register('name', {
            required: { value: true, message: 'field is mandatory' },
            maxLength: { value: 30, message: 'should be less than 30 symbols' },
            minLength: { value: 5, message: 'should be longer than 5 symbols' },
          })}
          error={errors.name}
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
          <Button primary onClick={handleSubmit(onSubmit)} label='Sign Up' />
        </div>
      </form>

      <div className={styles.loginWrapper}>
        <p>Already have an account?</p>
        <Button onClick={handleLoginClick} label='Login' />
      </div>
    </section>
  );
}
