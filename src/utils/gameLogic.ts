import { getRandomWord, getRandomPair, isValidGuess, normalizeWord } from './words';

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface TileData {
  letter: string;
  state: LetterState;
}

export interface GuessResult {
  word: string;
  evaluation: LetterState[];
}

export type GameMode = 'single' | 'dual';

export interface GameState {
  mode: GameMode;
  targetWords: string[];
  guesses: GuessResult[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  currentRow: number;
  maxAttempts: number;
  keyboardState: Record<string, LetterState>;
  message: string | null;
  showTutorial: boolean;
  dualWordStatus: ('pending' | 'won')[];
}

// Create an initial game state
export const createInitialState = (mode: GameMode = 'single'): GameState => {
  const targetWords = mode === 'single'
    ? [getRandomWord()]
    : getRandomPair();

  return {
    mode,
    targetWords,
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    currentRow: 0,
    maxAttempts: 6,
    keyboardState: {},
    message: null,
    showTutorial: true,
    dualWordStatus: mode === 'single' ? ['pending'] : ['pending', 'pending']
  };
};

// Evaluate a guess against a target word
export const evaluateGuess = (guess: string, targetWord: string): LetterState[] => {
  const normalizedGuess = normalizeWord(guess);
  const normalizedTarget = normalizeWord(targetWord);

  // Initialize all states as 'absent'
  const result: LetterState[] = Array(guess.length).fill('absent');

  // First pass: mark correct letters
  for (let i = 0; i < normalizedGuess.length; i++) {
    if (normalizedGuess[i] === normalizedTarget[i]) {
      result[i] = 'correct';
    }
  }

  // Second pass: mark present letters
  // Count remaining target letters (those not marked as correct)
  const targetLetterCounts: Record<string, number> = {};
  for (let i = 0; i < normalizedTarget.length; i++) {
    if (result[i] !== 'correct') {
      const letter = normalizedTarget[i];
      targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    }
  }

  // Mark present letters
  for (let i = 0; i < normalizedGuess.length; i++) {
    if (result[i] !== 'correct') {
      const letter = normalizedGuess[i];
      if (targetLetterCounts[letter] && targetLetterCounts[letter] > 0) {
        result[i] = 'present';
        targetLetterCounts[letter]--;
      }
    }
  }

  return result;
};

// Process a guess in dual mode
export const evaluateGuessDual = (guess: string, targetWords: string[]): LetterState[][] => {
  return targetWords.map(target => evaluateGuess(guess, target));
};

// Update the keyboard state based on the latest evaluations
export const updateKeyboardState = (
  currentState: Record<string, LetterState>,
  guess: string,
  evaluation: LetterState[]
): Record<string, LetterState> => {
  const newState = { ...currentState };

  for (let i = 0; i < guess.length; i++) {
    const letter = normalizeWord(guess[i]);
    const currentKeyState = newState[letter];
    const newKeyState = evaluation[i];

    // Only update if the new state is better than the current one
    if (
      !currentKeyState ||
      (currentKeyState === 'absent' && (newKeyState === 'present' || newKeyState === 'correct')) ||
      (currentKeyState === 'present' && newKeyState === 'correct')
    ) {
      newState[letter] = newKeyState;
    }
  }

  return newState;
};

// Make a guess in the game
export const makeGuess = (state: GameState, guess: string): GameState => {
  if (state.gameStatus !== 'playing') {
    return state;
  }

  const normalizedGuess = normalizeWord(guess);

  // Validate guess length
  if (normalizedGuess.length !== 5) {
    return {
      ...state,
      message: 'A palavra deve ter 5 letras'
    };
  }

  // Validate if the guess is a valid word
  if (!isValidGuess(normalizedGuess)) {
    return {
      ...state,
      message: 'Palavra inválida'
    };
  }

  // Clear any previous message
  const newState = { ...state, message: null };

  // Evaluate the guess
  let evaluations: LetterState[];
  if (newState.mode === 'single') {
    evaluations = evaluateGuess(normalizedGuess, newState.targetWords[0]);
  } else {
    // For dual mode, we use the first evaluation for game progress
    evaluations = evaluateGuess(normalizedGuess, newState.targetWords[0]);
  }

  // Update guesses
  const newGuess: GuessResult = {
    word: normalizedGuess,
    evaluation: evaluations
  };

  const newGuesses = [...newState.guesses, newGuess];
  const newRow = newState.currentRow + 1;

  // Update keyboard state
  const newKeyboardState = updateKeyboardState(
    newState.keyboardState,
    normalizedGuess,
    evaluations
  );

  // Check dual word status
  let newDualWordStatus = [...newState.dualWordStatus];
  if (newState.mode === 'dual') {
    // Check each word
    for (let i = 0; i < newState.targetWords.length; i++) {
      const wordEval = evaluateGuess(normalizedGuess, newState.targetWords[i]);
      const isWordWon = wordEval.every(state => state === 'correct');
      if (isWordWon) {
        newDualWordStatus[i] = 'won';
      }
    }
  }

  // Determine game status
  let newStatus = newState.gameStatus;

  if (newState.mode === 'single') {
    // Check if the game is won in single mode
    const isWon = evaluations.every(state => state === 'correct');
    if (isWon) {
      newStatus = 'won';
    } else if (newRow >= newState.maxAttempts) {
      // Check if the game is lost
      newStatus = 'lost';
    }
  } else {
    // Dual mode - win only if both words are discovered
    const allWordsWon = newDualWordStatus.every(status => status === 'won');
    if (allWordsWon) {
      newStatus = 'won';
    } else if (newRow >= newState.maxAttempts) {
      // Lose if reaching the maximum number of attempts without discovering all words
      newStatus = 'lost';
    }
  }

  return {
    ...newState,
    guesses: newGuesses,
    currentGuess: '',
    gameStatus: newStatus,
    currentRow: newRow,
    keyboardState: newKeyboardState,
    dualWordStatus: newDualWordStatus
  };
};

// Add a letter to the current guess
export const addLetter = (state: GameState, letter: string): GameState => {
  if (state.gameStatus !== 'playing' || state.currentGuess.length >= 5) {
    return state;
  }

  return {
    ...state,
    currentGuess: state.currentGuess + letter,
    message: null
  };
};

// Remove the last letter from the current guess
export const removeLetter = (state: GameState): GameState => {
  if (state.gameStatus !== 'playing' || state.currentGuess.length === 0) {
    return state;
  }

  return {
    ...state,
    currentGuess: state.currentGuess.slice(0, -1),
    message: null
  };
};

// Reset the game with a new word
export const resetGame = (state: GameState, mode?: GameMode): GameState => {
  const newMode = mode || state.mode;
  return createInitialState(newMode);
};

// Close the tutorial
export const closeTutorial = (state: GameState): GameState => {
  return {
    ...state,
    showTutorial: false
  };
}; 