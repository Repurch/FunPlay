import React, { useState, useEffect } from 'react';
import PuzzleBoard from './PuzzleBoard';
import PuzzleControls from './PuzzleControls';

const PuzzleGame = ({ onBackToMenu }) => {
  const [size, setSize] = useState(3); // 3x3 grid
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [board, setBoard] = useState([]);
  const [emptyPos, setEmptyPos] = useState(size * size - 1); // Last tile is empty

  // Initialize the board
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

  // Arrow key movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSolved) return;

      let newEmptyPos = emptyPos;
      const row = Math.floor(emptyPos / size);
      const col = emptyPos % size;

      switch (e.key) {
        case 'ArrowUp':
          if (row < size - 1) newEmptyPos = emptyPos + size; // Move empty down
          break;
        case 'ArrowDown':
          if (row > 0) newEmptyPos = emptyPos - size; // Move empty up
          break;
        case 'ArrowLeft':
          if (col < size - 1) newEmptyPos = emptyPos + 1; // Move empty right
          break;
        case 'ArrowRight':
          if (col > 0) newEmptyPos = emptyPos - 1; // Move empty left
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, emptyPos, isSolved, moves, size]);

  return (
    <div className="puzzle-game">
      <h1>Arrow Key Puzzle</h1>
      <PuzzleControls 
        size={size} 
        setSize={setSize} 
        resetBoard={resetBoard} 
        onBackToMenu={onBackToMenu}
      />
      <PuzzleBoard board={board} size={size} />
      <div className="puzzle-info">
        <p>Moves: {moves}</p>
        {isSolved && <p className="solved">Puzzle Solved! 🎉</p>}
        <p className="instructions">Use arrow keys to move the empty space</p>
      </div>
    </div>
  );
};

export default PuzzleGame;