import React, { useState, useEffect } from 'react';

interface DailyChallengeProps {
  onClose: () => void;
  onComplete: (points: number) => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ onClose, onComplete }) => {
  const [puzzles, setPuzzles] = useState<{ scrambled: string, original: string }[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  // Lista de palavras para o desafio diário
  useEffect(() => {
    const wordList = [
      'BANANA', 'BRASIL', 'CARROS', 'FUTURO', 'JANELA',
      'METODO', 'OCEANO', 'PLANETA', 'QUADRO', 'TECLADO',
      'ALEGRIA', 'CORAGEM', 'FAMILIA', 'HISTORIA', 'NATUREZA'
    ];

    // Embaralha a lista de palavras
    const shuffledList = [...wordList].sort(() => Math.random() - 0.5);

    // Cria os puzzles embaralhando cada palavra
    const newPuzzles = shuffledList.slice(0, 5).map(word => {
      return {
        original: word,
        scrambled: word.split('').sort(() => Math.random() - 0.5).join('')
      };
    });

    setPuzzles(newPuzzles);
  }, []);

  // Cronômetro regressivo
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextPuzzle(false); // Tempo esgotado para o puzzle atual
          return 30; // Reinicia o tempo para o próximo puzzle
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPuzzleIndex, gameOver]);

  // Verifica a resposta do usuário
  const handleSubmit = () => {
    const currentPuzzle = puzzles[currentPuzzleIndex];

    if (userInput.toUpperCase() === currentPuzzle.original) {
      // Resposta correta
      const timeBonus = Math.floor(timeLeft / 3);
      const newPoints = 100 + timeBonus + (streak * 10);

      setPoints(points + newPoints);
      setStreak(streak + 1);
      setMessage(`Correto! +${newPoints} pontos`);

      setTimeout(() => {
        handleNextPuzzle(true);
      }, 1500);
    } else {
      // Resposta incorreta
      setStreak(0);
      setMessage('Incorreto! Tente novamente.');

      // Agitar o input para feedback visual
      const inputElement = document.getElementById('challenge-input');
      if (inputElement) {
        inputElement.classList.add('shake-animation');
        setTimeout(() => {
          inputElement.classList.remove('shake-animation');
        }, 500);
      }
    }
  };

  // Passa para o próximo puzzle
  const handleNextPuzzle = (wasCorrect: boolean) => {
    if (currentPuzzleIndex >= puzzles.length - 1) {
      // Final do jogo
      setGameOver(true);
      onComplete(points);
      return;
    }

    // Próximo puzzle
    setCurrentPuzzleIndex(prev => prev + 1);
    setUserInput('');
    setTimeLeft(30);
    setMessage('');

    if (!wasCorrect) {
      setStreak(0);
    }
  };

  // Função de pular puzzle
  const handleSkip = () => {
    setStreak(0);
    handleNextPuzzle(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Desafio Diário</h2>
          <div className="flex space-x-3">
            <div className="text-sm bg-blue-600 px-2 py-1 rounded">
              Tempo: {timeLeft}s
            </div>
            <div className="text-sm bg-green-600 px-2 py-1 rounded">
              Pontos: {points}
            </div>
            {streak > 1 && (
              <div className="text-sm bg-yellow-600 px-2 py-1 rounded">
                Sequência: {streak}x
              </div>
            )}
          </div>
        </div>

        {!gameOver && puzzles.length > 0 && (
          <>
            <p className="mb-2">
              Desembaralhe a palavra:
            </p>

            <div className="flex justify-center mb-6">
              <div className="text-3xl font-bold tracking-wider bounce-animation">
                {puzzles[currentPuzzleIndex].scrambled}
              </div>
            </div>

            <div className="mb-6">
              <input
                id="challenge-input"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-center text-xl uppercase"
                placeholder="Digite a palavra"
                maxLength={puzzles[currentPuzzleIndex].original.length}
                autoFocus
              />
            </div>

            {message && (
              <div className={`text-center p-2 mb-4 rounded ${message.includes('Correto') ? 'bg-green-700' : 'bg-red-700'}`}>
                {message}
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
              >
                Pular
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                disabled={userInput.length < 3}
              >
                Verificar
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              Puzzle {currentPuzzleIndex + 1} de {puzzles.length}
            </div>
          </>
        )}

        {gameOver && (
          <div className="text-center">
            <p className="text-2xl mb-3">Desafio completo!</p>
            <p className="mb-6">Sua pontuação final: <strong>{points}</strong></p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge; 