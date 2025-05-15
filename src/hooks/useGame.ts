import { useState, useEffect, useCallback } from 'react';
import {
  GameState,
  GameMode,
  createInitialState,
  addLetter,
  removeLetter,
  makeGuess,
  resetGame,
  closeTutorial
} from '@/utils/gameLogic';

// Local storage keys
const GAME_STATE_KEY = 'palavrix_game_state';
const STATS_KEY = 'palavrix_stats';

// Stats interface
export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastPlayedDate: string;
}

// Create initial stats
const createInitialStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  lastPlayedDate: ''
});

export const useGame = () => {
  // Load saved state from localStorage or create new state
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(GAME_STATE_KEY);
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          console.error('Failed to parse saved game state', e);
        }
      }
    }
    return createInitialState();
  });

  // Load or initialize stats
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) {
        try {
          return JSON.parse(savedStats);
        } catch (e) {
          console.error('Failed to parse saved stats', e);
        }
      }
    }
    return createInitialStats();
  });

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  // Update stats when game ends
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' && gameState.guesses.length > 0) {
      // Get today's date as a string
      const today = new Date().toISOString().split('T')[0];

      // Only update stats if this is a new game (not a reload of a completed game)
      if (stats.lastPlayedDate !== today) {
        const newStats = { ...stats };

        newStats.gamesPlayed += 1;
        newStats.lastPlayedDate = today;

        if (gameState.gameStatus === 'won') {
          newStats.gamesWon += 1;
          newStats.currentStreak += 1;
          newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);

          // Update guess distribution (rows are 1-indexed but array is 0-indexed)
          const guessCount = gameState.currentRow;
          if (guessCount >= 1 && guessCount <= 6) {
            newStats.guessDistribution[guessCount - 1] += 1;
          }
        } else {
          // Reset streak on loss
          newStats.currentStreak = 0;
        }

        setStats(newStats);
      }
    }
  }, [gameState.gameStatus, gameState.guesses.length, gameState.currentRow, stats]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      const key = event.key.toUpperCase();

      if (key === 'ENTER') {
        handleEnterKey();
      } else if (key === 'BACKSPACE') {
        handleBackspace();
      } else if (/^[A-Z]$/.test(key)) {
        handleLetterInput(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);

  // Handler functions
  const handleLetterInput = useCallback((letter: string) => {
    setGameState(state => addLetter(state, letter));
  }, []);

  const handleBackspace = useCallback(() => {
    setGameState(state => removeLetter(state));
  }, []);

  const handleEnterKey = useCallback(() => {
    setGameState(state => makeGuess(state, state.currentGuess));
  }, []);

  const handleReset = useCallback((mode?: GameMode) => {
    setGameState(state => resetGame(state, mode));
  }, []);

  const handleCloseTutorial = useCallback(() => {
    setGameState(state => closeTutorial(state));
  }, []);

  return {
    gameState,
    stats,
    handleLetterInput,
    handleBackspace,
    handleEnterKey,
    handleReset,
    handleCloseTutorial
  };
}; 