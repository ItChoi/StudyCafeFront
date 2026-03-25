import { useState, useEffect } from 'react';
import { getBranches, getBranchSeats } from '../api/branchApi';
import type { Branch, BranchSeat } from '../types';

// 지점 목록을 가져오는 커스텀 훅
export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBranches()
      .then((res) => setBranches(res.data))
      .catch(() => setError('지점 목록을 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return { branches, loading, error };
}

// 특정 지점의 좌석 목록을 가져오는 커스텀 훅
export function useBranchSeats(branchId: number | null) {
  const [seats, setSeats] = useState<BranchSeat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!branchId) return;

    setLoading(true);
    getBranchSeats(branchId)
      .then((res) => setSeats(res.data))
      .catch(() => setError('좌석 정보를 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [branchId]);

  return { seats, loading, error };
}
