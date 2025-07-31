import styles from "./LoadingPage.module.scss";

type LoadingPageProps = {
  progress: number;
  onLoaded?: () => void;
};

const LoadingPage = ({ progress }: LoadingPageProps) => {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.logo}></div>
      <div className={styles.menFull}>
        <div className={styles.loadPlace}>
          <div
            className={styles.loaderBar}
            style={{ width: `${progress}%` }}
          >
          </div>
          <img
            src={`${import.meta.env.BASE_URL}cocos.png`}
            alt="cocos"
            className={styles.cocosImg}
            style={{ left: `calc(${progress}% - 20px)` }} // рухаємо картинку по прогресу
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;