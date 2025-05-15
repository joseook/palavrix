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

  // Client-side only state
  const [mounted, setMounted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [darkMode, setDarkMode] = useState(true);
  const [animateWrong, setAnimateWrong] = useState(false);

  // Only render UI after component has mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShowResult(false);
    }
  }, [gameState.gameStatus]);

  useEffect(() => {
    if (gameState.message === 'Palavra inválida') {
      setAnimateWrong(true);
      const timer = setTimeout(() => {
        setAnimateWrong(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.message]);

  const handleChangeMode = () => {
    const newMode: GameMode = gameState.mode === 'single' ? 'dual' : 'single';
    handleReset(newMode);
  };

  const handleShowHint = () => {
    if (hintsLeft > 0 && gameState.gameStatus === 'playing') {
      setHintsLeft(hintsLeft - 1);
      setShowHint(true);

      setTimeout(() => {
        setShowHint(false);
      }, 3000);
    }
  };

  const handleShare = () => {
    const generateEmojiGrid = (targetIndex = 0) => {
      return gameState.guesses.map(guess => {
        let evaluation;
        if (gameState.mode === 'dual' && targetIndex === 1) {
          const { word } = guess;
          evaluation = gameState.targetWords.map(target => {
            const row = Array(word.length).fill('⬜');
            const normalizedTarget = target.toUpperCase();
            const normalizedGuess = word.toUpperCase();

            for (let i = 0; i < word.length; i++) {
              if (normalizedGuess[i] === normalizedTarget[i]) {
                row[i] = '🟩';
              }
            }

            const targetLetters: Record<string, number> = {};
            for (let i = 0; i < normalizedTarget.length; i++) {
              if (row[i] !== '🟩') {
                const letter = normalizedTarget[i];
                targetLetters[letter] = (targetLetters[letter] || 0) + 1;
              }
            }

            for (let i = 0; i < word.length; i++) {
              if (row[i] !== '🟩') {
                const letter = normalizedGuess[i];
                if (targetLetters[letter] && targetLetters[letter] > 0) {
                  row[i] = '🟨';
                  targetLetters[letter]--;
                } else {
                  row[i] = '⬛';
                }
              }
            }

            return row;
          })[targetIndex];
        } else {
          evaluation = guess.evaluation.map(state => {
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
          });
        }

        return evaluation.join('');
      }).join('\n');
    };

    let shareText;
    if (gameState.mode === 'single') {
      shareText = `Palavrix ${gameState.currentRow}/${gameState.maxAttempts}\n\n${generateEmojiGrid()}`;
    } else {
      shareText = `Palavrix DUPLO ${gameState.currentRow}/${gameState.maxAttempts}\n\n` +
        `Palavra 1:\n${generateEmojiGrid(0)}\n\n` +
        `Palavra 2:\n${generateEmojiGrid(1)}`;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        gameState.message = 'Copiado para a área de transferência!';
      }, (err) => {
        console.error('Erro ao copiar resultado: ', err);
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light-mode');
    }
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <main className={`min-h-screen flex flex-col items-center ${animateWrong ? 'shake-animation' : ''}`}>
      <Header
        onShowTutorial={() => gameState.showTutorial ? null : handleCloseTutorial()}
        onShowStats={() => setShowStats(true)}
        onChangeMode={handleChangeMode}
        gameMode={gameState.mode}
        onShowSettings={() => setShowSettings(!showSettings)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {showSettings && (
        <div className="absolute top-16 right-4 bg-gray-800 rounded-md shadow-lg p-4 z-40">
          <div className="flex flex-col space-y-3">
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 text-sm"
            >
              <span>{darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}</span>
            </button>
            <button
              onClick={handleShowHint}
              className={`flex items-center space-x-2 text-sm ${hintsLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={hintsLeft === 0}
            >
              <span>💡 Usar Dica ({hintsLeft} restantes)</span>
            </button>
            <button
              onClick={() => handleReset()}
              className="flex items-center space-x-2 text-sm text-red-400"
            >
              <span>🔄 Nova Palavra</span>
            </button>
          </div>
        </div>
      )}

      {showHint && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
          <p className="text-sm">Dica: A primeira letra é <strong>{gameState.targetWords[0][0]}</strong></p>
          {gameState.mode === 'dual' && (
            <p className="text-sm mt-1">Segunda palavra: <strong>{gameState.targetWords[1][0]}</strong></p>
          )}
        </div>
      )}

      <div className="flex-1 w-full max-w-6xl flex flex-col items-center justify-between py-6 px-4">
        <GameBoard gameState={gameState} />

        <Keyboard
          onKeyPress={handleLetterInput}
          onBackspace={handleBackspace}
          onEnter={handleEnterKey}
          keyboardState={gameState.keyboardState}
        />
      </div>

      {gameState.showTutorial && (
        <Tutorial onClose={handleCloseTutorial} />
      )}

      <Message
        message={gameState.message}
        type={gameState.message === 'Palavra inválida' ? 'error' : 'info'}
      />

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

      {showStats && (
        <Stats
          stats={stats}
          onClose={() => setShowStats(false)}
        />
      )}
    </main>
  );
}