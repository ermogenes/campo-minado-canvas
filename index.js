import { CampoMinado } from "./CampoMinado.js";
import { UI } from "./UI.js";

const jogo = new CampoMinado(10, 0.1);
let tela;
let interfaceDoJogo;
let emJogo = false;

const iniciar = () => {
  tela = document.getElementById("tela");
  interfaceDoJogo = new UI(jogo, tela.getContext("2d"));

  // Eventos de clique do mouse
  tela.addEventListener("pointerup", cliqueNoCampoMinado, false);
  tela.addEventListener("contextmenu", (e) => {
    if (e.button === 2) e.preventDefault();
  });

  // Exibe a tela inicial
  // as alterações serão exibidas após cada clique
  interfaceDoJogo.exibeCampo();

  ativaJogo();
};

const cliqueNoCampoMinado = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  if (!emJogo) return;

  const coluna = parseInt(ev.offsetX / interfaceDoJogo.larguraCelula);
  const linha = parseInt(ev.offsetY / interfaceDoJogo.larguraCelula);

  if (linha >= 10 || linha < 0 || coluna >= 10 || coluna < 0) return;

  let venceu = false;
  let explodiu = false;
  let final = false;
  let abriuLocal = false;

  switch (ev.button) {
    case 0: // botão esquerdo do mouse
      if (jogo.podeAbrir(linha, coluna)) {
        explodiu = jogo.abreLocal(linha, coluna);
        abriuLocal = true;
      }
      break;
    case 2: // botão direito do mouse
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
