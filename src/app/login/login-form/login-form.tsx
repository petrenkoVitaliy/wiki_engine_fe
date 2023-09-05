'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';

import { loginUser } from '@/redux/slices/user.slice';
import { useAppDispatch } from '@/redux/hooks';

import { ROUTES } from '@/routes/routes.handler';
import { User } from '@/api/types/user.types';

import 'react-toastify/dist/ReactToastify.css';
import styles from './form.module.scss';

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

  const onSubmit = async (formValues: FormValues) => {
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
          formRegister={register('email')}
          error={errors.email}
          type='email'
        />

        <LabeledInput
          label='password'
          formRegister={register('password', { required: true })}
          error={errors.password}
          type='password'
        />

        <Button onClick={handleSubmit(onSubmit)} label='submit' />
      </form>
    </section>
  );
}
