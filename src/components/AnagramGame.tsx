import React, { useState, useEffect } from 'react';

interface AnagramGameProps {
  word: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AnagramGame: React.FC<AnagramGameProps> = ({ word, onClose, onSuccess }) => {
  const [letters, setLetters] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [validWords, setValidWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  // Inicializa o jogo
  useEffect(() => {
    // Embaralha as letras da palavra
    const shuffledLetters = word.split('').sort(() => Math.random() - 0.5);
    setLetters(shuffledLetters);

    // Gera anagramas possíveis (simplificado para demonstração)
    // Em uma aplicação real, você teria um dicionário mais completo
    const generateAnagrams = (w: string) => {
      const originalWord = w.toLowerCase();
      const generatedWords = [];

      // Adiciona a palavra original
      generatedWords.push(originalWord);

      // Algumas subpalavras de exemplo (3+ letras)
      // Aqui você poderia usar um algoritmo real de anagramas
      for (let i = 0; i < originalWord.length; i++) {
        for (let j = i + 3; j <= originalWord.length; j++) {
          const subword = originalWord.slice(i, j);
          if (subword.length >= 3 && !generatedWords.includes(subword)) {
            generatedWords.push(subword);
          }
        }
      }

      return generatedWords;
    };

    setValidWords(generateAnagrams(word));

    // Inicia o cronômetro
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [word]);

  // Adiciona uma letra ao input do usuário
  const handleAddLetter = (letter: string, index: number) => {
    const newInput = [...userInput, letter];
    setUserInput(newInput);

    // Remove a letra selecionada das letras disponíveis
    const newLetters = [...letters];
    newLetters.splice(index, 1);
    setLetters(newLetters);
  };

  // Remove a última letra do input do usuário
  const handleRemoveLetter = () => {
    if (userInput.length === 0) return;

    const removedLetter = userInput[userInput.length - 1];
    setUserInput(userInput.slice(0, userInput.length - 1));
    setLetters([...letters, removedLetter]);
  };

  // Verifica a palavra formada
  const handleSubmitWord = () => {
    const word = userInput.join('').toLowerCase();

    // Verifica se a palavra é válida e não foi encontrada antes
    if (word.length < 3) {
      setMessage('A palavra deve ter pelo menos 3 letras');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (validWords.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setScore(score + word.length * 10);
      setMessage('Palavra válida! +' + (word.length * 10) + ' pontos');

      // Limpa o input e devolve as letras
      setUserInput([]);
      setLetters(word.split('').sort(() => Math.random() - 0.5));

      // Verifica se encontrou todas as palavras
      if (foundWords.length + 1 >= validWords.length) {
        setGameOver(true);
        onSuccess();
      }
    } else if (foundWords.includes(word)) {
      setMessage('Você já encontrou essa palavra');
    } else {
      setMessage('Palavra inválida');
      // Agita o input para feedback visual
      const inputElement = document.getElementById('anagram-input');
      if (inputElement) {
        inputElement.classList.add('shake-animation');
        setTimeout(() => {
          inputElement.classList.remove('shake-animation');
        }, 500);
      }
    }

    setTimeout(() => setMessage(''), 2000);
  };

  // Limpa o input atual
  const handleClearInput = () => {
    // Devolve todas as letras do input para as letras disponíveis
    setLetters([...letters, ...userInput]);
    setUserInput([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Desafio de Anagramas</h2>
          <div className="flex space-x-4">
            <div className="text-sm bg-blue-600 px-2 py-1 rounded">
              Tempo: {timer}s
            </div>
            <div className="text-sm bg-green-600 px-2 py-1 rounded">
              Pontos: {score}
            </div>
          </div>
        </div>

        <p className="mb-4">
          Forme o máximo de palavras possíveis usando as letras abaixo. Cada palavra deve ter pelo menos 3 letras.
        </p>

        {/* Input do usuário */}
        <div
          id="anagram-input"
          className="flex flex-wrap justify-center p-2 mb-4 min-h-16 border-2 border-gray-600 rounded"
        >
          {userInput.map((letter, index) => (
            <div
              key={`input-${index}`}
              className="w-10 h-10 m-1 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md"
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="flex justify-center mb-4 space-x-3">
          <button
            onClick={handleRemoveLetter}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
            disabled={userInput.length === 0}
          >
            Apagar
          </button>
          <button
            onClick={handleClearInput}
            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
            disabled={userInput.length === 0}
          >
            Limpar
          </button>
          <button
            onClick={handleSubmitWord}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded"
            disabled={userInput.length < 3}
          >
            Verificar
          </button>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className="text-center p-2 mb-4 bg-gray-700 rounded">
            {message}
          </div>
        )}

        {/* Letras disponíveis */}
        <div className="flex flex-wrap justify-center mb-6">
          {letters.map((letter, index) => (
            <button
              key={`letter-${index}`}
              onClick={() => handleAddLetter(letter, index)}
              className="w-10 h-10 m-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-md transition-colors"
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Palavras encontradas */}
        {foundWords.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Palavras encontradas:</h3>
            <div className="flex flex-wrap">
              {foundWords.map((word, index) => (
                <span key={index} className="px-2 py-1 m-1 bg-green-800 rounded text-sm">
                  {word.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fim de jogo */}
        {gameOver && (
          <div className="mt-4 text-center">
            <p className="mb-2 text-xl">Tempo esgotado!</p>
            <p className="mb-4">Sua pontuação final: <strong>{score}</strong></p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Continuar
            </button>
          </div>
        )}

        {!gameOver && (
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Pular Desafio
          </button>
        )}
      </div>
    </div>
  );
};

export default AnagramGame; 