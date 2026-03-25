import styles from './ErrorMessage.module.css';

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>⚠️</span>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryBtn}>
          다시 시도
        </button>
      )}
    </div>
  );
}
