import React from 'react';
import { LetterState } from '@/utils/gameLogic';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  keyboardState: Record<string, LetterState>;
}

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onEnter,
  onBackspace,
  keyboardState,
}) => {
  // Define o layout do teclado (QWERTYUIOP, ASDFGHJKL, ZXCVBNM)
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  // Obtém a classe CSS para uma tecla com base em seu estado
  const getKeyClass = (key: string) => {
    const normalizedKey = key.length === 1 ? key : '';
    const state = normalizedKey ? keyboardState[normalizedKey] : null;

    if (key === 'ENTER' || key === 'BACKSPACE') {
      return 'keyboard-key bg-gray-600 text-white';
    }

    switch (state) {
      case 'correct':
        return 'keyboard-key-correct';
      case 'present':
        return 'keyboard-key-present';
      case 'absent':
        return 'keyboard-key-absent';
      default:
        return 'keyboard-key bg-keyboard';
    }
  };

  // Trata o clique em uma tecla do teclado
  const handleKeyClick = (key: string) => {
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACKSPACE') {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 mb-4">
      {keyboardRows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex justify-center mb-2">
          {row.map((key) => (
            <button
              key={key}
              className={`
                ${getKeyClass(key)}
                ${key === 'ENTER' || key === 'BACKSPACE' ? 'px-3 sm:px-4' : 'w-10 sm:w-12'}
                h-14 sm:h-16 mx-1 rounded text-sm sm:text-base
                transition-all duration-150 hover:bg-opacity-80 active:scale-95
              `}
              onClick={() => handleKeyClick(key)}
              aria-label={key}
            >
              {key === 'BACKSPACE' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 012.828 0L21 12m-3 0H7" />
                </svg>
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 