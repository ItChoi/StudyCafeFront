// ========================
// 공통 타입
// ========================

export type CommonStatus = 'ACTIVE' | 'INACTIVE';

export type GenderType = 'MALE' | 'FEMALE' | 'NONE';

export type BranchSeatType = 'FREE' | 'FIXED' | 'STUDY_ROOM';

export type BranchSeatReservationStatus = 'IN_USE' | 'RESERVED' | 'CANCELLED' | 'COMPLETED';

export type PassType = 'TIME' | 'PERIOD' | 'COUNT';

export type PassStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';

export type PassIssueType = 'PURCHASE' | 'GIFT' | 'ADMIN';

export type PassEventType = 'ENTER' | 'EXIT' | 'EXTEND' | 'MOVE';

export type DayOfWeekType = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

// ========================
// 회원 (Member)
// ========================

export interface Member {
  id: number;
  nickname: string;
  gender: GenderType;
  createdAt: string;
  updatedAt: string;
}

// ========================
// 지점 (Branch)
// ========================

export interface Branch {
  id: number;
  status: CommonStatus;
  name: string;
  bizNumber: string;
  contactNumber: string;
  address: string;
  detailAddress: string;
}

// ========================
// 좌석 그룹 (BranchSeatGroup)
// ========================

export interface BranchSeatGroup {
  id: number;
  branchId: number;
  name: string;
  type: BranchSeatType;
}

// ========================
// 좌석 (BranchSeat)
// ========================

export interface BranchSeat {
  id: number;
  branchId: number;
  branchSeatGroupId: number;
  seatNumber: string;
  status: CommonStatus;
  type: BranchSeatType;
}

// ========================
// 좌석 예약 / 이용 (BranchSeatReservation)
// ========================

export interface BranchSeatReservation {
  id: number;
  branchId: number;
  branchSeatId: number;
  memberId: number;
  memberBranchPassId: number;
  startDtm: string;
  endDtm: string | null;
  status: BranchSeatReservationStatus;
  cancelledDtm: string | null;
}

// ========================
// 이용권 상품 (BranchPass)
// ========================

export interface BranchPass {
  id: number;
  branchId: number;
  name: string;
  passType: PassType;
  price: number;
  minutes?: number;     // 시간형 이용권의 총 분
  days?: number;        // 기간형 이용권의 일수
  count?: number;       // 횟수형
}

// ========================
// 회원 보유 이용권 (MemberBranchPass)
// ========================

export interface MemberBranchPass {
  id: number;
  memberId: number;
  branchId: number;
  branchPassId: number;
  passType: PassType;
  issueType: PassIssueType;
  status: PassStatus;
  expiresDtm: string | null;
  startDtm: string | null;
  endDtm: string | null;
  remainingMinutes: number | null;
}

// ========================
// 영업시간 (BranchBusinessHour)
// ========================

export interface BranchBusinessHour {
  id: number;
  branchId: number;
  dayOfWeek: DayOfWeekType;
  openTime: string;   // "HH:mm"
  closeTime: string;  // "HH:mm"
}

// ========================
// API 공통 응답 래퍼
// ========================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
