import { CampoMinado } from "./CampoMinado.js";
import { UI } from "./UI.js";

const jogo = new CampoMinado(10, 0.1);

const interfaceDoJogo = new UI(
  jogo,
  document.getElementById("tela").getContext("2d")
);

const iniciar = () => {
  interfaceDoJogo.ExibeCampo();

  document
    .getElementById("tela")
    .addEventListener("mouseup", cliqueNoCampoMinado, false);

  document.getElementById("tela").addEventListener("contextmenu", (e) => {
    if (e.button === 2) e.preventDefault();
  });

  console.log(jogo);
};

const cliqueNoCampoMinado = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  const coluna = parseInt(ev.offsetX / interfaceDoJogo.LarguraCelula);
  const linha = parseInt(ev.offsetY / interfaceDoJogo.LarguraCelula);

  if (linha >= 10 || linha < 0 || coluna >= 10 || coluna < 0) return;

  let venceu = false;
  let explodiu = false;
  let final = false;

  switch (ev.button) {
    case 0: // esquerdo
      if (jogo.PodeAbrir(linha, coluna))
        explodiu = jogo.AbreLocal(linha, coluna);
      break;
    case 2: // direito
      if (jogo.PodeSinalizar(linha, coluna))
        jogo.InverteSinalizacao(linha, coluna);
      break;
  }

  if (explodiu) {
    venceu = false;
    final = true;
  }

  if (jogo.SituacaoDeVitoria()) {
    venceu = true;
    final = true;
  }

  interfaceDoJogo.ExibeCampo(final);

  if (final && venceu) document.body.style.backgroundColor = "green";
  if (final && !venceu) document.body.style.backgroundColor = "red";
};

document.addEventListener("DOMContentLoaded", iniciar);
