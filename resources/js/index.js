//Dispositivos de salida
const screen = document.querySelector(".output-screen");
const printer = document.querySelector("output-printer");

//Entradas y datos
const file = document.querySelector("#file");
const kernel = document.querySelector("#kernel");
const memory = document.querySelector("#memory");

//Mapa de memoria y otros
const memoryMap = document.querySelector(".memory-map textarea");
const variables = document.querySelector(".variables textarea");
const tags = document.querySelector(".tags textarea");

//Memoria
const mainMemory = [];
const tagsList = [];
const variablesList = [];

const tokens = [
  "cargue",
  "almacene",
  "nueva",
  "lea",
  "sume",
  "reste",
  "multiplique",
  "divida",
  "potencia",
  "modulo",
  "concatene",
  "elimine",
  "extraiga",
  "Y",
  "O",
  "NO",
  "muestre",
  "imprima",
  "vaya",
  "vayasi",
  "etiqueta",
  "retorne",
];

function leerArchivo(e) {
  const archivo = e.target.files[0];

  const lector = new FileReader();
  lector.onload = (e) => {
    let contenido = e.target.result;
    const lines = contenido.split(/\r\n|\n/);
    console.log(lines);
    verificarSintaxis(lines);
  };

  lector.readAsText(archivo);
}

file.addEventListener("change", leerArchivo, false);

function verificarSintaxis(lineArray) {
  lineArray.forEach((line) => {
    let instruction = line.trim().split(" ")[0];
    console.log(instruction);
    if (tokens.includes(instruction)) {
      memoryMap.value += `${line.trim()}\n`;
      mainMemory.push(line.trim());

    //   if (instruction === "nueva") {
    //   }
    } else if (line.startsWith("//") || line === "") {
    } else {
      console.log(line);
      throw new Error("Error en la línea", line);
    }
  });

  console.log(mainMemory);
}
