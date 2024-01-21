import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Modal } from '../modal/modal';
import { IconButton } from '../icon-button/icon-button';
import { Input } from '../input/input';

import { useDebounce } from '@/hooks/debounce.hook';
import { apiHandler } from '@/api/api-handler/api.handler';
import { ROUTES } from '@/routes/routes.handler';
import { ICONS } from '@/icons';

import styles from './search-modal.module.scss';

const ENTER_KEY = 'Enter';
const SEARCH_KEY = 'k';

type SearchModalProps = {
  label: string;
  placeholder: string;
};

type MatchedArticle = {
  name: string;
  nameKey: string;
  languageCode: string;
};

type FormValues = {
  searchQuery: string;
};

export function SearchModal(props: SearchModalProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [matchedArticleLanguages, setMatchedArticleLanguages] = useState<MatchedArticle[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const router = useRouter();

  const { register, watch, reset, setFocus } = useForm<FormValues>({
    defaultValues: { searchQuery: '' },
  });

  const handleSearchByQuery = async (searchQuery: string | null) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (!searchQuery) {
      setMatchedArticleLanguages([]);
      return;
    }

    abortRef.current = new AbortController();

    const searchResult = await apiHandler.getArticlesListByQuery(searchQuery, {
      signal: abortRef.current.signal,
    });

    if (searchResult.status === 'ok') {
      setMatchedArticleLanguages(
        searchResult.result.map((searchResultItem) => ({
          name: searchResultItem.name,
          nameKey: searchResultItem.name_key,
          languageCode: searchResultItem.language_code,
        }))
      );
    }
  };

  const debouncedSearch = useDebounce(handleSearchByQuery, 300);

  useEffect(() => {
    if (isOpened) {
      setFocus('searchQuery');
    }
  }, [isOpened]);

  useEffect(() => {
    const subscription = watch(({ searchQuery }) => debouncedSearch(searchQuery));

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsOpened(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpened(true);
    reset();
  }, [reset]);

  const handleMatchClick = (nameKey: string, languageCode: string) => () => {
    router.push(ROUTES.articleLanguage(nameKey, languageCode));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === SEARCH_KEY && !isOpened) {
      handleOpen();
      return;
    }
  };

  const handleEnterKeyPress =
    (callback: () => void) => (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ENTER_KEY) {
        e.preventDefault();

        callback();
      }
    };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        label={props.label}
        icon={ICONS.BUTTON.searchIcon}
        collapsable
      />

      <Modal handleClickOutside={handleClose} isOpened={isOpened}>
        <div className={styles.modalContent}>
          <div className={styles.searchWrapper}>
            <Input
              formRegister={register('searchQuery')}
              highlighted
              placeholder={props.placeholder}
              name='search query'
            />

            {matchedArticleLanguages.length ? (
              <div className={styles.responseContainer}>
                {matchedArticleLanguages.map((matchedArticleLanguage) => (
                  <div
                    className={styles.responseItem}
                    key={matchedArticleLanguage.nameKey}
                    tabIndex={0}
                    onClick={handleMatchClick(
                      matchedArticleLanguage.nameKey,
                      matchedArticleLanguage.languageCode
                    )}
                    onKeyDown={handleEnterKeyPress(
                      handleMatchClick(
                        matchedArticleLanguage.nameKey,
                        matchedArticleLanguage.languageCode
                      )
                    )}
                  >
                    <div className={styles.label}>{matchedArticleLanguage.name}</div>
                    <div className={styles.languageLabel}>
                      {matchedArticleLanguage.languageCode}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
