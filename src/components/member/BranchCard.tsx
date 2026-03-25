import { useNavigate } from 'react-router-dom';
import type { Branch } from '../../types';
import styles from './BranchCard.module.css';

interface Props {
  branch: Branch;
}

export default function BranchCard({ branch }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/branches/${branch.id}`)}
    >
      <div className={styles.statusBadge} data-active={branch.status === 'ACTIVE'}>
        {branch.status === 'ACTIVE' ? '영업중' : '휴업'}
      </div>
      <h3 className={styles.name}>{branch.name}</h3>
      <p className={styles.address}>{branch.address} {branch.detailAddress}</p>
      <p className={styles.contact}>📞 {branch.contactNumber}</p>
    </div>
  );
}
