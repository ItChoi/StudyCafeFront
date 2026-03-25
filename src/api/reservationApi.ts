import apiClient from './client';
import type { BranchSeatReservation } from '../types';

// 좌석 예약 (입장)
export const reserveSeat = (data: {
  branchId: number;
  branchSeatId: number;
  memberBranchPassId: number;
}) => apiClient.post<BranchSeatReservation>('/api/reservations', data);

// 내 현재 이용 현황 조회
export const getMyActiveReservation = () =>
  apiClient.get<BranchSeatReservation>('/api/reservations/me/active');

// 내 예약 이력 조회
export const getMyReservationHistory = () =>
  apiClient.get<BranchSeatReservation[]>('/api/reservations/me/history');

// 예약 취소 (퇴장)
export const cancelReservation = (reservationId: number) =>
  apiClient.patch(`/api/reservations/${reservationId}/cancel`);

// 시간 연장
export const extendReservation = (reservationId: number, minutes: number) =>
  apiClient.patch(`/api/reservations/${reservationId}/extend`, { minutes });

// 좌석 이동
export const moveSeat = (reservationId: number, newSeatId: number) =>
  apiClient.patch(`/api/reservations/${reservationId}/move`, { newSeatId });

// [관리자] 지점 내 전체 이용 현황 조회
export const getBranchActiveReservations = (branchId: number) =>
  apiClient.get<BranchSeatReservation[]>(`/api/admin/branches/${branchId}/reservations/active`);
