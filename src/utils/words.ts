// List of 5-letter Portuguese words
export const WORDS = [
  "TERMO", "FESTA", "CORDA", "MUNDO", "FLUXO", "FELIZ", "TRUCO", "PARTE", "CARRO", "PODER",
  "CAIXA", "RISCA", "PLANO", "FOLHA", "BUSCA", "ONTEM", "PERDA", "FALHA", "FRASE", "LINDO",
  "PULAR", "PRAIA", "IDEIA", "FALAR", "SINAL", "PONTO", "FORTE", "CUSTO", "VENTO", "PRATO",
  "SABER", "TEMPO", "SUSTO", "TEXTO", "HOMEM", "NOITE", "PAPEL", "VAZIO", "AMIGO", "TURMA",
  "NOIVA", "GRITO", "PROVA", "EXAME", "TOQUE", "PULSO", "PALCO", "LOUCO", "LIVRO", "ROLAR",
  "COISA", "SUPER", "SALSA", "CARTA", "CORTE", "CAMPO", "AVISO", "VIRAR", "FILHO", "LONGO",
  "CLARO", "BRAVO", "RAPAZ", "VALOR", "VERDE", "BEBER", "DIGNO", "PRETO", "LUTAR", "DEVER",
  "RISCO", "FIRME", "NUNCA", "ETAPA", "PASSO", "MOVER", "AZEDO", "HEROI", "DOIDO", "ANDAR",
  "ACIMA", "IDADE", "BAIXO", "PEGAR", "NOBRE", "SENTE", "FUGIR", "PORTA", "FICAR", "TARDE",
  "FORMA", "PLENO", "BRILHO", "JOGAR", "SERVO", "DARDO", "CANTAR", "DUELO", "PEDRA", "CHAVE",
  "MANDA", "CAUSA", "SONHO", "GOSTO", "PISTA", "LISTA", "FIXAR", "CALMA", "VELHO", "LUGAR"
];

// List of valid words for checking guesses (includes all words in WORDS plus more valid Portuguese words)
export const VALID_GUESSES = [
  ...WORDS,
  "TESTE", "FAIXA", "LOUSA", "CORES", "ZEBRA", "VENDA", "ACHAR", "GIRAR", "PEIXE", "ARROZ",
  "LUCRO", "CHATO", "CALOR", "BATOM", "MENTE", "FAZER", "BANHO", "PENTE", "LEITE", "PLACA",
  "BANCO", "LETRA", "FORNO", "BOLSA", "QUASE", "CARNE", "LOIRA", "CERCA", "TENSO", "DENTE",
  "DIZER", "DOIDO", "LONGE", "SUAVE", "LIMPO", "CLARO", "BICHO", "VELHO", "NUVEM", "DURAR",
  "VINHO", "FRUTA", "LAPIS", "POBRE", "LINHA", "VIRAR", "BALDE", "GRAMA", "SOMAR", "AREIA",
  "VENTO", "SORTE", "PAREO", "TOCAR", "GRAVE", "LIDAR", "VIAJAR", "BRUTO", "LIGAR", "CAVAR",
  "NOTAR", "GERAL", "NATAL", "MEXER", "SAUDE", "POEMA", "JOVEM", "LENTO", "MOTOR", "SUMIR",
  "FLUIR", "FALAR", "FAVOR", "PONTO", "VERSO", "MIUDO", "GRUPO", "LOUCO", "HUMOR", "AUTOR",
  "MENOR", "CABER", "FUGAZ", "PAGINA", "MEDIR", "METRO", "MIRAR", "BRISA", "AVIAO", "SUBIR",
  "MESMA", "SENSO", "CERTO", "ATIVO", "MANSO", "MAIOR", "NIVEL", "CEDER", "GOLPE", "EXATO",
  "PESCA", "FARDA", "PALMA", "GRAMA", "MANGA", "BARRA", "MASSA", "FICHA", "TINTA", "POLPA",
  "PARAR", "SOMAR", "RADIO", "BAIXO", "NADAR", "IGUAL", "PILHA", "BATER", "TELHA", "CUNHO",
  "AMIGO", "LAZER", "TENSA", "POSTO", "TANTO", "LEGAL", "REINO", "GRITO", "BANDO", "PRAIA",
  "CANTO", "LARGO", "VERAO", "MAGRO", "VIDEO", "ANTES", "JUNHO", "VIRUS", "EPOCA", "DUPLO",
  "CORPO", "PRAZO", "CARGA", "PORTO", "CHEIO", "JULHO", "PEIXE", "MARCA", "ALUNO", "VENDA",
  "JUSTO", "GENIO", "CRIME", "NAVIO", "FILME", "NOIVA", "MARCO", "RIVAL", "BLOCO", "CIVIL",
  "FATOS", "GESTO", "CLIMA", "FUNDO", "IDEIA", "QUEDA", "GUIAR", "TEMPO", "PERNA", "JORNAL",
  "TOQUE", "MAGIA", "QUASE", "FAIXA", "LOGICO", "SOMAR", "FLORA", "ETNIA", "FAUNA", "CULTO",
  "TERNO", "VOCAL", "CURSO", "PESAR", "MENTA", "GLOBO", "PALCO", "PEDIR", "CAUSA", "RAZAO",
  "EXTRA", "FONTE", "COURO", "ROUPA", "METAL", "CICLO", "FESTA", "TRAMA", "ABUSO", "SETOR",
  "RURAL", "BACIA", "VERDE", "ACIMA", "MUSEU", "SERIE", "PRATA", "TERRA", "ARTES", "SOLAR",
  "LETRA", "ARMAR", "BONUS", "BACIA", "AREIA", "CONTO", "PRETO", "FRACO", "ATUAL", "EMAIL",
  "FOLHA", "VICIO", "JEJUM", "GESTO", "ARENA", "SABIO", "VOTAR", "OLHAR", "PROSA", "FELIZ"
];


// Generate a random word from the WORDS array
export const getRandomWord = (): string => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};

// Generate two random words for dual mode
export const getRandomPair = (): [string, string] => {
  const first = getRandomWord();
  let second = getRandomWord();

  // Make sure the second word is different from the first
  while (second === first) {
    second = getRandomWord();
  }

  return [first, second];
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