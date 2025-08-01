import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './MainPage.module.scss';
import InfoModal from '../InfoModal/InfoModal';
import WinModal from '../WinModal/WinModal';
import classnames from 'classnames';

type MainPageProps = {
  imageCache: Map<string | number, HTMLImageElement>; // Changed to Map
};

const MainPage = ({ imageCache }: MainPageProps) => {
  const [spins, setSpins] = useState(3);
  const [displayPosition, setDisplayPosition] = useState<number[][]>([
    [10, 0, 11],
    [14, 5, 2],
    [3, 11, 8]
  ]);
  const [targetPosition, setTargetPosition] = useState<number[][]>([
    [4, 9, 6],
    [8, 8, 5],
    [10, 14, 1]
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(true);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [winningCells, setWinningCells] = useState<{ row: number, col: number }[]>([]);
  const [highlightedCells, setHighlightedCells] = useState<{ row: number, col: number }[]>([]);

  const winningCellsMap = useMemo(() => {
    const map = new Map<string, boolean>();
    highlightedCells.forEach(({ row, col }) => {
      map.set(`${row},${col}`, true);
    });
    return map;
  }, [highlightedCells]);

  const getIsWinning = useCallback((row: number, col: number) => {
    return winningCellsMap.get(`${row},${col}`) === true;
  }, [winningCellsMap]);

  const checkWinningLines = useCallback((position: number[][]) => {
    const cells: { row: number, col: number }[] = [];

    for (let row = 0; row < 3; row++) {
      if (position[row][0] === position[row][1] && position[row][1] === position[row][2]) {
        cells.push({ row, col: 0 }, { row, col: 1 }, { row, col: 2 });
      }
    }

    for (let col = 0; col < 3; col++) {
      if (position[0][col] === position[1][col] && position[1][col] === position[2][col]) {
        cells.push({ row: 0, col }, { row: 1, col }, { row: 2, col });
      }
    }

    if (position[0][0] === position[1][1] && position[1][1] === position[2][2]) {
      cells.push({ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 });
    }

    if (position[0][2] === position[1][1] && position[1][1] === position[2][0]) {
      cells.push({ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 });
    }

    return cells;
  }, []);

  const getRandomSymbol = useCallback(() => {
    const keys = Array.from(imageCache.keys())
      .filter(key => typeof key === 'number')
      .map(Number);
    return keys[Math.floor(Math.random() * keys.length)];
  }, [imageCache]);

  const spinColumn = useCallback(async (colIndex: number, spinDuration: number) => {
    const startTime = Date.now();
    const endTime = startTime + spinDuration;
    const columnDelay = colIndex * 300;

    await new Promise(resolve => setTimeout(resolve, columnDelay));

    while (Date.now() < endTime) {
      const remainingTime = endTime - Date.now();
      const isSlowingDown = remainingTime < 1000;

      setDisplayPosition(prev => {
        const newPosition = prev.map(row => [...row]);
        for (let row = 0; row < 3; row++) {
          if (!isSlowingDown || Math.random() > 0.7) {
            newPosition[row][colIndex] = getRandomSymbol();
          }
        }
        return newPosition;
      });

      const delay = isSlowingDown ? 150 : 50;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setDisplayPosition(prev => {
      const newPosition = prev.map(row => [...row]);
      for (let row = 0; row < 3; row++) {
        newPosition[row][colIndex] = targetPosition[row][colIndex];
      }
      return newPosition;
    });
  }, [targetPosition, getRandomSymbol]);

  const handlerClick = useCallback(async () => {
    if (isSpinning || spins <= 0) return;

    setIsSpinning(true);
    setWinningCells([]);
    setHighlightedCells([]);

    const currentPosition = 4 - spins;
    let newTargetPosition: number[][];

    if (currentPosition === 0) {
      newTargetPosition = [[4, 9, 6], [8, 8, 5], [10, 14, 1]];
    } else if (currentPosition === 1) {
      newTargetPosition = [[12, 11, 0], [13, 13, 7], [6, 8, 2]];
    } else {
      newTargetPosition = [[7, 6, 1], [15, 15, 15], [5, 13, 3]];
    }

    setTargetPosition(newTargetPosition);
    setSpins(prev => prev - 1);

    const spinDurations = [3000, 3500, 4000];
    await Promise.all([
      spinColumn(0, spinDurations[0]),
      spinColumn(1, spinDurations[1]),
      spinColumn(2, spinDurations[2])
    ]);

    const cells = checkWinningLines(targetPosition); // Changed to use newTargetPosition
    if (cells.length > 0) {
      setWinningCells(cells);
    }

    setIsSpinning(false);
  }, [isSpinning, spins, spinColumn, checkWinningLines]);

  useEffect(() => {
    if (winningCells.length > 0) {
      setHighlightedCells(winningCells);
      setTimeout(() => {
        setIsWinModalOpen(true);
      }, 2000);
    }
  }, [winningCells]);

  // Removed the preloadImages effect since images are already preloaded in App

  return (
    <>
      {isInfoModalOpen && <InfoModal onClose={() => setIsInfoModalOpen(false)} imageSrc={imageCache} />}
      {isWinModalOpen && (
        <WinModal onClose={() => {
          setIsWinModalOpen(false);
          setHighlightedCells([]);
        }}
        imageSrc={imageCache}
        />
      )}

      <div className={styles.mainPageContainer}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img
              src={`${imageCache.get('logo')?.src}`}
              alt="Logo"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className={styles.men}>
            <img
              src={`${imageCache.get('menHalf')?.src}`}
              alt="Men"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className={styles.mainArea}>
          <div className={styles.imageWrapper}>
            {[1, 3, 5, 7].flatMap(i => [
              <div key={`b${i}`} className={classnames(styles.bubble, styles[`b${i}`])} />,
              <div key={`b${i}-d`} className={classnames(styles.bubble, styles[`b${i}`], styles.delay)} />
            ])}

            {displayPosition.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isWinning = getIsWinning(rowIndex, colIndex);

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={classnames(styles.cell, { [styles.winningCell]: isWinning })}
                    style={{
                      gridColumn: `${1 + colIndex * 2 + 1} / ${1 + colIndex * 2 + 2}`,
                      gridRow: `${rowIndex + 1}`
                    }}
                  >
                    <img
                      src={`${imageCache.get(cell)?.src}`}
                      alt={`icon-${cell}`}
                      className={classnames(styles.cellImage, { [styles.winningImage]: isWinning })}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.infoWrapper}>
          <div className={styles.info}><h2>FREE SPINS: {spins}</h2></div>
        </div>

        <div className={styles.button}>
          <button
            className={styles.neonButton}
            onClick={handlerClick}
            disabled={isSpinning || spins <= 0}
            style={{
              backgroundImage: `url("${import.meta.env.BASE_URL}/ButtonsState/button${isSpinning || spins <= 0 ? 'Disable' : 'Active'}.png")`,
              backgroundPosition: 'center',
              backgroundSize: '100% 110px',
              backgroundRepeat: 'no-repeat'
            }}
          >
            SPIN
          </button>
        </div>
      </div>
    </>
  );
};

export default MainPage;