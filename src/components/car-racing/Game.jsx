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
    const moveInterval = useRef(null);

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
            clearInterval(moveInterval.current);
        };
    }, []);

    // Mobile control functions
    const startMovingLeft = () => {
        clearInterval(moveInterval.current);
        moveInterval.current = setInterval(() => {
            setPlayerPosition(prev => Math.max(5, prev - PLAYER_MOVEMENT));
        }, 16); // ~60fps
    };

    const startMovingRight = () => {
        clearInterval(moveInterval.current);
        moveInterval.current = setInterval(() => {
            setPlayerPosition(prev => Math.min(95, prev + PLAYER_MOVEMENT));
        }, 16);
    };

    const stopMoving = () => {
        clearInterval(moveInterval.current);
    };

    // Keyboard controls
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

    // Game loop
    useEffect(() => {
        if (!gameStarted) return;

        const gameLoop = (timestamp) => {
            // Generate new obstacles
            if (timestamp - lastObstacleTime.current > OBSTACLE_GENERATION_INTERVAL) {
                const newObstacle = {
                    id: Date.now(),
                    left: Math.random() * 70 + 10,
                    top: -15,
                };
                setObstacles(prev => [...prev, newObstacle]);
                lastObstacleTime.current = timestamp;
            }

            // Move obstacles
            setObstacles(prev =>
                prev.map(obstacle => ({
                    ...obstacle,
                    top: obstacle.top + speed.current * OBSTACLE_MOVEMENT_SPEED,
                })).filter(obstacle => obstacle.top < 100)
            );

            // Check collisions
            const collision = obstacles.some(obstacle => {
                return (
                    Math.abs(playerPosition - obstacle.left) < 12 &&
                    (80 - obstacle.top) < 20
                );
            });

            if (collision) {
                endGame();
                return;
            }

            // Increase score
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
        clearInterval(moveInterval.current);
    };

    return (
        <div className="game-container" ref={gameAreaRef}>
            <Road />

            {/* Mobile Controls */}
            <div className="mobile-controls">
                <button
                    className="control-button left-button"
                    onTouchStart={startMovingLeft}
                    onTouchEnd={stopMoving}
                    onMouseDown={startMovingLeft}
                    onMouseUp={stopMoving}
                    onMouseLeave={stopMoving}
                >
                    ←
                </button>
                <button
                    className="control-button right-button"
                    onTouchStart={startMovingRight}
                    onTouchEnd={stopMoving}
                    onMouseDown={startMovingRight}
                    onMouseUp={stopMoving}
                    onMouseLeave={stopMoving}
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
                        <p>Mobile: Press and hold buttons</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;