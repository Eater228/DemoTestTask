import './App.css';
import LoadingPage from './Components/LoadingPage/LoadingPage';
import MainPage from './Components/MainPage/MainPage';
import { useState, useEffect } from 'react';


const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const imagesToLoad = [
    `${import.meta.env.BASE_URL}/logo.png`,
    `${import.meta.env.BASE_URL}/menHalf.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/sumbol10.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/sumbolJ.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/sumbolQ.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/sumbolK.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/sumbolA.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/lure.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/fishingRod.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/boat.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/cooler.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/fish6.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/fish5.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/fish4.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/fish3.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/goldFish.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/fisherman.png`,
    `${import.meta.env.BASE_URL}/itemsSlots/scatter.png`,
    `${import.meta.env.BASE_URL}/cocos.png`
  ];

  const loadImagesWithProgress = async () => {
    let loadedCount = 0;
    const total = imagesToLoad.length;

    const updateProgress = () => {
      loadedCount += 1;
      const percent = Math.round((loadedCount / total) * 100);
      setProgress(percent);
    };

    const loadPromises = imagesToLoad.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = () => {
          console.warn(`Не вдалося завантажити: ${src}`);
          updateProgress();
          resolve(); // все одно рахуємо як "завантажене"
        };
      });
    });

    await Promise.all(loadPromises);
  };

  useEffect(() => {
    const loadAllResources = async () => {
      const imageLoadPromise = loadImagesWithProgress();
      const minDurationPromise = new Promise((resolve) => setTimeout(resolve, 1000));

      await Promise.all([imageLoadPromise, minDurationPromise]);

      setLoaded(true);
    };

    loadAllResources();
  }, []);

  return (
    <div className="window">
      {!loaded ? (
        <LoadingPage progress={progress} />
      ) : (
        <MainPage />
      )}
    </div>
  );
};

export default App;
