import React from 'react';

interface StatsProps {
  onClose: () => void;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
  };
}

const Stats: React.FC<StatsProps> = ({ onClose, stats }) => {
  const winPercentage = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxGuessCount = Math.max(...stats.guessDistribution, 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Estatísticas</h2>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.gamesPlayed}</span>
            <span className="text-xs text-center">Jogos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{winPercentage}%</span>
            <span className="text-xs text-center">Vitórias</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.currentStreak}</span>
            <span className="text-xs text-center">Sequência Atual</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.maxStreak}</span>
            <span className="text-xs text-center">Melhor Sequência</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Distribuição de Tentativas</h3>

        <div className="space-y-2 mb-6">
          {stats.guessDistribution.map((count, index) => {
            const percentage = maxGuessCount > 0
              ? Math.max(Math.round((count / maxGuessCount) * 100), 7)
              : 7;

            return (
              <div key={index} className="flex items-center">
                <div className="w-4 mr-2">{index + 1}</div>
                <div
                  className="bg-correct h-6 text-right pr-2 flex items-center justify-end"
                  style={{ width: `${percentage}%` }}
                >
                  {count > 0 && count}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Stats;
