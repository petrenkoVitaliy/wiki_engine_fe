'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';

import { signUp } from '@/redux/stores/user';
import { useAppDispatch } from '@/redux/hooks';

import { ROUTES } from '@/routes/routes.handler';

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

    console.log({ from });

    dispatch(
      signUp({
        from,
        credentials: formValues,
        callback: handleSignup,
      })
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>Sign up</div>
      <form autoComplete='on'>
        <LabeledInput
          label='email'
          formRegister={register('email', { required: true })}
          error={errors.email}
          type='email'
        />

        <LabeledInput
          label='name'
          formRegister={register('name', { required: true })}
          error={errors.email}
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
