import React, { useState } from 'react';
import CarRacingGame from './components/car-racing/Game';
import PuzzleGame from './components/puzzle-game/PuzzleGame';
import './App.css';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  return (
    <div className="App">
      {!currentGame ? (
        <div className="game-menu">
          <h1>Choose a Game</h1>
          <button onClick={() => setCurrentGame('racing')}>Car Racing</button>
          <button onClick={() => setCurrentGame('puzzle')}>Sliding Puzzle</button>
        </div>
      ) : currentGame === 'racing' ? (
        <CarRacingGame onBackToMenu={() => setCurrentGame(null)} />
      ) : (
        <PuzzleGame onBackToMenu={() => setCurrentGame(null)} />
      )}
    </div>
  );
}

export default App;