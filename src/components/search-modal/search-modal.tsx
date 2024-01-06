import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Modal } from '../modal/modal';

import { Button } from '../button/button';
import { Input } from '../input/input';

import styles from './search-modal.module.scss';
import { useDebounce } from '@/hooks/debounce.hook';

type SearchModalProps = {
  label: string;
  placeholder: string;
};

type FormValues = {
  searchQuery: string;
};

const response = [
  'response 1',
  'response 1',
  'response 1',
  'response 1',
  'response 1',
  'response 1',
  'response 1',
  'response 1',
];

export function SearchModal(props: SearchModalProps) {
  const [isOpened, setIsOpened] = useState(false);

  const { register, watch, reset } = useForm<FormValues>({ defaultValues: { searchQuery: '' } });

  const handleSearchByQuery = (searchQuery: string) => {
    console.log(searchQuery); // TODO
  };

  const debouncedSearch = useDebounce(handleSearchByQuery, 300);

  useEffect(() => {
    const subscription = watch(({ searchQuery }) => debouncedSearch(searchQuery));

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleClose = () => {
    setIsOpened(false);
  };

  const handleOpen = () => {
    setIsOpened(true);
    reset();
  };

  return (
    <>
      <Button onClick={handleOpen} label={props.label} />

      <Modal handleClickOutside={handleClose} isOpened={isOpened}>
        <div className={styles.modalContent}>
          <div className={styles.searchWrapper}>
            <Input
              formRegister={register('searchQuery')}
              highlighted
              placeholder={props.placeholder}
              name='search query'
            />
            <div className={styles.responseContainer}>
              {response.map((responseItem, index) => (
                <div className={styles.responseItem} key={index}>
                  {responseItem}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
