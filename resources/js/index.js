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

initButton.addEventListener("click", init());

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
    } else if (line.startsWith("//") || line === "") {
    } else {
      console.log(line);
      alert(`Error en la línea ${line}, sintaxis incorrecta`);
      throw new Error("Invalid syntax at " + line);
    }
  });

  console.log(mainMemory);
}

function cargue() {}

function almacene() {}

function nueva() {}

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
