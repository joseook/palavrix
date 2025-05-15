import React from 'react';
import Tile from './Tile';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Como Jogar</h2>

        <p className="mb-4">
          Descubra a palavra certa em 6 tentativas. Depois de cada tentativa, as peças mostram o quão perto você está da solução.
        </p>

        <div className="mb-6">
          <div className="mb-2">Exemplos:</div>

          <div className="mb-4">
            <div className="flex mb-2">
              <Tile letter="T" state="correct" />
              <Tile letter="U" state="empty" />
              <Tile letter="R" state="empty" />
              <Tile letter="M" state="empty" />
              <Tile letter="A" state="empty" />
            </div>
            <p>A letra <strong>T</strong> faz parte da palavra e está na posição correta.</p>
          </div>

          <div className="mb-4">
            <div className="flex mb-2">
              <Tile letter="V" state="empty" />
              <Tile letter="I" state="empty" />
              <Tile letter="O" state="present" />
              <Tile letter="L" state="empty" />
              <Tile letter="A" state="empty" />
            </div>
            <p>A letra <strong>O</strong> faz parte da palavra mas em outra posição.</p>
          </div>

          <div className="mb-4">
            <div className="flex mb-2">
              <Tile letter="P" state="empty" />
              <Tile letter="U" state="empty" />
              <Tile letter="L" state="empty" />
              <Tile letter="G" state="absent" />
              <Tile letter="A" state="empty" />
            </div>
            <p>A letra <strong>G</strong> não faz parte da palavra.</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2">Os acentos são preenchidos automaticamente, e não são considerados nas dicas.</p>
          <p className="mb-2">As palavras podem possuir letras repetidas.</p>
          <p>Uma palavra nova aparece a cada dia.</p>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Modos de Jogo</h3>
          <p className="mb-2"><strong>Termo:</strong> Descubra uma palavra de 5 letras em 6 tentativas.</p>
          <p><strong>Termo Duplo:</strong> Descubra duas palavras diferentes simultaneamente.</p>
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Entendi!
        </button>
      </div>
    </div>
  );
};

export default Tutorial; 