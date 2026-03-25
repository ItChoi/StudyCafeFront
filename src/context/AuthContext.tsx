import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Member } from '../types';

// Context에서 관리할 데이터 타입 정의
interface AuthContextType {
  member: Member | null;         // 현재 로그인한 회원 정보
  isLoggedIn: boolean;           // 로그인 여부
  isAdmin: boolean;              // 관리자 여부
  login: (token: string, memberInfo: Member) => void;  // 로그인 함수
  logout: () => void;            // 로그아웃 함수
}

// Context 생성 (기본값은 undefined - Provider 없이 쓰면 에러)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트: 로그인 상태를 앱 전체에 공급
export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 앱 최초 로드 시 localStorage에서 이전 로그인 상태 복원
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedMember = localStorage.getItem('member');
    const savedIsAdmin = localStorage.getItem('isAdmin');

    if (token && savedMember) {
      setMember(JSON.parse(savedMember));
      setIsAdmin(savedIsAdmin === 'true');
    }
  }, []);

  const login = (token: string, memberInfo: Member) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('member', JSON.stringify(memberInfo));
    setMember(memberInfo);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('member');
    localStorage.removeItem('isAdmin');
    setMember(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ member, isLoggedIn: !!member, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅: 컴포넌트에서 useAuth()로 간단하게 사용
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return context;
}
