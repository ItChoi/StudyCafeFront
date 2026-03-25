import styles from './LoadingSpinner.module.css';

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = '불러오는 중...' }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
