import React from 'react';

interface HeaderProps {
  onShowTutorial: () => void;
  onShowStats: () => void;
  onChangeMode: () => void;
  gameMode: 'single' | 'dual';
}

const Header: React.FC<HeaderProps> = ({
  onShowTutorial,
  onShowStats,
  onChangeMode,
  gameMode
}) => {
  return (
    <header className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-700">
      <button
        onClick={onShowTutorial}
        className="p-2 rounded-full hover:bg-gray-700"
        aria-label="Ajuda"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <h1 className="text-2xl font-bold text-center">
        PALAVRIX
        {gameMode === 'dual' && <span className="text-sm ml-2 bg-gray-700 px-2 py-1 rounded">DUPLO</span>}
      </h1>

      <div className="flex">
        <button
          onClick={onChangeMode}
          className="p-2 mr-2 rounded-full hover:bg-gray-700"
          aria-label="Mudar modo de jogo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          onClick={onShowStats}
          className="p-2 rounded-full hover:bg-gray-700"
          aria-label="Estatísticas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header; 