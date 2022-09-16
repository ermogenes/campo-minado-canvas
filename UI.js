export const UI = class {
  LarguraCelula = 48;

  ctx2d;

  pintarLocal(linha, coluna, src, aberto) {
    const imgFundo = new Image();
    imgFundo.addEventListener("load", () => {
      this.ctx2d.drawImage(
        imgFundo,
        coluna * this.LarguraCelula,
        linha * this.LarguraCelula
      );

      const imgIcone = new Image();
      imgIcone.addEventListener("load", () => {
        this.ctx2d.drawImage(
          imgIcone,
          coluna * this.LarguraCelula,
          linha * this.LarguraCelula
        );
      });
      imgIcone.setAttribute("src", src);
    });
    imgFundo.setAttribute(
      "src",
      aberto ? "img/fundo-aberto.png" : "img/fundo-fechado.png"
    );
  }

  imgTransparente =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAIVJREFUaEPt0rENACAMxMBk/6UZ4goUyfR+gc3O8bPH7z894HfBClQADfSFUCDjFWCFOFABFMh4BVghDlQABTJeAVaIAxVAgYxXgBXiQAVQIOMVYIU4UAEUyHgFWCEOVAAFMl4BVogDFUCBjFeAFeJABVAg4xVghThQARTIeAVYIQ6cL/AAmvUAMfJYo3UAAAAASUVORK5CYII=";

  exibirMina(linha, coluna) {
    this.pintarLocal(linha, coluna, "img/mina.png", true);
  }

  exibirSinal(linha, coluna) {
    this.pintarLocal(linha, coluna, "img/sinal.png", false);
  }

  exibirFechado(linha, coluna) {
    this.pintarLocal(linha, coluna, this.imgTransparente, false);
  }

  exibirAberto(linha, coluna, valor) {
    this.pintarLocal(
      linha,
      coluna,
      valor === this.CampoMinado.VAZIO
        ? this.imgTransparente
        : `img/${valor}.png`,
      true
    );
  }

  constructor(jogo, ctx2d) {
    this.CampoMinado = jogo;
    this.ctx2d = ctx2d;
  }

  ACAO_ABRIR = "a";
  ACAO_ABRIR_VARIOS = "t";
  ACAO_SINALIZAR = "s";
  ACAO_DESISTIR = "d";

  COR_VERMELHO = "rgb(255, 0, 0)";
  COR_VERDE = "rgb(0, 255, 0)";
  COR_AZUL = "rgb(0, 0, 255)";
  COR_AMARELO = "rgb(255, 0, 255)";
  COR_CINZA = "rgb(128, 128, 128)";
  COR_CINZA_CLARO = "rgb(232, 232, 232)";

  AcoesPossiveis = [
    this.ACAO_ABRIR,
    this.ACAO_ABRIR_VARIOS,
    this.ACAO_SINALIZAR,
    this.ACAO_DESISTIR,
  ];

  CampoMinado;

  ExibeLocal(linha, coluna, finalDeJogo = false) {
    const local = this.CampoMinado.Campo[linha][coluna];
    const fechado = !this.CampoMinado.Aberto[linha][coluna];
    const sinalizado = this.CampoMinado.Sinalizado[linha][coluna];
    const ehMina = local === this.CampoMinado.MINA;

    if (sinalizado) {
      this.exibirSinal(linha, coluna);
    } else if (fechado && !finalDeJogo) {
      this.exibirFechado(linha, coluna);
    } else {
      if (ehMina) this.exibirMina(linha, coluna);
      else this.exibirAberto(linha, coluna, local);
    }
  }

  ExibeCampo(finalDeJogo = false) {
    if (finalDeJogo)
      this.Modificado = [...Array(this.Tamanho)].map(() =>
        [...Array(this.Tamanho)].fill(true)
      );

    for (let linha = 0; linha < this.CampoMinado.Campo.length; linha++) {
      for (
        let coluna = 0;
        coluna < this.CampoMinado.Campo[linha].length;
        coluna++
      ) {
        if (!this.CampoMinado.Modificado[linha][coluna]) continue;
        this.ExibeLocal(linha, coluna, finalDeJogo);
        this.CampoMinado.Modificado[linha][coluna] = false;
      }
    }
  }
};
