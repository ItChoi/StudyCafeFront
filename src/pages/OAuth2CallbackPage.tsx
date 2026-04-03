import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyInfo } from '../api/authApi';

/**
 * SNS(OAuth2) 로그인 콜백 페이지
 *
 * 흐름:
 * 1. 백엔드가 OAuth2 인증 완료 후 이 페이지로 리다이렉트
 *    예: /oauth2/callback?token=JWT_TOKEN
 * 2. URL에서 토큰 추출
 * 3. 토큰으로 내 정보 조회 (GET /api/members/me)
 * 4. AuthContext에 로그인 처리 후 홈으로 이동
 */
export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      // 토큰이 없으면 로그인 실패로 처리
      navigate('/login', { replace: true });
      return;
    }

    // apiClient 인터셉터가 토큰을 읽을 수 있도록 먼저 저장
    localStorage.setItem('accessToken', token);

    getMyInfo()
      .then((res) => {
        login(token, res.data);
        navigate('/', { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
      });
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#6b7280' }}>
      <p>로그인 처리 중입니다...</p>
    </div>
  );
}
