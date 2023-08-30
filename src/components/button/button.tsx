import styles from './button.module.scss';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export function Button(props: ButtonProps) {
  return (
    <button className={styles.button} onClick={props.onClick}>
      {props.label}
    </button>
  );
}
