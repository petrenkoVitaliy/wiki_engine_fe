'use client';

import { useForm } from 'react-hook-form';

import { Input } from '@/components/input/input';
import { Button } from '@/components/button/button';

import styles from './bar.module.scss';

type FormValues = {
  login: string;
};

export function SearchBar() {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <form className={styles.searchBarWrapper}>
      <Input formRegister={register('login')} />
      <Button onClick={handleSubmit(onSubmit)} label='search' />
    </form>
  );
}
