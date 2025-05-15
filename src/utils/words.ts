// List of 5-letter Portuguese words
export const WORDS = [
  // Original words
  "TERMO", "FESTA", "CORDA", "MUNDO", "FLUXO", "FELIZ", "TRUCO", "PARTE", "CARRO", "PODER",
  "CAIXA", "RISCA", "PLANO", "FOLHA", "BUSCA", "ONTEM", "PERDA", "FALHA", "FRASE", "LINDO",
  // Additional words
  "SAGAZ", "AMORA", "VIGOR", "FAZER", "MEXER", "NOBRE", "SENSO", "AFETO", "ALGOZ", "PLENA",
  "ANEXO", "HONRA", "TERNO", "JUSTO", "MUITO", "POSSE", "PRESA", "CAUSA", "DENSO", "DIZER",
  "MORAL", "PRAXE", "SENIL", "TORPE", "VELHO", "XIQUE", "ZELAR", "AMPLO", "AINDA", "ASSIM",
  "CERNE", "DESDE", "IDEIA", "FOSSE", "JEITO", "LAPSO", "MÚTUO", "NICHO", "RAZÃO", "SONHO",
  "TANGE", "VALOR", "VIVER", "DIGNO", "ÉTICO", "ANEXO", "SUTIL", "VIGOR", "INATO", "PODER",
  "AUDAZ", "FUGAZ", "COZER", "ARDIL", "GENRO", "SEARA", "DENGO", "PROSA", "TENAZ", "DEVER",
  "COMUM", "TEMOR", "SENDO", "CENSO", "MANSO", "IGUAL", "VALIA", "CITAR", "FORTE", "TECER",
  "PESAR", "SABER", "MAIOR", "TEMPO", "LABOR", "PLANO", "FALAR", "CAMPO", "VITAL", "FLORA"
];

// Extended list of valid guesses
export const VALID_GUESSES = [
  ...WORDS,
  // Additional valid guesses
  "ÁGAPE", "ÍMPAR", "ÂNIMO", "ÊXITO", "ÁPICE", "ÉTICA", "ÍNDIO", "ÓBVIO", "ÚMIDO", "ÂMBAR",
  "ÍDOLO", "ÚTERO", "ÍCONE", "ÂNSIA", "ÁRDUO", "ÓTICA", "ÉPICO", "ÍNDEX", "ÁVIDO", "ÉBANO",
  "ÍDOLO", "ÓSSEO", "ÚRICO", "ÊXODO", "ÍMPIO", "ÓBITO", "ÁGORA", "ÂNODO", "ÉTICO", "ÍMPAR"
];

// Generate a random word from the WORDS array
export const getRandomWord = (): string => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};

// Generate multiple random words for multi-word mode
export const getRandomWords = (count: number): string[] => {
  const words: string[] = [];
  const usedIndices = new Set<number>();

  while (words.length < count) {
    const index = Math.floor(Math.random() * WORDS.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      words.push(WORDS[index]);
    }
  }

  return words;
};

// Generate two random words for dual mode
export const getRandomPair = (): [string, string] => {
  return getRandomWords(2) as [string, string];
};

// Check if a word is a valid guess
export const isValidGuess = (word: string): boolean => {
  return VALID_GUESSES.includes(normalizeWord(word));
};

// Normalize a word by removing accents
export const normalizeWord = (word: string): string => {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
};