'use client';

import { useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleReadOnly } from '@/redux/slices/editor.slice';

import { HeadingContainer } from '@/components/heading-container/heading-container';
import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';

import styles from './article-bar.module.scss';

type FormValues = { language: string };

export function ArticleBar() {
  const dispatch = useAppDispatch();

  const isReadOnly = useAppSelector((state) => state.editorReducer.isReadOnly);

  const { register, handleSubmit } = useForm<FormValues>();

  const onLanguageChange = (data: FormValues) => console.log(data);

  const handleEditClick = () => {
    dispatch(toggleReadOnly());
  };

  return (
    <section className={styles.articleBar}>
      <HeadingContainer />
      <div className={styles.controlPanel}>
        <Select
          formRegister={register('language')}
          onChange={handleSubmit(onLanguageChange)}
          options={[
            { value: 'en', label: 'en' },
            { value: 'ua', label: 'ua' },
          ]}
        />

        <Button onClick={handleEditClick} label={isReadOnly ? 'Edit' : 'Save'} />
      </div>
    </section>
  );
}
