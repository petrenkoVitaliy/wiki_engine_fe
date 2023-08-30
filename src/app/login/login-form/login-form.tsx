'use client';

import { useForm } from 'react-hook-form';

import { LabeledInput } from '@/components/labeled-input/labeled-input';
import { Button } from '@/components/button/button';

import styles from './form.module.scss';

type FormValues = {
  password: string;
  login: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <section className={styles.section}>
      <div className={styles.header}>Login</div>
      <form>
        <LabeledInput
          label='login'
          formRegister={register('login')}
          error={errors.login}
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
