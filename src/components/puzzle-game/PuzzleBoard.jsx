import React from 'react';

const PuzzleBoard = ({ board, size }) => {
  const tileSize = 80; // pixels

  return (
    <div 
      className="puzzle-board"
      style={{ 
        gridTemplateColumns: `repeat(${size}, ${tileSize}px)`,
        width: `${size * tileSize}px`,
      }}
    >
      {board.map((num, index) => (
        <div
          key={index}
          className={`puzzle-tile ${num === 0 ? 'empty' : ''}`}
          style={{
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            fontSize: `${tileSize / 3}px`,
          }}
        >
          {num !== 0 ? num : ''}
        </div>
      ))}
    </div>
  );
};

export default PuzzleBoard;