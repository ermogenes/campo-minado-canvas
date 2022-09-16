export const CampoMinado = class {
  VAZIO = 0;
  MINA = -1;
  Tamanho;
  Dificuldade;
  RodadaAtual;
  NumeroDeMinas;

  NumeroDeSinais() {
    let quantidade = 0;
    for (let sinal of this.Sinalizado) if (sinal) quantidade++;
    return quantidade;
  }

  Campo = [];
  Aberto = [];
  Sinalizado = [];
  Modificado = [];

  SituacaoDeVitoria() {
    for (let linha = 0; linha < this.Tamanho; linha++)
      for (let coluna = 0; coluna < this.Tamanho; coluna++)
        if (
          this.Campo[linha][coluna] != this.MINA &&
          this.PodeAbrir(linha, coluna)
        )
          return false;
    return true;
  }

  constructor(tamanho, dificuldade) {
    if (tamanho < 3 || tamanho > 20) throw "Tamanho deve estar entre 3 e 20.";

    if (dificuldade < 0 || dificuldade > 1)
      throw "Dificuldade deve estar entre 0 e 1.";

    this.Tamanho = tamanho;
    this.Dificuldade = dificuldade;
    this.RodadaAtual = 1;
    const maxMinas = parseInt((this.Tamanho - 1) ** 2);
    this.NumeroDeMinas = parseInt(maxMinas * this.Dificuldade);
    this.Campo = [...Array(this.Tamanho)].map(() =>
      [...Array(this.Tamanho)].fill(0)
    );
    this.Aberto = [...Array(this.Tamanho)].map(() =>
      [...Array(this.Tamanho)].fill(false)
    );
    this.Sinalizado = [...Array(this.Tamanho)].map(() =>
      [...Array(this.Tamanho)].fill(false)
    );
    this.Modificado = [...Array(this.Tamanho)].map(() =>
      [...Array(this.Tamanho)].fill(true)
    );

    this.GeraMinaAleatoria();
  }

  GetInt32(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  GeraMinaAleatoria() {
    // Preenche com as minas em posições aleatórias
    let minasPosicionadas = 0;
    do {
      const colunaSorteada = this.GetInt32(0, this.Tamanho);
      const linhaSorteada = this.GetInt32(0, this.Tamanho);

      if (this.Campo[linhaSorteada][colunaSorteada] == this.VAZIO) {
        this.Campo[linhaSorteada][colunaSorteada] = this.MINA;
        minasPosicionadas++;
      }
    } while (minasPosicionadas < this.NumeroDeMinas);

    // Calcula as numerações pela quantidadde de minas adjacentes
    for (let linha = 0; linha < this.Tamanho; linha++)
      for (let coluna = 0; coluna < this.Tamanho; coluna++) {
        const colunaInicio = Math.max(coluna - 1, 0);
        const colunaLimite = Math.min(coluna + 2, this.Tamanho);

        const linhaInicio = Math.max(linha - 1, 0);
        const linhaLimite = Math.min(linha + 2, this.Tamanho);

        let qtdMinasAdjacentes = 0;

        for (let l = linhaInicio; l < linhaLimite; l++)
          for (let c = colunaInicio; c < colunaLimite; c++)
            if (this.Campo[l][c] == this.MINA) qtdMinasAdjacentes++;

        if (this.Campo[linha][coluna] != this.MINA)
          this.Campo[linha][coluna] = qtdMinasAdjacentes;
      }
  }

  InverteSinalizacao(linha, coluna) {
    this.Sinalizado[linha][coluna] = !this.Sinalizado[linha][coluna];

    // Invalida exibição atual
    this.Modificado[linha][coluna] = true;
  }

  AbreLocalEExpande(linha, coluna) {
    let minaEncontrada = false;

    if (!this.PodeAbrir(linha, coluna)) return minaEncontrada;

    // Marca como aberto
    this.Aberto[linha][coluna] = true;

    // Invalida exibição atual
    this.Modificado[linha][coluna] = true;

    // Verifica se é mina
    minaEncontrada = this.Campo[linha][coluna] == this.MINA;

    // Se não for vazio, não expande
    // Também garante que não explodirá, (não há minas com vizinhos vazios)
    if (this.Campo[linha][coluna] != this.VAZIO) return minaEncontrada;

    // Expandindo...

    // Encontra os limites da vizinhança
    const colunaInicioVz = Math.max(coluna - 1, 0);
    const colunaLimiteVz = Math.min(coluna + 2, this.Tamanho);
    const linhaInicioVz = Math.max(linha - 1, 0);
    const linhaLimiteVz = Math.min(linha + 2, this.Tamanho);

    // Se um vizinho pode ser aberto, abre e expande
    for (let linhaVz = linhaInicioVz; linhaVz < linhaLimiteVz; linhaVz++)
      for (let colunaVz = colunaInicioVz; colunaVz < colunaLimiteVz; colunaVz++)
        if (this.PodeAbrir(linhaVz, colunaVz))
          minaEncontrada =
            minaEncontrada || // anteriormente
            this.AbreLocalEExpande(linhaVz, colunaVz); // ou nas próximas expansões

    return minaEncontrada;
  }

  AbreLocal(linha, coluna) {
    this.IncrementaRodada();
    return this.AbreLocalEExpande(linha, coluna);
  }

  AbreTodosLocaisVizinhos(linha, coluna) {
    let minaEncontrada = false;

    // Se não for um número aberto não sinalizado, não abre
    if (!this.PodeAbrirLocaisVizinhos(linha, coluna)) return minaEncontrada;

    // Executando ações nos vizinhos...

    // Encontra os limites da vizinhança
    const colunaInicioVz = Math.max(coluna - 1, 0);
    const colunaLimiteVz = Math.min(coluna + 2, this.Tamanho);
    const linhaInicioVz = Math.max(linha - 1, 0);
    const linhaLimiteVz = Math.min(linha + 2, this.Tamanho);

    // Se um vizinho pode ser aberto, executa ação de abertura
    for (let linhaVz = linhaInicioVz; linhaVz < linhaLimiteVz; linhaVz++)
      for (let colunaVz = colunaInicioVz; colunaVz < colunaLimiteVz; colunaVz++)
        if (this.PodeAbrir(linhaVz, colunaVz)) {
          this.IncrementaRodada(); // Cada abertura conta como uma ação
          minaEncontrada =
            minaEncontrada || // anteriormente
            this.AbreLocalEExpande(linhaVz, colunaVz); // ou nas próximas expansões
        }
    return minaEncontrada;
  }

  IncrementaRodada() {
    this.RodadaAtual++;
  }

  PodeAbrir(linha, coluna) {
    return !this.Aberto[linha][coluna] && !this.Sinalizado[linha][coluna];
  }

  PodeAbrirLocaisVizinhos(linha, coluna) {
    return (
      this.Aberto[linha][coluna] &&
      !this.Sinalizado[linha][coluna] &&
      this.Campo[linha][coluna] >= 1
    );
  }

  PodeSinalizar(linha, coluna) {
    return !this.Aberto[linha][coluna];
  }
};
