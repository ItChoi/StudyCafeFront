import apiClient from './client';
import type { Member, GenderType } from '../types';

interface LoginRequest {
  nickname: string;
  password: string;
}

interface SignUpRequest {
  nickname: string;
  password: string;
  gender: GenderType;
}

interface AuthResponse {
  token: string;
  member: Member;
}

// 로그인
export const loginApi = (data: LoginRequest) =>
  apiClient.post<AuthResponse>('/api/auth/login', data);

// 회원가입
export const signUpApi = (data: SignUpRequest) =>
  apiClient.post<AuthResponse>('/api/auth/signup', data);

// 내 정보 조회 (OAuth2 콜백 후 토큰으로 회원 정보를 가져올 때 사용)
export const getMyInfo = () =>
  apiClient.get<Member>('/api/members/me');

// SNS OAuth2 로그인 URL 생성
// 백엔드(Spring Security)가 /oauth2/authorization/{provider} 로 OAuth2 흐름 시작
export const getOAuth2LoginUrl = (provider: 'kakao' | 'google' | 'naver') => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${baseUrl}/oauth2/authorization/${provider}`;
};
