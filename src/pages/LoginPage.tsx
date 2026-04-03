import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi, getOAuth2LoginUrl } from '../api/authApi';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginApi({ nickname, password });
      const { token, member } = res.data;
      login(token, member);
      navigate('/');
    } catch {
      setError('닉네임 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSnsLogin = (provider: 'kakao' | 'google' | 'naver') => {
    window.location.href = getOAuth2LoginUrl(provider);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.subtitle}>StudyCafe에 오신 걸 환영합니다</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className={styles.links}>
          <span>계정이 없으신가요?</span>
          <Link to="/signup" className={styles.signupLink}>회원가입</Link>
        </div>

        <div className={styles.divider}>
          <span>또는 SNS 계정으로 로그인</span>
        </div>

        <div className={styles.snsButtons}>
          <button
            type="button"
            className={styles.kakaoBtn}
            onClick={() => handleSnsLogin('kakao')}
          >
            <KakaoIcon />
            카카오로 로그인
          </button>

          <button
            type="button"
            className={styles.naverBtn}
            onClick={() => handleSnsLogin('naver')}
          >
            <NaverIcon />
            네이버로 로그인
          </button>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={() => handleSnsLogin('google')}
          >
            <GoogleIcon />
            구글로 로그인
          </button>
        </div>

        <p className={styles.snsSignupNote}>
          SNS 로그인 시 계정이 없으면 자동으로 회원가입됩니다.
        </p>
      </div>
    </main>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 1C4.582 1 1 3.865 1 7.375c0 2.226 1.484 4.18 3.732 5.326L3.87 16.07a.25.25 0 0 0 .378.275L8.67 13.7c.108.007.217.01.33.01 4.418 0 8-2.865 8-6.375C17 3.865 13.418 1 9 1z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M10.13 9.27L7.5 5H5v8h2.87V9.73L10.5 13H13V5h-2.87v4.27z" fill="white" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.583 9 3.583z" fill="#EA4335"/>
    </svg>
  );
}
