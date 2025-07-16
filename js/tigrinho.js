window.addEventListener("DOMContentLoaded", () => {
  const imagensDisponiveis = [
    "../assets/imagens/tigre.png",
    "../assets/imagens/leao.png",
    "../assets/imagens/urso.png"
  ];

  const botoesBobinas = document.querySelectorAll(".grade-bobinas img");
  const botaoGirar = document.getElementById("btn-girar");
  const mensagem = document.getElementById("mensagem");

  let fichas = parseInt(localStorage.getItem("fichas")) || 100;

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
    if (fichas < 5) {
      mensagem.textContent = "❌ Fichas insuficientes!";
      return;
    }

    fichas -= 5;
    mensagem.textContent = "🔄 Rodando... Boa sorte!";
    botaoGirar.disabled = true;

    let contador = 0;
    const intervalo = setInterval(() => {
      botoesBobinas.forEach((img) => {
        const sorteio = Math.floor(Math.random() * imagensDisponiveis.length);
        img.src = imagensDisponiveis[sorteio];
        img.alt = imagensDisponiveis[sorteio].split("/").pop().replace(".png", "");
      });

      contador++;
      if (contador >= 20) {
        clearInterval(intervalo);

        const linhaMeio = document.querySelectorAll(".linha")[1];
        const imgsLinha = linhaMeio.querySelectorAll("img");
        const srcs = Array.from(imgsLinha).map(img => img.src);

        if (srcs[0] === srcs[1] && srcs[1] === srcs[2]) {
          fichas += 50;
          mensagem.textContent = "🎉 JACKPOT! Ganhou 50 fichas!";
        } else {
          mensagem.textContent = "😢 Não foi dessa vez. Tente de novo!";
        }

        localStorage.setItem("fichas", fichas);
        mostrarFichas();
        botaoGirar.disabled = false;
      }
    }, 100); // 100ms entre cada giro
  });
});
