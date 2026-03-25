import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { isLoggedIn, member, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 로고 */}
        <Link to="/" className={styles.logo}>
          📚 StudyCafe
        </Link>

        {/* 네비게이션 */}
        <nav className={styles.nav}>
          <Link to="/branches">지점 찾기</Link>
          {isLoggedIn && <Link to="/my/passes">내 이용권</Link>}
          {isLoggedIn && <Link to="/my/reservations">이용 현황</Link>}
          {isAdmin && <Link to="/admin">관리자</Link>}
        </nav>

        {/* 로그인/로그아웃 */}
        <div className={styles.auth}>
          {isLoggedIn ? (
            <>
              <span className={styles.nickname}>{member?.nickname}님</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
