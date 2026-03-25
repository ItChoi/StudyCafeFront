import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          나에게 맞는 공간,<br />StudyCafe
        </h1>
        <p className={styles.subtitle}>
          전국 스터디카페 지점을 한 눈에 확인하고<br />
          편리하게 좌석을 예약하세요.
        </p>
        <div className={styles.actions}>
          <Link to="/branches" className={styles.primaryBtn}>
            지점 찾기
          </Link>
          <Link to="/login" className={styles.secondaryBtn}>
            로그인
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🗺️</span>
          <h3>지점 찾기</h3>
          <p>전국 StudyCafe 지점의 위치, 영업시간, 좌석 현황을 실시간으로 확인하세요.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>💺</span>
          <h3>좌석 예약</h3>
          <p>자유석, 고정석, 스터디룸 중 원하는 좌석을 앱에서 바로 예약하세요.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🎫</span>
          <h3>이용권 관리</h3>
          <p>시간형, 기간형, 횟수형 이용권을 구매하고 잔여 시간을 한눈에 확인하세요.</p>
        </div>
      </section>
    </main>
  );
}
