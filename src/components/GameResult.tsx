import React from 'react';

interface GameResultProps {
  status: 'won' | 'lost';
  targetWords: string[];
  attempts: number;
  maxAttempts: number;
  onPlayAgain: () => void;
  onShare: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  status,
  targetWords,
  attempts,
  maxAttempts,
  onPlayAgain,
  onShare
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          {status === 'won' ? 'Parabéns!' : 'Não foi dessa vez!'}
        </h2>

        <p className="mb-6">
          {status === 'won'
            ? `Você acertou em ${attempts} ${attempts === 1 ? 'tentativa' : 'tentativas'}!`
            : 'Você esgotou suas tentativas.'
          }
        </p>

        <div className="mb-6">
          <p className="mb-2 text-lg font-semibold">
            {targetWords.length > 1 ? 'As palavras eram:' : 'A palavra era:'}
          </p>
          {targetWords.map((word, index) => (
            <p key={index} className="text-xl font-bold">
              {word}
            </p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={onPlayAgain}
          >
            Jogar Novamente
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onShare}
          >
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResult; 