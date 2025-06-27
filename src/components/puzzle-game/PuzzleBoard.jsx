import React, { useState, useEffect } from 'react';

const PuzzleBoard = ({ board, size, onTileMove }) => {
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e, index) => {
    setTouchStart({
      index,
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Determine swipe direction (threshold: 20px)
    if (Math.max(absDx, absDy) < 20) return; // Ignore tiny movements

    if (absDx > absDy) {
      onTileMove(dx > 0 ? 'right' : 'left');
    } else {
      onTileMove(dy > 0 ? 'down' : 'up');
    }
  };

  return (
    <div 
      className="puzzle-board"
      style={{ 
        gridTemplateColumns: `repeat(${size}, 80px)`,
      }}
    >
      {board.map((num, index) => (
        <div
          key={index}
          className={`puzzle-tile ${num === 0 ? 'empty' : ''}`}
          onTouchStart={(e) => handleTouchStart(e, index)}
          onTouchEnd={handleTouchEnd}
          style={{
            width: '80px',
            height: '80px',
            fontSize: '24px',
            touchAction: 'none', // Prevent browser touch defaults
          }}
        >
          {num !== 0 ? num : ''}
        </div>
      ))}
    </div>
  );
};

export default PuzzleBoard;