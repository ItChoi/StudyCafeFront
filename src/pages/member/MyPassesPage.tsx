import { useState, useEffect } from 'react';
import { getMyPasses } from '../../api/passApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPassType, formatMinutes, formatDate, formatStatus } from '../../utils/format';
import type { MemberBranchPass } from '../../types';
import styles from './MyPassesPage.module.css';

export default function MyPassesPage() {
  const [passes, setPasses] = useState<MemberBranchPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyPasses()
      .then((res) => setPasses(res.data))
      .catch(() => setError('이용권 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>내 이용권</h1>

      {passes.length === 0 ? (
        <div className={styles.empty}>
          <p>보유한 이용권이 없습니다.</p>
          <a href="/branches">지점에서 이용권 구매하기 →</a>
        </div>
      ) : (
        <div className={styles.list}>
          {passes.map((pass) => (
            <div key={pass.id} className={styles.card} data-status={pass.status}>
              <div className={styles.cardHeader}>
                <span className={styles.type}>{formatPassType(pass.passType)}</span>
                <span className={styles.status}>{formatStatus(pass.status)}</span>
              </div>
              <div className={styles.details}>
                {pass.remainingMinutes != null && (
                  <p>잔여 시간: <strong>{formatMinutes(pass.remainingMinutes)}</strong></p>
                )}
                {pass.expiresDtm && (
                  <p>만료일: <strong>{formatDate(pass.expiresDtm)}</strong></p>
                )}
                {pass.startDtm && (
                  <p>시작일: <strong>{formatDate(pass.startDtm)}</strong></p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
