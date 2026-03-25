// 날짜/시간 포맷 유틸리티

// "2024-03-15T14:30:00+09:00" → "2024.03.15 14:30"
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// "2024-03-15T14:30:00+09:00" → "2024.03.15"
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR');
}

// 분(minutes)을 "X시간 Y분" 형식으로 변환
export function formatMinutes(minutes: number | null | undefined): string {
  if (minutes == null) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

// 가격 포맷 "10000" → "10,000원"
export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

// 이용권 타입 한글 변환
export function formatPassType(type: string): string {
  const map: Record<string, string> = {
    TIME: '시간형',
    PERIOD: '기간형',
    COUNT: '횟수형',
  };
  return map[type] ?? type;
}

// 좌석 타입 한글 변환
export function formatSeatType(type: string): string {
  const map: Record<string, string> = {
    FREE: '자유석',
    FIXED: '고정석',
    STUDY_ROOM: '스터디룸',
  };
  return map[type] ?? type;
}

// 상태 한글 변환
export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: '활성',
    INACTIVE: '비활성',
    IN_USE: '이용중',
    RESERVED: '예약됨',
    CANCELLED: '취소됨',
    COMPLETED: '완료',
    EXPIRED: '만료',
    SUSPENDED: '정지',
  };
  return map[status] ?? status;
}
