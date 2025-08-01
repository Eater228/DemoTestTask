import './App.css';
import LoadingPage from './Components/LoadingPage/LoadingPage';
import MainPage from './Components/MainPage/MainPage';
import { useState, useEffect } from 'react';

const imagePaths = {
  0: `${import.meta.env.BASE_URL}itemsSlots/sumbol10.png`,
  1: `${import.meta.env.BASE_URL}itemsSlots/sumbolJ.png`,
  2: `${import.meta.env.BASE_URL}itemsSlots/sumbolQ.png`,
  3: `${import.meta.env.BASE_URL}itemsSlots/sumbolK.png`,
  4: `${import.meta.env.BASE_URL}itemsSlots/sumbolA.png`,
  5: `${import.meta.env.BASE_URL}itemsSlots/lure.png`,
  6: `${import.meta.env.BASE_URL}itemsSlots/fishingRod.png`,
  7: `${import.meta.env.BASE_URL}itemsSlots/boat.png`,
  8: `${import.meta.env.BASE_URL}itemsSlots/cooler.png`,
  9: `${import.meta.env.BASE_URL}itemsSlots/fish6.png`,
  10: `${import.meta.env.BASE_URL}itemsSlots/fish5.png`,
  11: `${import.meta.env.BASE_URL}itemsSlots/fish4.png`,
  12: `${import.meta.env.BASE_URL}itemsSlots/fish3.png`,
  13: `${import.meta.env.BASE_URL}itemsSlots/goldFish.png`,
  14: `${import.meta.env.BASE_URL}itemsSlots/fisherman.png`,
  15: `${import.meta.env.BASE_URL}itemsSlots/scatter.png`,
  logo: `${import.meta.env.BASE_URL}logo.png`,
  menHalf: `${import.meta.env.BASE_URL}menHalf.png`,
  cocos: `${import.meta.env.BASE_URL}cocos.png`,
  stoneBackgroung: `${import.meta.env.BASE_URL}/stoneBackground1.png`,
  crossDisable: `${import.meta.env.BASE_URL}/ButtonsState/crossDisable.png`,
  doneTick: `${import.meta.env.BASE_URL}/ButtonsState/doneTick.png`,
} as const;

const App = () => {
  const [loaded, setLoaded] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imageCache, setImageCache] = useState<Map<string | number, HTMLImageElement>>(new Map());

  useEffect(() => {
    const loadImages = async () => {
      const cache = new Map<string | number, HTMLImageElement>();
      const total = Object.keys(imagePaths).length;
      let loadedCount = 0;

      const updateProgress = () => {
        loadedCount += 1;
        setProgress(Math.round((loadedCount / total) * 100));
      };

      const loadImage = (key: string, src: string): Promise<void> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            const cacheKey = isNaN(Number(key)) ? key : Number(key);
            cache.set(cacheKey, img);
            updateProgress();
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            updateProgress();
            resolve();
          };
        });
      };

      const loadPromises = Object.entries(imagePaths).map(([key, src]) => 
        loadImage(key, src)
      );

      await Promise.all(loadPromises);
      setImageCache(cache);
      
      // Minimum loading time (1 second)
      const minLoadingTime = 1000;
      const loadingTime = Math.max(minLoadingTime - (performance.now() % minLoadingTime), 0);
      await new Promise(resolve => setTimeout(resolve, loadingTime));
      
      setLoaded(true);
    };

    loadImages().catch(error => {
      console.error('Error loading images:', error);
      setLoaded(true);
    });
  }, []);

  return (
    <div className="window">
      {!loaded ? (
        <LoadingPage progress={progress} />
      ) : (
        <MainPage imageCache={imageCache} />
      )}
    </div>
  );
};

export default App;