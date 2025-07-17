// === CONFIGURAÇÕES INICIAIS ===
const imagensDisponiveis = [
  "assets/imagens/lobo.png",
  "assets/imagens/tigre.png",
  "assets/imagens/leao.png",
  "assets/imagens/urso.png"
];

let fichas = parseFloat(localStorage.getItem("fichas")) || 50.00; // Valor inicial R$50
let acumulado = parseFloat(localStorage.getItem("acumulado")) || 100.00;

// === REFERÊNCIAS ===
const botoesBobinas = document.querySelectorAll(".linha span");
const botaoGirar = document.getElementById("btn-girar");
const seletorAposta = document.getElementById("valor-aposta");
const mensagem = document.getElementById("mensagem");
const linhas = document.querySelectorAll(".linha");
const acumuladoEl = document.querySelector(".acumulado");

// === FUNÇÕES ===
const mostrarFichas = () => {
  const fichasEl = document.querySelector(".fichas");
  fichasEl.textContent = `💰 R$ ${fichas.toFixed(2)}`;
};

const mostrarAcumulado = () => {
  acumuladoEl.textContent = `🏆 Prêmio Acumulado: R$ ${acumulado.toFixed(2)}`;
};

mostrarFichas();
mostrarAcumulado();

// === EVENTO GIRAR ===
btnGirar.addEventListener("click", () => {
  const aposta = parseFloat(apostaInput.value);

  if (saldo < aposta) {
    mensagem.textContent = "⚠️ Saldo insuficiente!";
    return;
  }

  btnGirar.disabled = true;
  mensagem.textContent = "🔄 Rodando... Boa sorte!";

  // Gira visual temporário (animação fake)
  let giros = 10;
  let animacao = setInterval(() => {
    bobinas.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const linha = gerarLinha();
      const div = document.createElement("div");
      div.classList.add("linha");
      mostrarLinha(linha, div);
      bobinas.appendChild(div);
    }
    giros--;
    if (giros <= 0) {
      clearInterval(animacao);

      // APÓS GIRO FINALIZA
      saldo -= aposta;
      const contribuicao = aposta * 0.8;
      acumulado += contribuicao;

      // Gerar resultado real
      bobinas.innerHTML = "";
      const linhas = [];
      for (let i = 0; i < 3; i++) {
        const linha = gerarLinha();
        linhas.push(linha);
        const div = document.createElement("div");
        div.classList.add("linha");
        mostrarLinha(linha, div);
        bobinas.appendChild(div);
      }

      let vitoria = false;
      let premio = 0;

      linhas.forEach((linha, i) => {
        if (linha.every((val) => val === linha[0])) {
          vitoria = true;
          premio += acumulado * 0.8;
          acumulado *= 0.2;
          bobinas.children[i].classList.add("vencedora");
        }
      });

      if (vitoria) {
        mensagem.textContent = `🎉 Você ganhou R$ ${premio.toFixed(2)}!`;
        saldo += premio;
      } else {
        mensagem.textContent = "😢 Não foi dessa vez...";
      }

      saldoEl.textContent = `💰 Saldo: R$ ${saldo.toFixed(2)}`;
      acumuladoEl.textContent = `🏆 Prêmio Acumulado: R$ ${acumulado.toFixed(2)}`;
      salvarEstado(saldo, acumulado);

      btnGirar.disabled = false;
    }
  }, 100);
});


function getEmojiFromImage(path) {
  if (path.includes("tigre")) return "🐯";
  if (path.includes("leao")) return "🦁";
  if (path.includes("urso")) return "🐻";
  if (path.includes("lobo")) return "�";
  return "❓";
}

function avaliarResultado(valorAposta) {
  let totalGanho = 0;
  const grade = Array.from(linhas).map(linha => Array.from(linha.querySelectorAll("span")).map(span => span.textContent));

  // Horizontais
  grade.forEach((linha, i) => {
    if (linha[0] === linha[1] && linha[1] === linha[2]) {
      totalGanho += valorAposta * 0.8;
      linhas[i].classList.add("vencedora");
    }
  });

  // Verticais
  for (let i = 0; i < 3; i++) {
    if (grade[0][i] === grade[1][i] && grade[1][i] === grade[2][i]) {
      totalGanho += valorAposta * 1.2;
      linhas[0].parentElement.classList.add("vencedora");
    }
  }

  // Diagonais
  if (grade[0][0] === grade[1][1] && grade[1][1] === grade[2][2]) {
    totalGanho += valorAposta * 1.5;
    linhas[1].classList.add("vencedora");
  }
  if (grade[0][2] === grade[1][1] && grade[1][1] === grade[2][0]) {
    totalGanho += valorAposta * 1.5;
    linhas[1].classList.add("vencedora");
  }

  if (totalGanho > 0) {
    mensagem.textContent = `🎉 Parabéns! Você ganhou R$ ${totalGanho.toFixed(2)}!`;
    fichas += totalGanho;
  } else {
    mensagem.textContent = "😞 Não foi dessa vez!";
    acumulado += valorAposta;
  }
}

// === BOTÃO SECRETO (FORÇAR JACKPOT) ===
const botaoSecreto = document.getElementById("forcar-jackpot");

if (botaoSecreto) {
  botaoSecreto.addEventListener("click", () => {
    const linhaDoMeio = document.querySelectorAll(".linha")[1];
    const spans = linhaDoMeio.querySelectorAll("span");

    spans.forEach((span) => {
      span.textContent = "🐯";
    });

    linhaDoMeio.classList.add("vencedora");
    fichas += acumulado;
    mensagem.textContent = `💰 JACKPOT SECRETO! Você ganhou R$ ${acumulado.toFixed(2)}!`;
    acumulado = 0;

    localStorage.setItem("fichas", fichas);
    localStorage.setItem("acumulado", acumulado);
    mostrarFichas();
    mostrarAcumulado();
  });
}
// === BOTÃO PARA RESETAR JOGO ===
const botaoReset = document.getElementById("resetar-jogo");

if (botaoReset) {
  botaoReset.addEventListener("click", () => {
    localStorage.setItem("fichas", 50.00);
    localStorage.setItem("acumulado", 100.00);
    location.reload(); // Atualiza a página pra aplicar
  });
}
