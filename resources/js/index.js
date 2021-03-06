//Dispositivos de salida
const screen = document.querySelector(".output-screen-text");
const printer = document.querySelector(".output-printer-text p");

//Entradas y datos
const file = document.querySelector("#file");
const kernel = document.querySelector("#kernel");
console.log(kernel);
const memory = document.querySelector("#memoria");
const initButton = document.querySelector("#init");
const execButton = document.querySelector("#exec");
const quantum = document.querySelector("#quantum");
const pasoAPaso = document.querySelector("#stepByStep");
const textAcumulador = document.querySelector("#acumulador-text");

//Tamaños límite
const KERNEL_DEFAULT = 59;
const MAX_MEMORY = 5100;
let programasCargados = 0;

//Mapa de memoria y otros
const memoryMap = document.querySelector(".memory-map textarea");
const variables = document.querySelector(".variables textarea");
const tags = document.querySelector(".tags textarea");

//Memoria
const mainMemory = [];
const tagsList = [];
const variablesList = [];
let acumulador = 0;
const procesos = [];

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
execButton.addEventListener("click", exec);

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
  if (!kernel.value || !memory.value) {
    alert("Por favor llene los apartados de memoria y kernel");
  } else {
    for (let i = 0; i < parseInt(kernel.value); i++) {
      mainMemory.push("KERNEL-CH");
    }
    alert("Kernel listo dentro de la memoria");
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
    cargarPrograma(lines);
  };

  lector.readAsText(archivo);
  alert(`Verificaremos la sintaxis de ${archivo.name}`);
}

function cargarPrograma(lineArray) {
  tagsList[programasCargados] = [];
  variablesList[programasCargados] = [];
  procesos[programasCargados] = [];
  lineArray.forEach((line) => {
    let instruction = line.trim().split(" ")[0];

    if (Object.keys(tokens).includes(instruction)) {
      if (instruction === "etiqueta") {
        tagsList[programasCargados].push(crearEtiqueta(line));
      }
      if (instruction.toLowerCase() === "nueva") {
        variablesList[programasCargados].push(crearVariable(line));
      }
      mainMemory.push(line.trim());
      memoryMap.textContent += `${line}\n`;
      procesos[programasCargados].push(line.trim());
    } else if (line.startsWith("//") || line === "") {
    } else {
      alert(`Error en la línea ${line}, sintaxis incorrecta`);
      throw new Error("Invalid syntax at " + line);
    }
  });

  programasCargados++;
}

function crearEtiqueta(line) {
  line = line.split(" ");
  line.shift();

  const nombre = line[0];
  const ubicacion = parseInt(line[1]);

  let etiqueta = {
    nombre: nombre,
    ubicacion: ubicacion,
  };

  tags.textContent += `${nombre}  ${ubicacion} \n`;

  return etiqueta;
}

function crearVariable(line) {
  line = line.split(" ");
  line.shift();

  const baseCases = {
    C: "",
    I: 0,
    R: 0.0,
    L: false,
  };

  const nombre = line[0];
  const tipo = line[1];

  let valor = line[2];

  if (!valor) {
    valor = baseCases[tipo];
  }

  if (tipo === "I" && valor) {
    valor = parseInt(valor);
  }
  if (tipo === "R" && valor) {
    valor = parseFloat(valor);
  }
  if (tipo === "L" && valor) {
    if (valor === "1") {
      valor = true;
    } else if (valor === "0") {
      valor = false;
    }
  }

  let variable = {
    nombre: nombre,
    tipo: tipo,
    valor: valor,
  };

  variables.textContent += `${nombre}  ${valor} \n`;

  return variable;
}

function exec(stepByStep) {
  if (pasoAPaso.selectedIndex === 0) {
    stepByStep = true;
  } else {
    stepByStep = false;
  }
  const indiceMetodo = document.querySelector(
    "#metodo-planificacion"
  ).selectedIndex;

  const metodos = {
    0: RR,
    1: SJF,
    2: SJFExpropiativo,
    3: prioridadExpropiativo,
    4: prioridad,
    5: FCFS,
  };

  metodos[indiceMetodo](stepByStep);
}

function RR(stepByStep) {
  let quantumNumber = parseInt(quantum.value);
  console.log(quantumNumber);
  let instruction;
  let parameters;
  let line;

  let i = 0;

  while (true) {
    textAcumulador.textContent = mainMemory[0];
    for (let j = 0; j < procesos[i].length; j++) {
      console.log(mainMemory[0]);
      line = procesos[i][j].split(" ");
      instruction = line[0];
      line.shift();
      parameters = line;

      if (j === quantumNumber) {
        break;
      }

      if (stepByStep) {
        stepByStep = confirm(
          `Ejecución de la línea ${procesos[i][j]}. ¿Desea seguir en modo paso a paso?`
        );
      }

      if (instruction.toLowerCase() === "retorne") {
        procesos[i].shift();
        break;
      }
      tokens[instruction](parameters, i);
      procesos[i].shift();
    }
    let llenos = procesos.map((proceso) => proceso.length > 0);
    let verificaLlenos = llenos.every((elemento) => elemento);

    if (!verificaLlenos) {
      break;
    }
    procesos.push(procesos.shift());
  }
}

function SJFExpropiativo(stepByStep) {
  SJF(stepByStep);
}

function prioridadExpropiativo(stepByStep) {
  prioridad(stepByStep);
}

function FCFS(stepByStep) {
  textAcumulador.textContent = mainMemory[0];
  let instruction;
  let parameters;
  let line;
  for (let i = 0; i < procesos.length; i++) {
    console.log(procesos[i]);
    for (let j = 0; j < procesos[i].length; j++) {
      console.log(mainMemory[0]);
      line = procesos[i][j].split(" ");
      instruction = line[0];
      line.shift();
      parameters = line;

      if (stepByStep) {
        stepByStep = confirm(
          `Ejecución de la línea ${procesos[i][j]}. ¿Desea seguir en modo paso a paso?`
        );
      }
      if (instruction === "vaya") {
        const tag = searchTag(parameters[0], i);
        let lineaVaya = procesos[i][tag.ubicacion].split(" ");
        let instruccionVaya = lineaVaya[0];
        lineaVaya.shift();
        let parametrosVaya = lineaVaya;
        tokens[instruccionVaya](parametrosVaya);
      } else if (instruction === "vayasi") {
        const tag = searchTag(parameters[0], i);
        const tag1 = searchTag(parameters[1], i);

        let lineaVaya = procesos[i][tag.ubicacion].split(" ");
        let lineaVaya1 = procesos[i][tag1.ubicacion].split(" ");

        let instruccionVaya = lineaVaya[0];
        let instruccionVaya1 = lineaVaya1[0];
        lineaVaya.shift();
        lineaVaya1.shift();
        let parametrosVaya = lineaVaya;
        let parametrosVaya1 = lineaVaya1;

        if (acumulador > 0) {
          tokens[instruccionVaya](parametrosVaya);
        } else if (acumulador < 0) {
          tokens[instruccionVaya1](parametrosVaya1);
        }
      }

      if (instruction.toLowerCase() === "retorne") {
        break;
      }
      tokens[instruction](parameters, i);
    }
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function prioridad() {
  procesos = shuffle(procesos);

  let instruction;
  let parameters;
  let line;
  for (let i = 0; i < procesos.length; i++) {
    for (let j = 0; j < procesos[i].length; j++) {
      console.log(mainMemory[0]);
      line = procesos[i][j].split(" ");
      instruction = line[0];
      line.shift();
      parameters = line;

      if (stepByStep) {
        stepByStep = confirm(
          `Ejecución de la línea ${procesos[i][j]}. ¿Desea seguir en modo paso a paso?`
        );
      }

      if (instruction.toLowerCase() === "retorne") {
        break;
      }
      if (instruction === "vaya") {
        const tag = searchTag(parameters[0], i);
        let lineaVaya = procesos[i][tag.ubicacion].split(" ");
        let instruccionVaya = lineaVaya[0];
        lineaVaya.shift();
        let parametrosVaya = lineaVaya;
        tokens[instruccionVaya](parametrosVaya);
      } else if (instruction === "vayasi") {
        const tag = searchTag(parameters[0], i);
        const tag1 = searchTag(parameters[1], i);

        let lineaVaya = procesos[i][tag.ubicacion].split(" ");
        let lineaVaya1 = procesos[i][tag1.ubicacion].split(" ");

        let instruccionVaya = lineaVaya[0];
        let instruccionVaya1 = lineaVaya1[0];
        lineaVaya.shift();
        lineaVaya1.shift();
        let parametrosVaya = lineaVaya;
        let parametrosVaya1 = lineaVaya1;

        if (acumulador > 0) {
          tokens[instruccionVaya](parametrosVaya);
        } else if (acumulador < 0) {
          tokens[instruccionVaya1](parametrosVaya1);
        }
      }
      tokens[instruction](parameters, i);
    }
  }
}

function SJF(stepByStep) {
  const procesosSJF = procesos.sort();
  let instruction;
  let parameters;
  let line;
  for (let i = 0; i < procesosSJF.length; i++) {
    for (let j = 0; j < procesosSJF[i].length; j++) {
      console.log(mainMemory[0]);
      line = procesosSJF[i][j].split(" ");
      instruction = line[0];
      line.shift();
      parameters = line;

      if (stepByStep) {
        stepByStep = confirm(
          `Ejecución de la línea ${procesos[i][j]}. ¿Desea seguir en modo paso a paso?`
        );
      }

      if (instruction.toLowerCase() === "retorne") {
        break;
      }
      if (instruction === "vaya") {
        const tag = searchTag(parameters[0], i);
        let lineaVaya = procesos[i][tag.ubicacion].split(" ");
        let instruccionVaya = lineaVaya[0];
        lineaVaya.shift();
        let parametrosVaya = lineaVaya;
        tokens[instruccionVaya](parametrosVaya);
      } else if (instruction === "vayasi") {
        const tag = searchTag(parameters[0], i);
        const tag1 = searchTag(parameters[1], i);

        let lineaVaya = procesos[i][tag.ubicacion].split(" ");
        let lineaVaya1 = procesos[i][tag1.ubicacion].split(" ");

        let instruccionVaya = lineaVaya[0];
        let instruccionVaya1 = lineaVaya1[0];
        lineaVaya.shift();
        lineaVaya1.shift();
        let parametrosVaya = lineaVaya;
        let parametrosVaya1 = lineaVaya1;

        if (acumulador > 0) {
          tokens[instruccionVaya](parametrosVaya);
        } else if (acumulador < 0) {
          tokens[instruccionVaya1](parametrosVaya1);
        }
      }
      tokens[instruction](parameters, i);
    }
  }
}

function searchVariable(name, processIndex) {
  const variable = variablesList[processIndex].find(
    (variable) => variable.nombre === name
  );
  const index = variablesList[processIndex].findIndex(
    (variable) => variable.nombre === name
  );
  return [variable, index];
}

function searchTag(name, processIndex) {
  const tag = tagsList[processIndex].find((tag) => tag.nombre === name);

  return tag;
}

function cargue(params, processIndex) {
  console.log(searchVariable(params[0], processIndex));
  const variable = searchVariable(params[0], processIndex)[0];
  console.log(variable);
  mainMemory[0] = variable.valor;
}

function almacene(params, processIndex) {
  const variableName = params[0];

  const variable = searchVariable(variableName, processIndex);

  const index = variable[1];

  variablesList[0][index].valor = mainMemory[0];
}

function nueva() {}

function lea(params, processIndex) {
  const variableName = params[0];

  const variable = searchVariable(variableName, processIndex);

  const index = variable[1];

  let nuevoValor = prompt(`Ingrese valor para la variable ${variableName}`);

  if (!isNaN(nuevoValor)) {
    nuevoValor = Number(nuevoValor);
  }

  variablesList[0][index].valor = nuevoValor;
}

function sume(params, processIndex) {
  const variable = params[0];

  const variableData = searchVariable(variable, processIndex);

  const sumando = variableData[0].valor;

  if (isNaN(mainMemory[0])) {
    alert("El acumulador no es un número");
    throw new Error("El acumulador no es un número");
  }

  mainMemory[0] += sumando;
}

function reste(params, processIndex) {
  const variable = params[0];

  console.log(variable);

  const variableData = searchVariable(variable, processIndex);
  console.log("VarData " + variableData);

  const resta = variableData[0].valor;

  if (isNaN(mainMemory[0])) {
    alert("El acumulador no es un número");
    throw new Error("El acumulador no es un número");
  }

  mainMemory[0] -= resta;
}

function multiplique(params, processIndex) {
  const variable = params[0];

  const variableData = searchVariable(variable, processIndex);

  const factor = variableData[0].valor;

  if (isNaN(mainMemory[0])) {
    alert("El acumulador no es un número");
    throw new Error("El acumulador no es un número");
  }

  mainMemory[0] += factor;
}

function divida(params, processIndex) {
  const variable = params[0];

  const variableData = searchVariable(variable, processIndex);

  const dividendo = variableData[0].valor;

  if (dividendo === 0) {
    alert("Error de división por cero");
    throw new Error("División por cero");
  }

  if (isNaN(mainMemory[0])) {
    alert("El acumulador no es un número");
    throw new Error("El acumulador no es un número");
  }

  mainMemory[0] /= dividendo;
}

function potencia(params, processIndex) {
  const variable = params[0];

  const variableData = searchVariable(variable, processIndex);

  const pot = variableData[0].valor;

  if (isNaN(mainMemory[0])) {
    alert("El acumulador no es un número");
    throw new Error("El acumulador no es un número");
  }

  mainMemory[0] = Math.pow(mainMemory[0], pot);
}

function modulo(params, processIndex) {
  const variable = params[0];

  const variableData = searchVariable(variable, processIndex);

  const mod = variableData[0].valor;

  if (mod === 0) {
    alert("Error de división por cero");
    throw new Error("División por cero");
  }

  if (isNaN(mainMemory[0])) {
    alert("El acumulador no es un número");
    throw new Error("El acumulador no es un número");
  }

  mainMemory[0] %= mod;
}

function concatene(params, processIndex) {
  const cadena = params[0];

  mainMemory[0] = `${mainMemory[0]}${cadena}`;
}

function elimine(params, processIndex) {
  const subcadena = params[0];

  mainMemory[0].replaceAll(subcadena, "");
}

function extraiga(params, processIndex) {}

function Y(params, processIndex) {
  if (params.length !== 3) {
    alert(`Parámetros erróneos, deben ser 3 y se pusieron ${params.length}`);
  }

  const param1 = searchVariable(params[0], processIndex);
  const param2 = searchVariable(params[1], processIndex);
  const param3 = searchVariable(params[2], processIndex);

  const indexParam3 = param3[1];

  variablesList[0][indexParam3].valor = param1[0].valor && param2[0].valor;
}

function O(params, processIndex) {
  if (params.length !== 3) {
    alert(`Parámetros erróneos, deben ser 3 y se pusieron ${params.length}`);
  }

  const param1 = searchVariable(params[0], processIndex);
  const param2 = searchVariable(params[1], processIndex);
  const param3 = searchVariable(params[2], processIndex);

  const indexParam3 = param3[1];

  variablesList[0][indexParam3].valor = param1[0].valor || param2[0].valor;
}

function NO(params, processIndex) {
  if (params.length !== 2) {
    alert(`Parámetros erróneos, deben ser 2 y se pusieron ${params.length}`);
  }

  const param1 = searchVariable(params[0], processIndex);
  const param2 = searchVariable(params[1], processIndex);

  const indexParam2 = param2[1];

  variablesList[0][indexParam2].valor = !param1[0].valor;
}

function muestre(params, processIndex) {
  if (params[0] === "acumulador") {
    screen.innerHTML = mainMemory[0];
  } else {
    console.log(params);
    const variable = searchVariable(params[0], processIndex);
    const variableInfo = variable[0];
    console.log(variableInfo);

    screen.innerHTML = variableInfo.valor;
  }
}

function imprima(params, processIndex) {
  if (params[0] === "acumulador") {
    printer.innerHTML = mainMemory[0];
  } else {
    const variable = searchVariable(params[0], processIndex);
    const variableInfo = variable[0];

    printer.innerHTML = variableInfo.valor;
  }
}

function vaya() {}

function vayasi() {}

function etiqueta() {}

function retorne() {}

//Pone en el acumulador un número random entre 1 y 10
function xxxx(params) {
  mainMemory[0] = Math.floor(Math.random() * (10 - 1) + 1);
}

function saveTextAsFile(textToWrite, fileNameToSaveAs = "creado.ch") {
  var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}
