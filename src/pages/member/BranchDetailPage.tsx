import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBranch } from '../../api/branchApi';
import { useBranchSeats } from '../../hooks/useBranches';
import SeatMap from '../../components/member/SeatMap';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { reserveSeat } from '../../api/reservationApi';
import { useAuth } from '../../context/AuthContext';
import type { Branch, BranchSeat } from '../../types';
import styles from './BranchDetailPage.module.css';

export default function BranchDetailPage() {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [branch, setBranch] = useState<Branch | null>(null);
  const [branchLoading, setBranchLoading] = useState(true);
  const [branchError, setBranchError] = useState<string | null>(null);

  const [selectedSeat, setSelectedSeat] = useState<BranchSeat | null>(null);
  const [reserving, setReserving] = useState(false);

  const numericBranchId = branchId ? Number(branchId) : null;
  const { seats, loading: seatsLoading } = useBranchSeats(numericBranchId);

  useEffect(() => {
    if (!numericBranchId) return;
    getBranch(numericBranchId)
      .then((res) => setBranch(res.data))
      .catch(() => setBranchError('지점 정보를 불러오지 못했습니다.'))
      .finally(() => setBranchLoading(false));
  }, [numericBranchId]);

  const handleReserve = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!selectedSeat || !numericBranchId) return;

    // 실제로는 보유 이용권 선택 모달을 띄워야 함 (여기서는 예시로 passId=1)
    const memberBranchPassId = 1;

    setReserving(true);
    try {
      await reserveSeat({
        branchId: numericBranchId,
        branchSeatId: selectedSeat.id,
        memberBranchPassId,
      });
      alert('예약 완료! 이용 현황에서 확인하세요.');
      navigate('/my/reservations');
    } catch {
      alert('예약에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setReserving(false);
    }
  };

  if (branchLoading) return <LoadingSpinner />;
  if (branchError || !branch) return <ErrorMessage message={branchError ?? '지점을 찾을 수 없습니다.'} />;

  return (
    <main className={styles.main}>
      {/* 지점 정보 */}
      <section className={styles.info}>
        <h1 className={styles.name}>{branch.name}</h1>
        <p className={styles.address}>{branch.address} {branch.detailAddress}</p>
        <p className={styles.contact}>📞 {branch.contactNumber}</p>
        <div className={styles.actions}>
          <button
            className={styles.passBtn}
            onClick={() => navigate(`/branches/${branch.id}/passes`)}
          >
            이용권 보기
          </button>
        </div>
      </section>

      {/* 좌석 배치도 */}
      <section className={styles.seatsSection}>
        <h2 className={styles.sectionTitle}>좌석 현황</h2>
        {seatsLoading ? (
          <LoadingSpinner message="좌석 불러오는 중..." />
        ) : (
          <SeatMap
            seats={seats}
            selectedSeatId={selectedSeat?.id}
            onSelectSeat={setSelectedSeat}
          />
        )}
      </section>

      {/* 예약 패널 */}
      {selectedSeat && (
        <div className={styles.reserveBar}>
          <span>선택된 좌석: <strong>{selectedSeat.seatNumber}</strong></span>
          <button
            className={styles.reserveBtn}
            onClick={handleReserve}
            disabled={reserving}
          >
            {reserving ? '예약 중...' : '이 좌석 예약하기'}
          </button>
        </div>
      )}
    </main>
  );
}
