import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import Car from './Car';
import Road from './Road';
import Obstacle from './Obstacle';
import Score from './Score';
import engineSound from '../../assets/engine.mp3';
import crashSound from '../../assets/crash.mp3';

// Game constants
const INITIAL_SPEED = 2;
const MAX_SPEED = 8;
const SPEED_INCREMENT = 0.1;
const PLAYER_MOVEMENT = 5;
const OBSTACLE_GENERATION_INTERVAL = 2000;
const OBSTACLE_MOVEMENT_SPEED = 0.3;
const CAR_WIDTH = 80;
const CAR_HEIGHT = 160;
const CAR_COLLISION_WIDTH = 12;
const CAR_COLLISION_HEIGHT = 20;

const Game = ({ onBackToMenu }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [playerPosition, setPlayerPosition] = useState(50);
    const [obstacles, setObstacles] = useState([]);
    const gameAreaRef = useRef(null);
    const animationFrameId = useRef(null);
    const lastObstacleTime = useRef(0);
    const speed = useRef(INITIAL_SPEED);
    const touchActive = useRef(false);
    const touchDirection = useRef(null);

    // Sound effects
    const soundEngine = useRef(null);
    const soundCrash = useRef(null);

    useEffect(() => {
        soundEngine.current = new Howl({ src: [engineSound], loop: true, volume: 0.5 });
        soundCrash.current = new Howl({ src: [crashSound], volume: 0.7 });

        return () => {
            soundEngine.current.unload();
            soundCrash.current.unload();
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    // Touch event handlers
    const handleTouchStart = (direction) => {
        touchActive.current = true;
        touchDirection.current = direction;
    };

    const handleTouchEnd = () => {
        touchActive.current = false;
        touchDirection.current = null;
    };

    // Handle continuous movement while touch is active
    useEffect(() => {
        if (!gameStarted || !touchActive.current) return;

        const moveInterval = setInterval(() => {
            if (touchDirection.current === 'left') {
                setPlayerPosition(prev => Math.max(5, prev - PLAYER_MOVEMENT));
            } else if (touchDirection.current === 'right') {
                setPlayerPosition(prev => Math.min(95, prev + PLAYER_MOVEMENT));
            }
        }, 100);

        return () => clearInterval(moveInterval);
    }, [gameStarted]);

    // Keyboard controls (unchanged)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameStarted) return;

            if (e.key === 'ArrowLeft') {
                setPlayerPosition(prev => Math.max(5, prev - PLAYER_MOVEMENT));
            } else if (e.key === 'ArrowRight') {
                setPlayerPosition(prev => Math.min(95, prev + PLAYER_MOVEMENT));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStarted]);

    // Game loop (unchanged)
    useEffect(() => {
        if (!gameStarted) return;

        const gameLoop = (timestamp) => {
            if (timestamp - lastObstacleTime.current > OBSTACLE_GENERATION_INTERVAL) {
                const newObstacle = {
                    id: Date.now(),
                    left: Math.random() * 70 + 10,
                    top: -20,
                };
                setObstacles(prev => [...prev, newObstacle]);
                lastObstacleTime.current = timestamp;
            }

            setObstacles(prev =>
                prev.map(obstacle => ({
                    ...obstacle,
                    top: obstacle.top + speed.current * OBSTACLE_MOVEMENT_SPEED,
                })).filter(obstacle => obstacle.top < 100)
            );

            const collision = obstacles.some(obstacle => {
                return (
                    Math.abs(playerPosition - obstacle.left) < CAR_COLLISION_WIDTH &&
                    (80 - obstacle.top) < CAR_COLLISION_HEIGHT
                );
            });

            if (collision) {
                endGame();
                return;
            }

            setScore(prev => prev + 1);
            if (score % 100 === 0 && speed.current < MAX_SPEED) {
                speed.current += SPEED_INCREMENT;
            }

            animationFrameId.current = requestAnimationFrame(gameLoop);
        };

        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId.current);
    }, [gameStarted, playerPosition, obstacles, score]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setObstacles([]);
        setPlayerPosition(50);
        speed.current = INITIAL_SPEED;
        lastObstacleTime.current = 0;
        soundEngine.current.play();
    };

    const endGame = () => {
        setGameOver(true);
        setGameStarted(false);
        soundEngine.current.stop();
        soundCrash.current.play();
        if (score > highScore) setHighScore(score);
        cancelAnimationFrame(animationFrameId.current);
    };

    return (
        <div className="game-container" ref={gameAreaRef}>
            <Road />

            {/* Mobile Controls */}
            <div className="mobile-controls">
                <button
                    className="control-button left-button"
                    onTouchStart={() => handleTouchStart('left')}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={() => handleTouchStart('left')}
                    onMouseUp={handleTouchEnd}
                    onMouseLeave={handleTouchEnd}
                >
                    ←
                </button>
                <button
                    className="control-button right-button"
                    onTouchStart={() => handleTouchStart('right')}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={() => handleTouchStart('right')}
                    onMouseUp={handleTouchEnd}
                    onMouseLeave={handleTouchEnd}
                >
                    →
                </button>
            </div>

            {/* Back Button */}
            <button className="back-button" onClick={onBackToMenu}>
                ← Menu
            </button>

            {gameStarted && (
                <>
                    <Car position={playerPosition} isPlayer={true} />
                    {obstacles.map(obstacle => (
                        <Obstacle key={obstacle.id} left={obstacle.left} top={obstacle.top} />
                    ))}
                </>
            )}

            <Score score={score} highScore={highScore} />

            {!gameStarted && (
                <div className="game-menu">
                    <h1>Car Racing</h1>
                    {gameOver && <h2>Game Over! Score: {score}</h2>}
                    <button onClick={startGame}>
                        {gameOver ? 'Play Again' : 'Start Race'}
                    </button>
                    <div className="controls-info">
                        <p>Keyboard: ← → arrows</p>
                        <p>Mobile: Tap buttons below</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;