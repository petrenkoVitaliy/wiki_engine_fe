'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';

import styles from './article-bar.module.scss';

import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { useModalControls } from '@/hooks/modal-controls.hook';
import { LanguageDto } from '@/api/dto/article.dto';
import { Input } from '@/components/input/input';

type FormValues = { language: string; name: string };

type ArticleBarProps = {
  languages: LanguageDto[];
  handleSubmit: (values: { name: string; language: string }) => void;
};

export function CreateArticleBar(props: ArticleBarProps) {
  const { isOpened, handleCloseModal, handleOpenModal } = useModalControls();

  const { register, getValues } = useForm<FormValues>();

  const articleOptions = useMemo(() => {
    const languageOptions = props.languages.map(({ code }) => ({
      value: code,
      label: code,
    }));

    return {
      languageOptions,
    };
  }, [props.languages]);

  const onSubmit = () => {
    handleOpenModal();
  };

  const handleSubmitConfirmPopup = () => {
    handleCloseModal();

    props.handleSubmit(getValues());
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>
        <Input formRegister={register('name')} />
      </div>

      <div className={styles.controlPanel}>
        <Select formRegister={register('language')} options={articleOptions.languageOptions} />

        <Button onClick={onSubmit} label='Save' />
      </div>

      <ConfirmationModal
        isOpen={isOpened}
        label='Are you sure you want to create article?'
        cancelLabel='No'
        submitLabel='Yes'
        handleSubmit={handleSubmitConfirmPopup}
        handleClose={handleCloseModal}
      />
    </section>
  );
}
