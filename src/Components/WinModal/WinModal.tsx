import { useEffect, useState, type FC } from 'react';
import styles from './WinModal.module.scss';

interface WinModalProps {
  onClose: () => void;
}

const WinModal: FC<WinModalProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 хвилин у секундах

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formatTime = (value: number) => String(value).padStart(2, "0");
  
  const handlerClick = () => {
    window.open('https://portfolioyurii.netlify.app/', '_blank');
    onClose();
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackground}>
        <img src="/logo.png" alt="logo" className={styles.logo} />
        <img src="/stoneBackground1.png" className={styles.modalImage} alt="background" />
        <div className={styles.modalHeader}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitel}>
              <h2>WELL DONE!</h2>
              <h3>YOU WON:</h3>
            </div>
            <div className={styles.mainText}>
              <h2>450 GPB</h2>
              <p>+ 250 Free spins</p>
            </div>
            <div className={styles.modalText}>
              <img src="/ButtonsState/doneTick.png" alt="cross" />
              <p>Turn on notifications and receive more special bonuses!</p>
            </div>
          </div>
        </div>
        <button className={styles.closeButton} onClick={handlerClick}>INSTAL THE APP</button>
      </div>
      <div className={styles.timerWrapper}>
        <p className={styles.title}>Bonus will expire in :</p>
        <div className={styles.timeContainer}>
          <h2 className={styles.time}>{formatTime(minutes)}</h2>
          <span className={styles.colon}>:</span>
          <h2 className={styles.time}>{formatTime(seconds)}</h2>
        </div>
        <div className={styles.labels}>
          <span className={styles.label}>MINUTES</span>
          <span className={styles.label}>SECONDS</span>
        </div>
      </div>
    </div>
  );
};

export default WinModal;