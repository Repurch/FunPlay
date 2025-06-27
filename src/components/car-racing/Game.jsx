import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import Car from './Car';
import Road from './Road';
import Obstacle from './Obstacle';
import Score from './Score';
import engineSound from '../../assets/engine.mp3';
import crashSound from '../../assets/crash.mp3';

// Game constants for better control
const INITIAL_SPEED = 2;
const MAX_SPEED = 8;
const SPEED_INCREMENT = 0.1;
const PLAYER_MOVEMENT = 5;
const OBSTACLE_GENERATION_INTERVAL = 2000; // ms
const OBSTACLE_MOVEMENT_SPEED = 0.3;

// Car dimensions and collision
const CAR_WIDTH = 80; // pixels
const CAR_HEIGHT = 160; // pixels
const CAR_COLLISION_WIDTH = 12; // collision boundary
const CAR_COLLISION_HEIGHT = 20; // collision boundary

const Game = () => {
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

    // Sound effects with error handling
    const soundEngine = useRef(null);
    const soundCrash = useRef(null);

    useEffect(() => {
        try {
            soundEngine.current = new Howl({ src: [engineSound], loop: true, volume: 0.5 });
            soundCrash.current = new Howl({ src: [crashSound], volume: 0.7 });
        } catch (error) {
            console.error("Error loading sounds:", error);
        }

        return () => {
            if (soundEngine.current) soundEngine.current.unload();
            if (soundCrash.current) soundCrash.current.unload();
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setObstacles([]);
        setPlayerPosition(50);
        speed.current = INITIAL_SPEED;
        lastObstacleTime.current = 0;
        if (soundEngine.current) soundEngine.current.play();
    };

    const endGame = () => {
        setGameOver(true);
        setGameStarted(false);
        if (soundEngine.current) soundEngine.current.stop();
        if (soundCrash.current) soundCrash.current.play();
        if (score > highScore) setHighScore(score);
        cancelAnimationFrame(animationFrameId.current);
    };

    // Handle keyboard input
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
                    left: Math.random() * 70 + 10, // Adjusted range for larger cars
                    top: -20, // Start higher to account for taller cars
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

            // Check collisions with updated values
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

            // Increase score and gradually increase speed
            setScore(prev => prev + 1);
            if (score % 100 === 0 && speed.current < MAX_SPEED) {
                speed.current += SPEED_INCREMENT;
            }

            animationFrameId.current = requestAnimationFrame(gameLoop);
        };

        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId.current);
    }, [gameStarted, playerPosition, obstacles, score]);

    return (
        <div className="game-container" ref={gameAreaRef}>
            <Road />

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
                <div className="game-controls">
                    <h1>Mini Car Racing Game</h1>
                    {gameOver && <h2>Game Over! Your score: {score}</h2>}
                    <button onClick={startGame}>
                        {gameOver ? 'Play Again' : 'Start Game'}
                    </button>
                    <div className="instructions">
                        <p>Use <strong>Left</strong> and <strong>Right</strong> arrow keys to move</p>
                        <p>Avoid other cars and score points!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;