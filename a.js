const visor = document.getElementById('ap');

const botoesNumeros = document.querySelectorAll('.espaco button:not(#btn):not(#btn4):not(#btn5):not(#btn10):not(#btn14):not(#btn15):not(#btn16):not(#btn17):not(#btn18):not(#btn19)'); 
botoesNumeros.forEach(botao => {
    botao.addEventListener('click', () => inserirNoVisor(botao.innerText));
});

function inserirNoVisor(valor) {
    visor.value += valor;
}

function apagarUm() {
    visor.value = visor.value.slice(0, -1);
}

function limparTudo() {
    visor.value = "";
}

document.addEventListener('keydown', (event) => {
    if (/[0-9]/.test(event.key)) {
        inserirNoVisor(event.key);
    } else if (event.key === 'Backspace') {
        apagarUm();
    } else if (event.key === 'Delete') {
        limparTudo();
    }
});