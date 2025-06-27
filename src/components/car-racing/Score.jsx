import React from 'react';

const Score = ({ score, highScore }) => {
  return (
    <div className="score-display">
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
    </div>
  );
};

export default Score;