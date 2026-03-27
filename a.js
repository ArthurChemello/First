const visor = document.getElementById('ap');

const botoesNumeros = document.querySelectorAll('.espaco button:not(#btn):not(#btn4):not(#btn5):not(#btn10):not(#btn14):not(#btn15):not(#btn16):not(#btn17):not(#btn18):not(#btn19)'); 
botoesNumeros.forEach(botao => {
    botao.addEventListener('click', () => inserirNoVisor(botao.innerText));
});

const botoesOperadores = document.querySelectorAll('.oper');

botoesOperadores.forEach(botao => {
    botao.addEventListener('click', () => inserirNoVisor(botao.innerText));
});


function inserirNoVisor(valor) {
    const ultimo = visor.value.slice(-1);
    const op = ["+", "-", "*", "/", "÷"];
    if(visor.value === "" && valor !== "-" && op.includes(valor)){
        return;
    }
    if(op.includes(ultimo) && op.includes(valor)){
        if(valor === "-" && ultimo !== "-") {

        } else {
            return;
        }
    }    
    if(valor === "="){
        return;
    }
    if(valor ==="."){
        let p = visor.value.split(/[+\-*/]/);
        let uN = p[p.length-1];
        if(uN.includes(".")){
            return;
        }
        if(uN === ""){
            valor = "0.";
        }
    }
    visor.value += valor;

    visor.selectionStart = visor.selectionEnd = visor.value.length;    
    visor.scrollTop = visor.scrollHeight;
    visor.scrollLeft = visor.scrollWidth;
}

function apagarUm() {
    visor.value = visor.value.slice(0,-1);
}

function limparTudo() {
    visor.value = "";
}

document.addEventListener('keydown', (event) => {    
    if (/[0-9]/.test(event.key)) {
        event.preventDefault();
        inserirNoVisor(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        event.preventDefault();
        inserirNoVisor(event.key);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        calcular();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        apagarUm();
    } else if (event.key === 'Delete') {
        event.preventDefault();
        limparTudo();
    } else {
        event.preventDefault(); 
    }
});

function trocarSinal() {
  let ex = visor.value;
  if (!ex) return;
  let match = ex.match(/(-?\d+\.?\d*)$/);
  if (!match) return;

  let numero = match[1];
  let resto = ex.slice(0, ex.length - numero.length);

  if (numero.startsWith("-")) {
    visor.value = resto + numero.slice(1); 
  } else {
    visor.value = resto + "-" + numero;
  }
}

function porcent(){
    let ex = visor.value;
    
    if(ex.includes('e') || ex === ""){
        return;
    }
    let p = ex.split(/([+\-*/])/);
    let u = p[p.length-1];    
    if(!u || isNaN(u)){
        return;
    }
    if(parseFloat(u) === 0){
        return;
    }
    let resultado = parseFloat(u) / 100;

    resultado = parseFloat(resultado.toPrecision(10));

    p[p.length-1] = resultado;
    visor.value = p.join("");
}

const botoesApagar = document.querySelectorAll('.espaco button#btn, .espaco button#btn5');
botoesApagar.forEach(botao => {
    botao.addEventListener('click', () => {
        if (botao.id === 'btn5') {
            apagarUm();
        }   else if (botao.id === 'btn') {
            limparTudo();
        }   
    });
});

const botaoIgual = document.getElementById("btn19");
botaoIgual.addEventListener('click', calcular);

const botaoTrocaSinal = document.getElementById("btn4");
botaoTrocaSinal.addEventListener('click', trocarSinal);

const botaoPorcent = document.getElementById("btn10");
botaoPorcent.addEventListener('click', porcent);

const botaoDec = document.getElementById("btn14");
botaoDec.addEventListener('click', () => inserirNoVisor("."));

function calcular() {
    let expressao = visor.value;
     expressao = expressao.replace(/÷/g, "/");

    if (/[+\-*/]{2,}/.test(expressao) && !/[+*/]-/.test(expressao)) {
        visor.value = "Erro";
        return;
    }

    if (/[+\-*/]$/.test(expressao)) {
        visor.value = "Erro";
        return;
    }

    if (expressao[0] === "-") {
        expressao = "0" + expressao;
    }
    const t = expressao.match(/((?<=[+*/])-\d+\.?\d*|\d+\.?\d*|[+\-*/])/g);
    if (!t) return;
    let prior = [];
    for (let i = 0; i < t.length; i++) {
        let item = t[i];
        if (item === "*" || item === "/" || item === "÷") {
            let op = item;
            let proximo = parseFloat(t[++i]);
            let anterior = prior.pop();
            if (isNaN(anterior) || isNaN(proximo)) {
                visor.value = "Erro";
                return;
            }
            if ( proximo === 0 && (op === "/" || op === "÷")) {
                visor.value = "Como passou no colégio?";
                return;
            }
            if (op === "*") prior.push(anterior * proximo);
            else prior.push(anterior / proximo);
        } else {
            prior.push(isNaN(item) ? item : parseFloat(item));
        }
    }

    let resultado = prior[0];

    for (let i = 1; i < prior.length; i += 2) {
        let operador = prior[i];
        let numero = prior[i + 1];

        if (operador === "+") resultado += numero;
        else resultado -= numero;
    }

    visor.value = resultado;
}

const botaoDeslig = document.querySelector('.deslig');
botaoDeslig.addEventListener('click', () => {
    const botoes = document.querySelectorAll('button:not(.deslig):not(#algo)');
    const cena = document.querySelector('.tela');
    const cenaRect = cena.getBoundingClientRect();

    botoes.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const obj = {
            el: btn,
            x: rect.left - cenaRect.left,
            y: rect.top - cenaRect.top,
            w: rect.width,
            h: rect.height,
            vy: (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 4,
            settled: false
        };

        btn.style.position = 'absolute';
        btn.style.left = obj.x + 'px';
        btn.style.top = obj.y + 'px';
        btn.style.margin = '0';
        btn.style.zIndex = '999';
        cena.appendChild(btn);

        function animar() {
            if (obj.settled) return;

            obj.vy += 0.6;
            obj.vx *= 0.99;
            obj.x += obj.vx;
            obj.y += obj.vy;

            const H = cena.offsetHeight;
            const W = cena.offsetWidth;

            if (obj.x < 0) { obj.x = 0; obj.vx = Math.abs(obj.vx) * 0.5; }
            if (obj.x + obj.w > W) { obj.x = W - obj.w; obj.vx = -Math.abs(obj.vx) * 0.5; }
            if (obj.y + obj.h >= H) {
                obj.y = H - obj.h;
                obj.vy *= -0.35;
                obj.vx *= 0.85;
                if (Math.abs(obj.vy) < 0.5 && Math.abs(obj.vx) < 0.5) {
                    obj.settled = true;
                }
            }

            btn.style.left = obj.x + 'px';
            btn.style.top = obj.y + 'px';

            if (!obj.settled) requestAnimationFrame(animar);
        }

        requestAnimationFrame(animar);
    });
});

let girando = false;
let anguloAtual = 0;
let animacaoGiro;

document.getElementById('algo').addEventListener('click', () => {
    if (girando) {
        girando = false;
        cancelAnimationFrame(animacaoGiro);
        document.querySelector('.celular').style.transform = 'rotate(0deg)';
        return;
    }

    girando = true;

    function girar() {
        if (!girando) return;
        anguloAtual += 0.3;
        document.querySelector('.celular').style.transform = `rotate(${anguloAtual}deg)`;
        animacaoGiro = requestAnimationFrame(girar);
    }

    girar();
});