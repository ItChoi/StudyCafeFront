import { useState, useEffect } from 'react';
import { getMyActiveReservation, cancelReservation, extendReservation } from '../../api/reservationApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateTime, formatMinutes } from '../../utils/format';
import type { BranchSeatReservation } from '../../types';
import styles from './MyReservationPage.module.css';

export default function MyReservationPage() {
  const [reservation, setReservation] = useState<BranchSeatReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchReservation = () => {
    setLoading(true);
    getMyActiveReservation()
      .then((res) => setReservation(res.data))
      .catch(() => setReservation(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservation();
  }, []);

  const handleExit = async () => {
    if (!reservation) return;
    if (!confirm('퇴장하시겠습니까?')) return;

    setProcessing(true);
    try {
      await cancelReservation(reservation.id);
      alert('퇴장 처리되었습니다.');
      fetchReservation();
    } catch {
      alert('처리에 실패했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  const handleExtend = async () => {
    if (!reservation) return;
    const minutes = Number(prompt('연장할 시간을 분 단위로 입력하세요. (예: 60)'));
    if (!minutes || isNaN(minutes)) return;

    setProcessing(true);
    try {
      await extendReservation(reservation.id, minutes);
      alert(`${formatMinutes(minutes)} 연장되었습니다.`);
      fetchReservation();
    } catch {
      alert('연장에 실패했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>이용 현황</h1>

      {!reservation ? (
        <div className={styles.empty}>
          <p>현재 이용 중인 좌석이 없습니다.</p>
          <a href="/branches">지점 찾아서 예약하기 →</a>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.statusBadge}>이용 중</div>
          <div className={styles.info}>
            <div className={styles.row}>
              <span className={styles.label}>입장 시각</span>
              <span className={styles.value}>{formatDateTime(reservation.startDtm)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>좌석 번호</span>
              <span className={styles.value}>#{reservation.branchSeatId}</span>
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.extendBtn}
              onClick={handleExtend}
              disabled={processing}
            >
              ⏱ 시간 연장
            </button>
            <button
              className={styles.exitBtn}
              onClick={handleExit}
              disabled={processing}
            >
              🚪 퇴장
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
