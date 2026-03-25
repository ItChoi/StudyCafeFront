import type { BranchSeat } from '../../types';
import { formatSeatType } from '../../utils/format';
import styles from './SeatMap.module.css';

interface Props {
  seats: BranchSeat[];
  selectedSeatId?: number | null;
  onSelectSeat?: (seat: BranchSeat) => void;
}

export default function SeatMap({ seats, selectedSeatId, onSelectSeat }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.legend}>
        <span className={styles.legendItem} data-type="available">선택 가능</span>
        <span className={styles.legendItem} data-type="occupied">이용중</span>
        <span className={styles.legendItem} data-type="selected">선택됨</span>
      </div>

      <div className={styles.grid}>
        {seats.map((seat) => {
          const isOccupied = seat.status === 'INACTIVE';
          const isSelected = selectedSeatId === seat.id;

          return (
            <button
              key={seat.id}
              className={styles.seat}
              data-occupied={isOccupied}
              data-selected={isSelected}
              disabled={isOccupied}
              onClick={() => onSelectSeat?.(seat)}
              title={`${seat.seatNumber} (${formatSeatType(seat.type)})`}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
