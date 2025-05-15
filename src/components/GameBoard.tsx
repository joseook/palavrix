import React from 'react';
import Tile from './Tile';
import { GameState, LetterState, evaluateGuess } from '@/utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { guesses, currentGuess, maxAttempts, currentRow, mode, targetWords } = gameState;

  // Renderiza uma grade individual
  const renderGrid = (targetIndex: number = 0) => {
    const rows = [];

    // Adiciona linhas completas (palpites enviados)
    for (let i = 0; i < guesses.length; i++) {
      const { word } = guesses[i];
      // Para o modo duplo, avaliamos cada palavra contra o alvo específico
      const evaluation = mode === 'dual' && targetIndex === 1
        ? evaluateGuess(word, targetWords[1])
        : guesses[i].evaluation;

      const row = (
        <div key={`guess-${targetIndex}-${i}`} className="flex justify-center">
          {word.split('').map((letter, index) => (
            <Tile
              key={`tile-${targetIndex}-${i}-${index}`}
              letter={letter}
              state={evaluation[index]}
              position={index}
            />
          ))}
        </div>
      );
      rows.push(row);
    }

    // Adiciona a linha atual (se o jogo ainda estiver em andamento)
    if (currentRow < maxAttempts && gameState.gameStatus === 'playing') {
      const currentGuessLetters = currentGuess.split('');
      const row = (
        <div key={`current-${targetIndex}`} className="flex justify-center">
          {Array(5).fill(null).map((_, index) => (
            <Tile
              key={`current-${targetIndex}-${index}`}
              letter={currentGuessLetters[index] || ''}
              state="empty"
              isActive={true}
            />
          ))}
        </div>
      );
      rows.push(row);
    }

    // Adiciona linhas vazias para as tentativas restantes
    const remainingRows = maxAttempts - rows.length;
    for (let i = 0; i < remainingRows; i++) {
      const row = (
        <div key={`empty-${targetIndex}-${i}`} className="flex justify-center">
          {Array(5).fill(null).map((_, index) => (
            <Tile
              key={`empty-${targetIndex}-${i}-${index}`}
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
    <>
      {mode === 'single' ? (
        // Modo único - apenas uma grade
        <div className="grid grid-cols-1 gap-1 mb-8">
          {renderGrid()}
        </div>
      ) : (
        // Modo duplo - duas grades lado a lado ou empilhadas dependendo do tamanho da tela
        <div className="w-full flex flex-col md:flex-row justify-center gap-8 mb-8">
          <div className="grid grid-cols-1 gap-1">
            {renderGrid(0)}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {renderGrid(1)}
          </div>
        </div>
      )}
    </>
  );
};

export default GameBoard; 