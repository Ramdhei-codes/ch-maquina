//Dispositivos de salida
const screen = document.querySelector(".output-screen");
const printer = document.querySelector("output-printer");

//Entradas y datos
const file = document.querySelector("#file");
const kernel = parseInt(document.querySelector("#kernel").value);
const memory = document.querySelector("#memoria").value;
const initButton = document.querySelector("#init");

//Tamaños límite
const KERNEL_DEFAULT = 59;
const MAX_MEMORY = 5100;

//Mapa de memoria y otros
const memoryMap = document.querySelector(".memory-map textarea");
const variables = document.querySelector(".variables textarea");
const tags = document.querySelector(".tags textarea");

//Memoria
const mainMemory = [];
const tagsList = [];
const variablesList = [];
let acumulador = 0;

const tokens = {
  cargue: cargue,
  almacene: almacene,
  nueva: nueva,
  lea: lea,
  sume: sume,
  reste: reste,
  multiplique: multiplique,
  divida: divida,
  potencia: potencia,
  modulo: modulo,
  concatene: concatene,
  elimine: elimine,
  extraiga: extraiga,
  Y: Y,
  O: O,
  NO: NO,
  muestre: muestre,
  imprima: imprima,
  vaya: vaya,
  vayasi: vayasi,
  etiqueta: etiqueta,
  retorne: retorne,
  xxxx: xxxx,
};

initButton.addEventListener("click", init);

function init() {
  mainMemory[0] = acumulador;
  fillKernel();
}

function showMemory() {
  memoryMap.value = "";
  mainMemory.forEach((line) => {
    memoryMap.value += `${line}\n`;
  });
}

function fillKernel() {
  for (let i = 0; i < kernel; i++) {
    mainMemory.push("KERNEL-CH");
  }
  alert("Kernel listo dentro de la memoria");
}

file.addEventListener("change", cargarArchivo, false);

function cargarArchivo(e) {
  const archivo = e.target.files[0];
  const lector = new FileReader();
  let lines;
  lector.onload = (e) => {
    let contenido = e.target.result;
    lines = contenido.split(/\r\n|\n/);
    verificarSintaxis(lines);
  };

  lector.readAsText(archivo);
}

function verificarSintaxis(lineArray) {
  console.log(Object.keys(tokens));
  lineArray.forEach((line) => {
    let instruction = line.trim().split(" ")[0];

    if (Object.keys(tokens).includes(instruction)) {
      mainMemory.push(line.trim());
      if (instruction === "etiqueta") {
        tagsList.push(line);
      }
      if (instruction.toLowerCase() === "nueva") {
        addVariable(line);
      }
    } else if (line.startsWith("//") || line === "") {
    } else {
      console.log(line);
      alert(`Error en la línea ${line}, sintaxis incorrecta`);
      throw new Error("Invalid syntax at " + line);
    }
  });

  console.log(mainMemory);
}

function addVariable(line) {
  line = line.split(" ");
  line.shift();
  console.log(line);

  const baseCases = {
    C: "",
    I: 0,
    R: 0.0,
    L: 0,
  };

  const nombre = line[0];
  const tipo = line[1];

  let valor = line[2];

  if (!valor) {
    valor = baseCases[tipo];
  }

  let variable = {
    nombre: nombre,
    tipo: tipo,
    valor: valor,
  };

  variablesList.push(variable);
}

function exec(stepByStep) {
  let instruction;
  let parameters;
  let line;
  for (let index = kernel + 1; index < mainMemory.length; index++) {
    line = mainMemory[index].split(" ");
    instruction = line[0];
    line.shift();
    parameters = line;

    if (stepByStep) {
      alert(`Ejecución de la línea ${mainMemory[index]}`);
    }

    tokens[instruction](parameters);
  }
}

function cargue(params) {
  console.log(params);
}

function almacene() {}

function nueva(params) {
  console.log("Nueva " + params);
}

function lea() {}

function sume() {}

function reste() {}

function multiplique() {}

function divida() {}

function potencia() {}

function modulo() {}

function concantene() {}

function elimine() {}

function extraiga() {}

function Y() {}

function O() {}

function NO() {}

function muestre() {}

function imprima() {}

function vaya() {}

function vayasi() {}

function etiqueta() {}

function retorne() {}

function xxxx() {}

function concatene() {}
