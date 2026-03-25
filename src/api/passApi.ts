import apiClient from './client';
import type { BranchPass, MemberBranchPass } from '../types';

// 지점 이용권 상품 목록 조회
export const getBranchPasses = (branchId: number) =>
  apiClient.get<BranchPass[]>(`/api/branches/${branchId}/passes`);

// 내 보유 이용권 목록 조회
export const getMyPasses = () =>
  apiClient.get<MemberBranchPass[]>('/api/passes/me');

// 이용권 구매
export const purchasePass = (branchPassId: number) =>
  apiClient.post<MemberBranchPass>('/api/passes/purchase', { branchPassId });

// [관리자] 이용권 상품 등록
export const createBranchPass = (branchId: number, data: Omit<BranchPass, 'id' | 'branchId'>) =>
  apiClient.post<BranchPass>(`/api/admin/branches/${branchId}/passes`, data);

// [관리자] 이용권 상품 수정
export const updateBranchPass = (branchId: number, passId: number, data: Partial<BranchPass>) =>
  apiClient.put<BranchPass>(`/api/admin/branches/${branchId}/passes/${passId}`, data);
