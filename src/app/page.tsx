'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import Keyboard from '@/components/Keyboard';
import Tutorial from '@/components/Tutorial';
import Message from '@/components/Message';
import GameResult from '@/components/GameResult';
import Stats from '@/components/Stats';
import { GameMode } from '@/utils/gameLogic';

export default function Home() {
  const {
    gameState,
    stats,
    handleLetterInput,
    handleBackspace,
    handleEnterKey,
    handleReset,
    handleCloseTutorial,
  } = useGame();

  const [showStats, setShowStats] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Check if the game is over
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      // Delay showing the result modal slightly for better UX
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShowResult(false);
    }
  }, [gameState.gameStatus]);

  // Handle game mode change
  const handleChangeMode = () => {
    const newMode: GameMode = gameState.mode === 'single' ? 'dual' : 'single';
    handleReset(newMode);
  };

  // Handle sharing results
  const handleShare = () => {
    // Generate emoji grid
    const emojiGrid = gameState.guesses.map(guess => {
      return guess.evaluation.map(state => {
        switch (state) {
          case 'correct':
            return '🟩';
          case 'present':
            return '🟨';
          case 'absent':
            return '⬛';
          default:
            return '⬜';
        }
      }).join('');
    }).join('\n');

    // Create share text
    const shareText = `Palavrix ${gameState.mode === 'dual' ? 'DUPLO' : ''} ${gameState.currentRow}/${gameState.maxAttempts}\n\n${emojiGrid}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      // Show a message that text was copied
      // This is handled by displaying the message state
      gameState.message = 'Copiado para a área de transferência!';
    }, (err) => {
      console.error('Erro ao copiar resultado: ', err);
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center">
      <Header
        onShowTutorial={() => handleCloseTutorial()}
        onShowStats={() => setShowStats(true)}
        onChangeMode={handleChangeMode}
        gameMode={gameState.mode}
      />

      <div className="flex-1 w-full max-w-3xl flex flex-col items-center justify-between py-8 px-4">
        <GameBoard gameState={gameState} />

        <Keyboard
          onKeyPress={handleLetterInput}
          onBackspace={handleBackspace}
          onEnter={handleEnterKey}
          keyboardState={gameState.keyboardState}
        />
      </div>

      {/* Tutorial modal */}
      {gameState.showTutorial && (
        <Tutorial onClose={handleCloseTutorial} />
      )}

      {/* Message notification */}
      <Message
        message={gameState.message}
        type={gameState.message === 'Palavra inválida' ? 'error' : 'info'}
      />

      {/* Game result modal */}
      {showResult && (
        <GameResult
          status={gameState.gameStatus as 'won' | 'lost'}
          targetWords={gameState.targetWords}
          attempts={gameState.currentRow}
          maxAttempts={gameState.maxAttempts}
          onPlayAgain={() => handleReset()}
          onShare={handleShare}
        />
      )}

      {/* Stats modal */}
      {showStats && (
        <Stats
          stats={stats}
          onClose={() => setShowStats(false)}
        />
      )}
    </main>
  );
} 