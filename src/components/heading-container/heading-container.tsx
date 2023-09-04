import styles from './heading-container.module.scss';

type HeaderProps = {
  articleName: string;
};

export function HeadingContainer(props: HeaderProps) {
  return (
    <div className={styles.headingWrapper}>
      <p>{props.articleName}</p>
    </div>
  );
}
