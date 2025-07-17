// Seletores principais
const btnGirar = document.getElementById("btn-girar");
const mensagem = document.getElementById("mensagem");
const saldoElemento = document.querySelector(".fichas");
const acumuladoElemento = document.querySelector(".acumulado");
const selectAposta = document.getElementById("valor-aposta");
const btnResetar = document.getElementById("resetar-jogo");
const btnForcarJackpot = document.getElementById("forcar-jackpot");

const somGirar = new Audio("./assets/sounds/girar.mp3");
const somVitoria = new Audio("./assets/sounds/vitoria.mp3");

// Lista de bichos
const animais = ["tigre", "leao", "urso", "lobo"];

// Valores iniciais
let saldo = 100.0;
let acumulado = 500.0;
let rodadasSemPremio = 0;

// Atualiza os valores na tela
function atualizarValores() {
  saldoElemento.textContent = `💰 Saldo: R$ ${saldo.toFixed(2)}`;
  acumuladoElemento.textContent = `🏆 Prêmio Acumulado: R$ ${acumulado.toFixed(2)}`;
}

// Função para girar as bobinas
function girarBobinas(payoutForcado = false) {
  const aposta = parseFloat(selectAposta.value);
  if (saldo < aposta) {
    mensagem.textContent = "🚫 Saldo insuficiente!";
    return;
  }

  somGirar.currentTime = 0;
  somGirar.play();

// Parar o som de girar após 1.5 segundos
   setTimeout(() => {
   somGirar.pause();
  somGirar.currentTime = 0;
  }, 1000);

mensagem.textContent = "🔄 Rodando... Boa sorte!";
saldo -= aposta;
acumulado += aposta * 0.20;


  const linhas = document.querySelectorAll(".linha");
  const vencedoras = [];
  let linhasFinalizadas = 0;
  let linhasGanhadoras = 0;

  linhas.forEach((linha) => {
    linha.classList.remove("vencedora");
    const imagens = linha.querySelectorAll("img");
    imagens.forEach((img) => img.remove());


    let contagem = 0;
    const animar = setInterval(() => {
      const imagens = linha.querySelectorAll("img");

      if (imagens.length === 0) {
        for (let i = 0; i < 4; i++) {
          const img = document.createElement("img");
          img.src = `./assets/imagens/tigre.png`;
          img.alt = "tigre";
          img.classList.add("girando");
          linha.appendChild(img);
        }
      } else {
        imagens.forEach((img) => {
          const animalTemp = animais[Math.floor(Math.random() * animais.length)];
          img.src = `./assets/imagens/${animalTemp}.png`;
          img.alt = animalTemp;
          img.classList.add("girando");
        });
      }

      contagem++;
      if (contagem >= 10) {
        clearInterval(animar);
        const sorteioFinal = [];

        const imagens = linha.querySelectorAll("img");
        imagens.forEach((img) => {
        const animal = animais[Math.floor(Math.random() * animais.length)];
        img.src = `./assets/imagens/${animal}.png`;
        img.alt = animal;
        img.classList.remove("girando");
       sorteioFinal.push(animal);
   });


        const todasIguais = sorteioFinal.every((val) => val === sorteioFinal[0]);
        if (todasIguais) {
          vencedoras.push(linha);
          linhasGanhadoras++;
        }

        linhasFinalizadas++;
        if (linhasFinalizadas === linhas.length) {
          let textoFinal = "";
          let premioTotal = 0;

          if (linhasGanhadoras > 0 || payoutForcado || rodadasSemPremio >= 4) {
            rodadasSemPremio = 0;

            // Payout proporcional
            switch (linhasGanhadoras) {
              case 1:
                premioTotal = aposta * 0.3;
                textoFinal = "🎉 Você ganhou em 1 linha!";
                break;
              case 2:
                premioTotal = aposta * 0.6;
                textoFinal = "🎉 Você ganhou em 2 linhas!";
                break;
              case 3:
                premioTotal = aposta * 1.0;
                textoFinal = "🎉 Você ganhou em 3 linhas!";
                break;
              case 4:
                premioTotal = aposta * 1.5;
                textoFinal = "🎉 Você ganhou em 4 linhas!";
                break;
              case 5:
                premioTotal = aposta * 2.0;
                textoFinal = "🎉 JACKPOT! 5 LINHAS!!!";
                break;
              default:
                premioTotal = aposta * 0.2;
                textoFinal = "🎉 Pagamento aleatório para manter o pique!";
            }

            saldo += premioTotal;
            acumulado -= premioTotal;
            somVitoria.currentTime = 0;
            somVitoria.play();

          // Parar som após 3 segundos
            setTimeout(() => {
            somVitoria.pause();
            somVitoria.currentTime = 0;
          }, 1500);

             
            vencedoras.forEach((l) => l.classList.add("vencedora"));
            mensagem.textContent = `${textoFinal} 💰 Prêmio: R$ ${premioTotal.toFixed(2)}`;
          } else {
            rodadasSemPremio++;
            mensagem.textContent = "😢 Não foi dessa vez!";
          }

          atualizarValores();

          // Limpa animações depois de 1.5s
          setTimeout(() => {
            document.querySelectorAll(".linha img").forEach((img) => img.classList.remove("girando"));
          }, 1500);
        }
      }
    }, 100);
  });
}

// Eventos dos botões
btnGirar.addEventListener("click", () => {
  girarBobinas();
});

btnResetar.addEventListener("click", () => {
  saldo = 100.0;
  acumulado = 500.0;
  rodadasSemPremio = 0;
  atualizarValores();
  mensagem.textContent = "🔁 Jogo resetado!";
});

btnForcarJackpot.addEventListener("click", () => {
  girarBobinas(true);
});

// Inicia valores
atualizarValores();
