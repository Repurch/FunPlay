import React, { useState, useEffect } from 'react';
import PuzzleBoard from './PuzzleBoard';
import PuzzleControls from './PuzzleControls';

const PuzzleGame = ({ onBackToMenu }) => {
  const [size, setSize] = useState(3);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [board, setBoard] = useState([]);
  const [emptyPos, setEmptyPos] = useState(size * size - 1);

  // Initialize board
  useEffect(() => {
    resetBoard();
  }, [size]);

  const resetBoard = () => {
    const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    const shuffled = [...numbers, 0].sort(() => Math.random() - 0.5);
    setBoard(shuffled);
    setEmptyPos(shuffled.indexOf(0));
    setMoves(0);
    setIsSolved(false);
  };

  // Movement function (now properly defined)
  const moveTile = (direction) => {
    if (isSolved) return;

    let newEmptyPos = emptyPos;
    const row = Math.floor(emptyPos / size);
    const col = emptyPos % size;

    switch (direction) {
      case 'up':
        if (row < size - 1) newEmptyPos = emptyPos + size;
        break;
      case 'down':
        if (row > 0) newEmptyPos = emptyPos - size;
        break;
      case 'left':
        if (col < size - 1) newEmptyPos = emptyPos + 1;
        break;
      case 'right':
        if (col > 0) newEmptyPos = emptyPos - 1;
        break;
      default:
        return;
    }

    if (newEmptyPos !== emptyPos) {
      const newBoard = [...board];
      [newBoard[emptyPos], newBoard[newEmptyPos]] = [newBoard[newEmptyPos], newBoard[emptyPos]];
      setBoard(newBoard);
      setEmptyPos(newEmptyPos);
      setMoves(moves + 1);

      // Check if solved
      const isCorrect = newBoard.every((num, i) => 
        i === newBoard.length - 1 ? num === 0 : num === i + 1
      );
      if (isCorrect) setIsSolved(true);
    }
  };

  // Keyboard controls (optional)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSolved) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        moveTile(e.key.replace('Arrow', '').toLowerCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, emptyPos, isSolved, moves, size]);

  return (
    <div className="puzzle-game">
      <h1>Sliding Puzzle</h1>
      <PuzzleControls 
        size={size} 
        setSize={setSize} 
        resetBoard={resetBoard} 
        onBackToMenu={onBackToMenu}
      />
      <PuzzleBoard 
        board={board} 
        size={size} 
        onTileMove={moveTile} // Pass the function here
      />
      <div className="puzzle-info">
        <p>Moves: {moves}</p>
        {isSolved && <p className="solved">Puzzle Solved! 🎉</p>}
        <p className="instructions">
          {/Android|iPhone|iPad/i.test(navigator.userAgent) 
            ? "Swipe tiles to move" 
            : "Use arrow keys or swipe"}
        </p>
      </div>
    </div>
  );
};

export default PuzzleGame;