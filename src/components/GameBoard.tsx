import React from 'react';
import Tile from './Tile';
import { GameState, LetterState } from '@/utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { guesses, currentGuess, maxAttempts, currentRow } = gameState;

  // Create a grid of tiles for the game board
  const renderBoard = () => {
    const rows = [];

    // Add completed rows (submitted guesses)
    for (let i = 0; i < guesses.length; i++) {
      const { word, evaluation } = guesses[i];
      const row = (
        <div key={`guess-${i}`} className="flex justify-center">
          {word.split('').map((letter, index) => (
            <Tile
              key={`tile-${i}-${index}`}
              letter={letter}
              state={evaluation[index]}
              position={index}
            />
          ))}
        </div>
      );
      rows.push(row);
    }

    // Add current row (if game is still in progress)
    if (currentRow < maxAttempts && gameState.gameStatus === 'playing') {
      const currentGuessLetters = currentGuess.split('');
      const row = (
        <div key="current-guess" className="flex justify-center">
          {Array(5).fill(null).map((_, index) => (
            <Tile
              key={`current-${index}`}
              letter={currentGuessLetters[index] || ''}
              state="empty"
              isActive={true}
            />
          ))}
        </div>
      );
      rows.push(row);
    }

    // Add empty rows for remaining attempts
    const remainingRows = maxAttempts - rows.length;
    for (let i = 0; i < remainingRows; i++) {
      const row = (
        <div key={`empty-${i}`} className="flex justify-center">
          {Array(5).fill(null).map((_, index) => (
            <Tile
              key={`empty-${i}-${index}`}
              letter=""
              state="empty"
            />
          ))}
        </div>
      );
      rows.push(row);
    }

    return rows;
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      {renderBoard()}
    </div>
  );
};

export default GameBoard; 