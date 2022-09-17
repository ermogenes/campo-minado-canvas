export const CampoMinado = class {
  vazio = 0;
  mina = -1;

  tamanho;
  dificuldade;
  rodadaAtual;
  numeroDeMinas;

  campo = [];
  aberto = [];
  sinalizado = [];
  modificado = [];

  constructor(tamanho, dificuldade) {
    if (tamanho < 3 || tamanho > 20) throw "Tamanho deve estar entre 3 e 20.";

    if (dificuldade < 0 || dificuldade > 1)
      throw "Dificuldade deve estar entre 0 e 1.";

    this.tamanho = tamanho;
    this.dificuldade = dificuldade;
    this.rodadaAtual = 1;
    const maxMinas = parseInt((this.tamanho - 1) ** 2);
    this.numeroDeMinas = parseInt(maxMinas * this.dificuldade);

    this.marcarTodosOsLocaisComoVazios();
    this.marcarTodosOsLocaisComoFechados();
    this.marcarTodosOsLocaisComoNaoSinalizados();
    this.marcarTodosOsLocaisComoModificados();

    this.geraMinaAleatoria();
  }

  marcarTodosOsLocaisComoModificados() {
    this.modificado = [...Array(this.tamanho)].map(() =>
      [...Array(this.tamanho)].fill(true)
    );
  }

  marcarTodosOsLocaisComoNaoSinalizados() {
    this.sinalizado = [...Array(this.tamanho)].map(() =>
      [...Array(this.tamanho)].fill(false)
    );
  }

  marcarTodosOsLocaisComoFechados() {
    this.aberto = [...Array(this.tamanho)].map(() =>
      [...Array(this.tamanho)].fill(false)
    );
  }

  marcarTodosOsLocaisComoVazios() {
    this.campo = [...Array(this.tamanho)].map(() =>
      [...Array(this.tamanho)].fill(0)
    );
  }

  sorteiaNumeroInteiro(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  geraMinaAleatoria() {
    // Preenche com as minas em posições aleatórias
    let minasPosicionadas = 0;
    do {
      const colunaSorteada = this.sorteiaNumeroInteiro(0, this.tamanho);
      const linhaSorteada = this.sorteiaNumeroInteiro(0, this.tamanho);

      if (this.campo[linhaSorteada][colunaSorteada] == this.vazio) {
        this.campo[linhaSorteada][colunaSorteada] = this.mina;
        minasPosicionadas++;
      }
    } while (minasPosicionadas < this.numeroDeMinas);

    // Calcula as numerações pela quantidadde de minas adjacentes
    for (let linha = 0; linha < this.tamanho; linha++)
      for (let coluna = 0; coluna < this.tamanho; coluna++) {
        const colunaInicio = Math.max(coluna - 1, 0);
        const colunaLimite = Math.min(coluna + 2, this.tamanho);

        const linhaInicio = Math.max(linha - 1, 0);
        const linhaLimite = Math.min(linha + 2, this.tamanho);

        let qtdMinasAdjacentes = 0;

        for (let l = linhaInicio; l < linhaLimite; l++)
          for (let c = colunaInicio; c < colunaLimite; c++)
            if (this.campo[l][c] == this.mina) qtdMinasAdjacentes++;

        if (this.campo[linha][coluna] != this.mina)
          this.campo[linha][coluna] = qtdMinasAdjacentes;
      }
  }

  inverteSinalizacao(linha, coluna) {
    this.sinalizado[linha][coluna] = !this.sinalizado[linha][coluna];

    // Invalida exibição atual
    this.modificado[linha][coluna] = true;
  }

  abreLocalEExpande(linha, coluna) {
    let minaEncontrada = false;

    if (!this.podeAbrir(linha, coluna)) return minaEncontrada;

    // Marca como aberto
    this.aberto[linha][coluna] = true;

    // Invalida exibição atual
    this.modificado[linha][coluna] = true;

    // Verifica se é mina
    minaEncontrada = this.campo[linha][coluna] == this.mina;

    // Se não for vazio, não expande
    // Também garante que não explodirá, (não há minas com vizinhos vazios)
    if (this.campo[linha][coluna] != this.vazio) return minaEncontrada;

    // Expandindo...

    // Encontra os limites da vizinhança
    const colunaInicioVz = Math.max(coluna - 1, 0);
    const colunaLimiteVz = Math.min(coluna + 2, this.tamanho);
    const linhaInicioVz = Math.max(linha - 1, 0);
    const linhaLimiteVz = Math.min(linha + 2, this.tamanho);

    // Se um vizinho pode ser aberto, abre e expande
    for (let linhaVz = linhaInicioVz; linhaVz < linhaLimiteVz; linhaVz++)
      for (let colunaVz = colunaInicioVz; colunaVz < colunaLimiteVz; colunaVz++)
        if (this.podeAbrir(linhaVz, colunaVz))
          minaEncontrada =
            minaEncontrada || // anteriormente
            this.abreLocalEExpande(linhaVz, colunaVz); // ou nas próximas expansões

    return minaEncontrada;
  }

  abreLocal(linha, coluna) {
    this.incrementaRodada();
    return this.abreLocalEExpande(linha, coluna);
  }

  abreTodosLocaisVizinhos(linha, coluna) {
    let minaEncontrada = false;

    // Se não for um número aberto não sinalizado, não abre
    if (!this.podeAbrirLocaisVizinhos(linha, coluna)) return minaEncontrada;

    // Executando ações nos vizinhos...

    // Encontra os limites da vizinhança
    const colunaInicioVz = Math.max(coluna - 1, 0);
    const colunaLimiteVz = Math.min(coluna + 2, this.tamanho);
    const linhaInicioVz = Math.max(linha - 1, 0);
    const linhaLimiteVz = Math.min(linha + 2, this.tamanho);

    // Se um vizinho pode ser aberto, executa ação de abertura
    for (let linhaVz = linhaInicioVz; linhaVz < linhaLimiteVz; linhaVz++)
      for (let colunaVz = colunaInicioVz; colunaVz < colunaLimiteVz; colunaVz++)
        if (this.podeAbrir(linhaVz, colunaVz)) {
          this.incrementaRodada(); // Cada abertura conta como uma ação
          minaEncontrada =
            minaEncontrada || // anteriormente
            this.abreLocalEExpande(linhaVz, colunaVz); // ou nas próximas expansões
        }
    return minaEncontrada;
  }

  incrementaRodada() {
    this.rodadaAtual++;
  }

  podeAbrir(linha, coluna) {
    return !this.aberto[linha][coluna] && !this.sinalizado[linha][coluna];
  }

  podeAbrirLocaisVizinhos(linha, coluna) {
    return (
      this.aberto[linha][coluna] &&
      !this.sinalizado[linha][coluna] &&
      this.campo[linha][coluna] >= 1
    );
  }

  podeSinalizar(linha, coluna) {
    return !this.aberto[linha][coluna];
  }

  numeroDeSinais() {
    let quantidade = 0;
    for (let sinal of this.sinalizado) if (sinal) quantidade++;
    return quantidade;
  }

  situacaoDeVitoria() {
    for (let linha = 0; linha < this.tamanho; linha++)
      for (let coluna = 0; coluna < this.tamanho; coluna++)
        if (
          this.campo[linha][coluna] != this.mina &&
          this.podeAbrir(linha, coluna)
        )
          return false;
    return true;
  }
};
