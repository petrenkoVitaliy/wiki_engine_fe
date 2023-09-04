'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';

import { AuthHandler } from '@/auth/auth.handler';
import { setUser } from '@/redux/slices/user.slice';

import 'react-toastify/dist/ReactToastify.css';
import styles from './form.module.scss';
import { useDispatch } from 'react-redux';
import { ROUTES } from '@/routes/routes.handler';

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
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const onSubmit = async (data: FormValues) => {
    const loginResponse = await AuthHandler.login(data);

    if (loginResponse.status === 'ok') {
      dispatch(setUser(loginResponse.result.user));

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

  return (
    <section className={styles.section}>
      <div className={styles.header}>Login</div>
      <form>
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
      <ToastContainer />
    </section>
  );
}
