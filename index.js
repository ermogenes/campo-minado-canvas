import { CampoMinado } from "./CampoMinado.js";
import { UI } from "./UI.js";

const celulasPorLinha = 10;
const jogo = new CampoMinado(celulasPorLinha, 0.1);
let tela;
let interfaceDoJogo;
let emJogo = false;

const iniciar = () => {
  tela = document.getElementById("tela");
  let larguraCelula = definirTamanho(tela);

  interfaceDoJogo = new UI(jogo, tela.getContext("2d"), larguraCelula);

  // Eventos de clique do mouse

  // Clique do mouse ou qualquer dispositivo de ponteiro
  tela.addEventListener("pointerup", cliqueNoCampoMinado, false);

  // Desativa menu de contexto para botão direito
  tela.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  });

  // Habilita toque longo para sinalizar em telas touch
  let timer;
  tela.addEventListener("touchstart", (ev) => {
    timer = setTimeout(() => {
      timer = null;
      toqueLongoNoCampoMinado(ev);
    }, 500);
  });
  tela.addEventListener("touchend", () => clearTimeout(timer));
  tela.addEventListener("touchmove", () => clearTimeout(timer));

  // Exibe a tela inicial
  // as alterações serão exibidas após cada clique
  interfaceDoJogo.exibeCampo();

  ativaJogo();
};

const definirTamanho = (tela) => {
  const larguraViewPort = document.body.clientWidth;
  let larguraTela;
  if (larguraViewPort < 500) {
    larguraTela = larguraViewPort / celulasPorLinha;
  } else {
    larguraTela = 48;
  }
  tela.width = larguraTela * celulasPorLinha;
  tela.height = larguraTela * celulasPorLinha;
  return larguraTela;
};

const cliqueNoCampoMinado = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  const coluna = parseInt(ev.offsetX / interfaceDoJogo.larguraCelula);
  const linha = parseInt(ev.offsetY / interfaceDoJogo.larguraCelula);

  if (linha >= 10 || linha < 0 || coluna >= 10 || coluna < 0) return;

  let acao;
  if (ev.button === 0) acao = "abrir";
  if (ev.button === 2) acao = "sinalizar";

  if (acao) realizarAcao(acao, linha, coluna);
  else return false;
};

const toqueLongoNoCampoMinado = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  ev.offsetX = ev.touches[0].pageX - ev.touches[0].target.offsetLeft;
  ev.offsetY = ev.touches[0].pageY - ev.touches[0].target.offsetTop;

  const coluna = parseInt(ev.offsetX / interfaceDoJogo.larguraCelula);
  const linha = parseInt(ev.offsetY / interfaceDoJogo.larguraCelula);

  if (linha >= 10 || linha < 0 || coluna >= 10 || coluna < 0) return;

  realizarAcao("sinalizar", linha, coluna);
};

const realizarAcao = (tipo = "abrir", linha, coluna) => {
  if (!emJogo) return;

  let venceu = false;
  let explodiu = false;
  let final = false;
  let abriuLocal = false;

  switch (tipo) {
    case "abrir": // botão esquerdo do mouse
      if (jogo.podeAbrir(linha, coluna)) {
        explodiu = jogo.abreLocal(linha, coluna);
        abriuLocal = true;
      }
      break;
    case "sinalizar": // botão direito do mouse
      if (jogo.podeSinalizar(linha, coluna))
        jogo.inverteSinalizacao(linha, coluna);
      break;
  }

  if (explodiu) {
    venceu = false;
    final = true;
  } else if (abriuLocal) {
    interfaceDoJogo.sfxAbrir.play();
  }

  if (jogo.situacaoDeVitoria()) {
    venceu = true;
    final = true;
  }

  interfaceDoJogo.exibeCampo(final);

  if (final) {
    desativaJogo();

    if (venceu) telaVitoria();
    else telaDerrota();
  }
};

const telaVitoria = () => {
  document.body.classList.remove("perdeu");
  document.body.classList.add("venceu");
  interfaceDoJogo.sfxVencer.play();
};

const telaDerrota = () => {
  document.body.classList.remove("venceu");
  document.body.classList.add("perdeu");
  interfaceDoJogo.sfxPerder.play();
};

const ativaJogo = () => {
  emJogo = true;
  tela.classList.add("em-jogo");
};

const desativaJogo = () => {
  emJogo = false;
  tela.classList.remove("em-jogo");
};

document.addEventListener("DOMContentLoaded", iniciar);
