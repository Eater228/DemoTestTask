import styles from "./InfoModal.module.scss";
type InfoModal = {
  onClose: () => void;
  imageSrc: Map<string | number, HTMLImageElement>;
}

const InfoModal = ({ onClose, imageSrc }: InfoModal) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackground}>
        <img src={`${imageSrc.get('logo')?.src}`} alt="logo" className={styles.logo} />
        <img src={`${imageSrc.get('stoneBackgroung')?.src}`} className={styles.modalImage} alt="background" />
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
              <img src={`${imageSrc.get('crossDisable')?.src}`} alt="cross" />
              <p>Without registration</p>
            </div>
          </div>
        </div>
        <button className={styles.closeButton} onClick={onClose} style={{
          background: `url(${import.meta.env.BASE_URL}/ButtonsState/buttonActive.png) center/100% 110px no-repeat`,
        }}>ACTIVATE</button>
      </div>
    </div>
  );
};

export default InfoModal;