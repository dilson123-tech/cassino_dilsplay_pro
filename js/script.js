const imagensDisponiveis = [
  "../assets/imagem/tigre.png",
  "../assets/imagem/leao.png",
  "../assets/imagem/urso.png"
];

const botoesBobinas = document.querySelectorAll(".bobinas img");

const mensagem = document.getElementById("mensagem");
const botaoGirar = document.getElementById("btn-girar");

// Fichas do jogador
let fichas = parseInt(localStorage.getItem("fichas")) || 100;

// Mostrar quantidade de fichas
const mostrarFichas = () => {
  let fichasEl = document.querySelector(".fichas");
  if (!fichasEl) {
    fichasEl = document.createElement("p");
    fichasEl.classList.add("fichas");
    botaoGirar.insertAdjacentElement("afterend", fichasEl);
  }
  fichasEl.textContent = `💰 ${fichas} Fichas`;
};

mostrarFichas();

botaoGirar.addEventListener("click", () => {
  // Cobra 5 fichas por rodada
  if (fichas < 5) {
    mensagem.textContent = "❌ Fichas insuficientes. Compre mais!";
    return;
  }

  fichas -= 5;

  // Gira as bobinas
  const resultado = [];
bobinas.forEach((bobina, i) => {
  const sorteio = Math.floor(Math.random() * imagens.length);
  resultado.push(imagens[sorteio]);
  bobina.innerHTML = `<img src="${imagens[sorteio]}" class="icone-animal" alt="Animal">`;
});


  // Verifica se os três símbolos são iguais
  if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
    const premio = 50;
    fichas += premio;
    mensagem.textContent = `🎉 Parabéns! Você ganhou ${premio} fichas!`;
  } else {
    mensagem.textContent = "😢 Não foi dessa vez. Tente novamente!";
  }

  localStorage.setItem("fichas", fichas);
  mostrarFichas();
});
