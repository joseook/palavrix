import React from 'react';
import { LetterState } from '@/utils/gameLogic';

interface TileProps {
  letter: string;
  state: LetterState;
  isActive?: boolean;
  position?: number;
}

const Tile: React.FC<TileProps> = ({
  letter,
  state,
  isActive = false,
  position = 0
}) => {
  const getStateClass = () => {
    switch (state) {
      case 'correct':
        return 'game-tile-correct';
      case 'present':
        return 'game-tile-present';
      case 'absent':
        return 'game-tile-absent';
      default:
        return '';
    }
  };

  // Animation delay based on position
  const animationDelay = `${position * 100}ms`;

  return (
    <div
      className={`
        game-tile w-14 h-14 sm:w-16 sm:h-16 m-1 
        ${getStateClass()}
        ${isActive ? 'border-gray-400' : 'border-gray-600'}
        ${state !== 'empty' ? 'flip-animation' : ''}
      `}
      style={{ animationDelay }}
    >
      {letter}
    </div>
  );
};

export default Tile; 