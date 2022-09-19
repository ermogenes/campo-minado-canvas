export const UI = class {
  larguraCelula = 48;

  ACAO_ABRIR = "a";
  ACAO_ABRIR_VARIOS = "t";
  ACAO_SINALIZAR = "s";
  ACAO_DESISTIR = "d";

  acoesPossiveis = [
    this.ACAO_ABRIR,
    this.ACAO_ABRIR_VARIOS,
    this.ACAO_SINALIZAR,
    this.ACAO_DESISTIR,
  ];

  campoMinado;
  ctx2d;

  sfxAbrir;
  sfxVencer;
  sfxPerder;

  sfxAbrirSrc = "sfx/abriu-local.wav";
  sfxVencerSrc = "sfx/venceu.wav";
  sfxPerderSrc = "sfx/perdeu.wav";

  imgMinaSrc = "img/mina.png";
  imgSinalSrc = "img/sinal.png";
  imgFundoAbertoSrc = "img/fundo-aberto.png";
  imgFundoFechadoSrc = "img/fundo-fechado.png";
  imgTransparenteDataUri =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAIVJREFUaEPt0rENACAMxMBk/6UZ4goUyfR+gc3O8bPH7z894HfBClQADfSFUCDjFWCFOFABFMh4BVghDlQABTJeAVaIAxVAgYxXgBXiQAVQIOMVYIU4UAEUyHgFWCEOVAAFMl4BVogDFUCBjFeAFeJABVAg4xVghThQARTIeAVYIQ6cL/AAmvUAMfJYo3UAAAAASUVORK5CYII=";

  constructor(jogo, ctx2d, larguraCelula = 48) {
    this.campoMinado = jogo;
    this.ctx2d = ctx2d;
    this.larguraCelula = larguraCelula;
    this.sfxAbrir = new Audio(this.sfxAbrirSrc);
    this.sfxPerder = new Audio(this.sfxPerderSrc);
    this.sfxVencer = new Audio(this.sfxVencerSrc);
  }

  pintarLocal(linha, coluna, src, aberto) {
    const imgFundo = new Image();
    imgFundo.addEventListener("load", () => {
      this.ctx2d.drawImage(
        imgFundo,
        coluna * this.larguraCelula,
        linha * this.larguraCelula,
        this.larguraCelula,
        this.larguraCelula
      );

      const imgIcone = new Image();
      imgIcone.addEventListener("load", () => {
        this.ctx2d.drawImage(
          imgIcone,
          coluna * this.larguraCelula,
          linha * this.larguraCelula,
          this.larguraCelula,
          this.larguraCelula
        );
      });
      imgIcone.setAttribute("src", src);
    });
    imgFundo.setAttribute(
      "src",
      aberto ? this.imgFundoAbertoSrc : this.imgFundoFechadoSrc
    );
  }

  exibirMina(linha, coluna) {
    this.pintarLocal(linha, coluna, this.imgMinaSrc, true);
  }

  exibirSinal(linha, coluna) {
    this.pintarLocal(linha, coluna, this.imgSinalSrc, false);
  }

  exibirFechado(linha, coluna) {
    this.pintarLocal(linha, coluna, this.imgTransparenteDataUri, false);
  }

  exibirAberto(linha, coluna, valor) {
    this.pintarLocal(
      linha,
      coluna,
      valor === this.campoMinado.vazio
        ? this.imgTransparenteDataUri
        : `img/${valor}.png`,
      true
    );
  }

  exibeLocal(linha, coluna, finalDeJogo = false) {
    const local = this.campoMinado.campo[linha][coluna];
    const fechado = !this.campoMinado.aberto[linha][coluna];
    const sinalizado = this.campoMinado.sinalizado[linha][coluna];
    const ehMina = local === this.campoMinado.mina;

    if (sinalizado) {
      this.exibirSinal(linha, coluna);
    } else if (fechado && !finalDeJogo) {
      this.exibirFechado(linha, coluna);
    } else {
      if (ehMina) this.exibirMina(linha, coluna);
      else this.exibirAberto(linha, coluna, local);
    }
  }

  exibeCampo(finalDeJogo = false) {
    if (finalDeJogo) this.campoMinado.marcarTodosOsLocaisComoModificados();

    for (let linha = 0; linha < this.campoMinado.campo.length; linha++) {
      for (
        let coluna = 0;
        coluna < this.campoMinado.campo[linha].length;
        coluna++
      ) {
        if (!this.campoMinado.modificado[linha][coluna]) continue;
        this.exibeLocal(linha, coluna, finalDeJogo);
        this.campoMinado.modificado[linha][coluna] = false;
      }
    }
  }
};
