import { useBranches } from '../../hooks/useBranches';
import BranchCard from '../../components/member/BranchCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import styles from './BranchListPage.module.css';

export default function BranchListPage() {
  const { branches, loading, error } = useBranches();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>지점 목록</h1>
      <p className={styles.count}>총 {branches.length}개 지점</p>

      <div className={styles.grid}>
        {branches.length === 0 ? (
          <p className={styles.empty}>등록된 지점이 없습니다.</p>
        ) : (
          branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))
        )}
      </div>
    </main>
  );
}
