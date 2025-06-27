import React from 'react';

const PuzzleControls = ({ size, setSize, resetBoard, onBackToMenu }) => {
  return (
    <div className="puzzle-controls">
      <select 
        value={size} 
        onChange={(e) => setSize(Number(e.target.value))}
      >
        <option value={3}>3x3 (Easy)</option>
        <option value={4}>4x4 (Medium)</option>
        <option value={5}>5x5 (Hard)</option>
      </select>
      <button onClick={resetBoard}>Reset</button>
      <button onClick={onBackToMenu}>Back to Menu</button>
    </div>
  );
};

export default PuzzleControls;