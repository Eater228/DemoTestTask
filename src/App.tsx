import './App.css';
import LoadingPage from './Components/LoadingPage/LoadingPage';
import MainPage from './Components/MainPage/MainPage';
import { useState, useEffect } from 'react';


const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const imagesToLoad = [
    "/logo.png",
    "/menHalf.png",
    "/itemsSlots/sumbol10.png",
    "/itemsSlots/sumbolJ.png",
    "/itemsSlots/sumbolQ.png",
    "/itemsSlots/sumbolK.png",
    "/itemsSlots/sumbolA.png",
    "/itemsSlots/lure.png",
    "/itemsSlots/fishingRod.png",
    "/itemsSlots/boat.png",
    "/itemsSlots/cooler.png",
    "/itemsSlots/fish6.png",
    "/itemsSlots/fish5.png",
    "/itemsSlots/fish4.png",
    "/itemsSlots/fish3.png",
    "/itemsSlots/goldFish.png",
    "/itemsSlots/fisherman.png",
    "/itemsSlots/scatter.png",
    "/cocos.png"
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
