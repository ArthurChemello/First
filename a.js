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
    const op = ["+", "-", "*", "/"];
    if(visor.value === "" && valor !== "-" && op.includes(valor)){
        return;
    }
    if(op.includes(ultimo) && op.includes(valor)){
        return;
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
    visor.value = visor.value.slice(0, -1);
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
    }
});

function trocarSinal(){
    let ex = visor.value;
    let p = ex.split(/([+\-*/])/);
    let u = p[p.length-1];
    if(!u){
        return;
    }
    if(u.startsWith("-")){
        p[p.length-1] = u.substring(1);
    }else{
        p[p.length-1] = "-" + u;
    }
    visor.value = p.join("");
}

function porcent(){
    let ex = visor.value;
    let p = ex.split(/([+\-*/])/);
    let u = p[p.length-1];
    if(!u || isNaN(u)){
        return;
    }
    p[p.length-1] = parseFloat(u)/100;
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
    if (expressao[0] === "-") {
        expressao = "0" + expressao;
    }
    const t = expressao.match(/(\d+\.?\d*|\+|-|\*|\/)/g);
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
                visor.value = "Erro";
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

