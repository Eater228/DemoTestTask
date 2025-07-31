import styles from "./InfoModal.module.scss";

const InfoModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackground}>
      <img src="/logo.png" alt="logo" className={styles.logo} />
          <img src="/stoneBackground1.png" className={styles.modalImage} alt="background" />
        <div className={styles.modalHeader}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitel}>
              <h2>WOW!</h2>
              <h3>YOU RECEIVED:</h3>
            </div>
            <div className={styles.mainText}>
              <h2>3 FREE SPINS</h2>
            </div>
            <div className={styles.modalText}>
              <img src="/ButtonsState/crossDisable.png" alt="cross" />
              <p>Without registration</p>
            </div>
          </div>
        </div>
          <button className={styles.closeButton} onClick={onClose}>ACTIVATE</button>
      </div>
    </div>
  );
};

export default InfoModal;