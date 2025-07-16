window.addEventListener("DOMContentLoaded", () => {
  const emojis = ["🐯", "🐻", "🦁"];
  const btnGirar = document.getElementById("btn-girar");
  const mensagem = document.getElementById("mensagem");
  const spans = document.querySelectorAll(".linha span");

  let fichas = parseInt(localStorage.getItem("fichas")) || 260;

  const mostrarFichas = () => {
    document.querySelector(".fichas").textContent = `💰 ${fichas} Fichas`;
  };

  mostrarFichas();

  btnGirar.addEventListener("click", () => {
    if (fichas < 5) {
      mensagem.textContent = "❌ Fichas insuficientes!";
      return;
    }

    fichas -= 5;
    mensagem.textContent = "🔄 Rodando... Boa sorte!";
    btnGirar.disabled = true;

    let contagem = 0;
    const intervalo = setInterval(() => {
      spans.forEach(span => {
        const sorteio = Math.floor(Math.random() * emojis.length);
        span.textContent = emojis[sorteio];
      });
      contagem++;
      if (contagem >= 20) {
        clearInterval(intervalo);

        const linhaDoMeio = document.querySelectorAll(".linha")[1];
        const [a, b, c] = [...linhaDoMeio.querySelectorAll("span")].map(s => s.textContent);

        if (a === b && b === c) {
          mensagem.textContent = "🎉 JACKPOT! Ganhou 50 fichas!";
          fichas += 50;
        } else {
          mensagem.textContent = "😢 Não foi dessa vez. Tente de novo!";
        }

        localStorage.setItem("fichas", fichas);
        mostrarFichas();
        btnGirar.disabled = false;
      }
    }, 100);
  });
});
