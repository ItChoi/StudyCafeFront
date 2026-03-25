import apiClient from './client';
import type { Branch, BranchSeat, BranchSeatGroup, BranchBusinessHour } from '../types';

// 지점 목록 조회
export const getBranches = () =>
  apiClient.get<Branch[]>('/api/branches');

// 지점 단건 조회
export const getBranch = (branchId: number) =>
  apiClient.get<Branch>(`/api/branches/${branchId}`);

// 지점 좌석 목록 조회
export const getBranchSeats = (branchId: number) =>
  apiClient.get<BranchSeat[]>(`/api/branches/${branchId}/seats`);

// 지점 좌석 그룹 목록 조회
export const getBranchSeatGroups = (branchId: number) =>
  apiClient.get<BranchSeatGroup[]>(`/api/branches/${branchId}/seat-groups`);

// 지점 영업시간 조회
export const getBranchBusinessHours = (branchId: number) =>
  apiClient.get<BranchBusinessHour[]>(`/api/branches/${branchId}/business-hours`);

// [관리자] 지점 등록
export const createBranch = (data: Omit<Branch, 'id'>) =>
  apiClient.post<Branch>('/api/admin/branches', data);

// [관리자] 지점 수정
export const updateBranch = (branchId: number, data: Partial<Branch>) =>
  apiClient.put<Branch>(`/api/admin/branches/${branchId}`, data);
