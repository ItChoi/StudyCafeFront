import { Link } from 'react-router-dom';
import styles from './AdminDashboardPage.module.css';

export default function AdminDashboardPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>관리자 대시보드</h1>

      <div className={styles.grid}>
        <Link to="/admin/branches" className={styles.card}>
          <span className={styles.icon}>🏢</span>
          <h3>지점 관리</h3>
          <p>지점 등록, 수정, 영업시간 관리</p>
        </Link>

        <Link to="/admin/seats" className={styles.card}>
          <span className={styles.icon}>💺</span>
          <h3>좌석 관리</h3>
          <p>좌석 배치 및 그룹 관리</p>
        </Link>

        <Link to="/admin/passes" className={styles.card}>
          <span className={styles.icon}>🎫</span>
          <h3>이용권 관리</h3>
          <p>이용권 상품 등록 및 수정</p>
        </Link>

        <Link to="/admin/reservations" className={styles.card}>
          <span className={styles.icon}>📋</span>
          <h3>이용 현황</h3>
          <p>실시간 좌석 이용 현황 모니터링</p>
        </Link>
      </div>
    </main>
  );
}
