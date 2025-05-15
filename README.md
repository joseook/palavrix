# Palavrix

Palavrix é um clone do jogo Termo, um desafio diário de palavras em Português do Brasil.

## Sobre o Jogo

Descubra a palavra certa em 6 tentativas. Depois de cada tentativa, as peças mostram o quão perto você está da solução.

### Funcionalidades

- Modo padrão com uma palavra diária
- Modo duplo com duas palavras para descobrir simultaneamente
- Suporte para letras com acentos (preenchidos automaticamente)
- Design responsivo para desktop e mobile
- Compartilhamento de resultados

## Tecnologias Utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS

## Como Executar

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```
4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Como Jogar

1. Você tem 6 tentativas para acertar a palavra secreta de 5 letras
2. Digite uma palavra e pressione ENTER
3. As cores das peças mudarão para mostrar o quão perto você está:
   - Verde: a letra está na posição correta
   - Amarelo: a letra está na palavra, mas em outra posição
   - Cinza: a letra não está na palavra

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um issue ou um pull request.