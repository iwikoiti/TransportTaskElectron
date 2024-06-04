let btnCreate = document.getElementById("createTableButton"),
  nval = 0,
  mval = 0,
  tblCreate = document.getElementById("createTable"),
  btnStep = document.getElementById("nextStep"),
  tblDraw = document.getElementById("drawTable"),
  sltF = document.getElementById("solutionF");

let exmpl1 = document.getElementById("example1"),
  exmpl2 = document.getElementById("example2"),
  exmpl3 = document.getElementById("example3");

let flagStep = false;
let matrixC = [];
let matrixCross = [];
let matrixPot = [];

let flagTableVariant = false; // false - маленькая таблица, true - большая - отрисовка

let masU = [];
let masV = [];
let matrixNev = [];
let matrixOnes = [];
let matrixCont = [];

function flags() {
  flagStep = false;
  flagTableVariant = false;
  sltF.textContent = "";
}

btnCreate.addEventListener("click", () => {
  flags();

  matrixC = [];

  nval = Number(document.getElementById("N").value);
  mval = Number(document.getElementById("M").value);
  matrixC = initMatrixNull(0);
  document.getElementById("drawTable").innerHTML = "";
  //document.getElementById("createTable").innerHTML = "";
  displayTbl();
});

exmpl1.addEventListener("click", () => {
  flags();
  matrixC = [];

  nval = 5;
  mval = 4;
  document.getElementById("N").value = 5;
  document.getElementById("M").value = 4;

  matrixC = initMatrixNull(0);
  matrixC = [
    [2, 7, 7, 6, 20],
    [1, 1, 1, 2, 50],
    [5, 5, 3, 1, 10],
    [2, 8, 1, 4, 20],
    [3, 2, 1, 5, 18],
    [40, 30, 20, 20, null],
  ];
  btnStep.click();
});

exmpl2.addEventListener("click", () => {
  flags();
  matrixC = [];
  matrixC = initMatrixNull(0);

  nval = 4;
  mval = 4;
  document.getElementById("N").value = 4;
  document.getElementById("M").value = 4;

  matrixC = [
    [9, 1, 9, 3, 50],
    [8, 2, 1, 6, 50],
    [7, 6, 4, 2, 20],
    [9, 4, 6, 6, 20],
    [15, 35, 45, 45, null],
  ];
  btnStep.click();
});

exmpl3.addEventListener("click", () => {
  flags();
  matrixC = [];
  matrixC = initMatrixNull(0);

  nval = 4;
  mval = 4;
  document.getElementById("N").value = 4;
  document.getElementById("M").value = 4;

  matrixC = [
    [9, 4, 2, 6, 19],
    [7, 8, 3, 3, 14],
    [4, 7, 5, 4, 6],
    [6, 8, 7, 5, 11],
    [6, 10, 14, 20, null],
  ];
  btnStep.click();
});

function displayTbl() {
  if (nval > 0 && mval > 0) {
    let count = 0;
    for (let i = 0; i <= nval + 1; i++) {
      let tr_el = document.createElement("tr");

      for (let j = 0; j <= mval + 1; j++) {
        if (i == 0 && j == 0) {
          let th_el = document.createElement("th");
          tr_el.appendChild(th_el);
        } else if (i == 0) {
          let th_el = document.createElement("th");

          if (j == mval + 1) {
            th_el.textContent = "П";
          } else {
            th_el.textContent = "B" + j;
          }
          tr_el.appendChild(th_el);
        } else if (j == 0) {
          let th_el = document.createElement("th");

          if (i == nval + 1) {
            th_el.textContent = "C";
          } else {
            th_el.textContent = "А" + i;
          }
          tr_el.appendChild(th_el);
        } else {
          if (i == nval + 1 && j == mval + 1) {
            break;
          }
          let td_el = document.createElement("td");
          let input_el = document.createElement("input");
          input_el.setAttribute("type", "number");
          input_el.setAttribute(
            "class",
            "bg-zinc-700 text-white size-8 rounded"
          );
          input_el.id = count;
          count++;

          td_el.appendChild(input_el);
          tr_el.appendChild(td_el);
        }
      }

      tblCreate.appendChild(tr_el);
    }
  } else {
    alert("Введите размерность таблицы");
  }
}

btnStep.addEventListener("click", () => {
  if (!flagStep) {
    // matrixC = initMatrixNull(0);
    matrixCross = initMatrixZeros(0);
    matrixPot = initMatrixNull(0);
    matrixNev = initMatrixNull(-1);
    matrixOnes = initMatrixZeros(0);
    matrixCont = initMatrixZeros(0);

    getNums();
    flagStep = true;
    drawTable();
    document.getElementById("createTable").innerHTML = "";
  } else {
    if (leastCostMethod()) {
      drawTable();
    } else {
      flagTableVariant = true;

      if (!isSolvedNev()) {
        matrixNev = initMatrixNull(-1);
        matrixCont = initMatrixZeros(0);

        initMas();
        solution();
        potentialMethod();
        drawTable();
      } else {
        let pF = document.createElement("p");
        pF.textContent += "Оптимальное решение найдено!";
        sltF.appendChild(pF);
      }
    }
  }
});

function initMatrixNull(x) {
  let matrix = [];
  for (let i = 0; i <= nval + x; i++) {
    let line = [];
    for (let j = 0; j <= mval + x; j++) {
      line.push(null);
    }
    matrix.push(line);
  }
  return matrix;
}
function initMatrixZeros(x) {
  let matrix = [];
  for (let i = 0; i <= nval + x; i++) {
    let line = [];
    for (let j = 0; j <= mval + x; j++) {
      line.push(0);
    }
    matrix.push(line);
  }
  return matrix;
}

function initMas() {
  masU = [];
  masV = [];
  //создаем массив U
  for (let i = 0; i < nval; i++) {
    if (i == 0) {
      masU.push(0);
    } else {
      masU.push(null);
    }
  }

  //Создаем массив V
  for (let j = 0; j < mval; j++) {
    masV.push(null);
  }
}

function isNulledMtrxC() {
  let nulledC = false;
  for (let i = 0; i <= nval; i++) {
    for (let j = 0; j <= mval; j++) {
      if (matrixC[i][j] != null) {
        nulledC = true;
      }
    }
  }
  return nulledC;
}

function getNums() {
  if (!isNulledMtrxC()) {
    let counter = 0;
    for (let i = 0; i <= nval; i++) {
      for (let j = 0; j <= mval; j++) {
        if (i == nval && j == mval) {
          break;
        }
        matrixC[i][j] = Number(document.getElementById(counter).value);
        counter++;
      }
    }
  } else {
    for (let i = 0; i <= nval; i++) {
      for (let j = 0; j <= mval; j++) {
        if (i == nval && j == mval) {
          break;
        }
      }
    }
  }

  let countA = 0;
  let countB = 0;

  for (let i = 0; i < nval; i++) {
    countA += matrixC[i][mval];
  }

  for (let j = 0; j < mval; j++) {
    countB += matrixC[nval][j];
  }

  matrixC[nval][mval] = Math.max(countA, countB);

  if (countA < countB) {
    let masSumA = [];
    for (let j = 0; j <= mval; j++) {
      if (j == mval - 1) {
        masSumA.push(countB - countA);
      } else {
        masSumA.push(0);
      }
    }
    matrixC.splice(nval - 1, 0, masSumA);
    nval++;
  } else if (countA > countB) {
    for (let i = 0; i <= nval; i++) {
      if (i == nval) {
        matrixC[i].splice(mval, 0, countA - countB);
      } else {
        matrixC[i].splice(mval, 0, 0);
      }
    }
    mval++;
  }
}

function drawTable() {
  //маленькая таблица
  tblDraw.innerHTML = "";
  for (let i = 0; i <= nval + 1; i++) {
    let line = document.createElement("div");
    line.setAttribute("class", "flex flex-row text-center items-center");
    for (let j = 0; j <= mval + 1; j++) {
      let square = document.createElement("div");
      square.setAttribute(
        "class",
        "relative border-2 rounded border-dashed border-zinc-700 size-16"
      );
      if (i == 0 && j == 0) {
        square.textContent = "";
      } else if (i == 0) {
        square.textContent = "B" + j;
        if (j == mval + 1) {
          square.textContent = "П";
        }
      } else if (j == 0) {
        square.textContent = "A" + i;
        if (i == nval + 1) {
          square.textContent = "C";
        }
      } else {
        let pMatrixC = document.createElement("p");
        if (i <= nval && j <= mval) {
          pMatrixC.setAttribute(
            "class",
            "absolute top-0 right-0 text-cyan-500 m-1"
          );
        }
        if (matrixCont[i - 1][j - 1] == 1) {
          square.classList.add("bg-zinc-800");
        } else if (matrixCont[i - 1][j - 1] == -1) {
          square.classList.add("bg-zinc-800");
        }
        pMatrixC.textContent = matrixC[i - 1][j - 1];
        if (i <= nval && j <= mval) {
          let pMatrixPot = document.createElement("p");
          pMatrixPot.setAttribute(
            "class",
            "absolute inset-x-0 bottom-0 font-bold m-1 text-white"
          );
          pMatrixPot.textContent = matrixPot[i - 1][j - 1];
          let pMatrixNev = document.createElement("p");
          pMatrixNev.setAttribute(
            "class",
            "absolute top-0 left-0 m-1 text-violet-500"
          );
          pMatrixNev.textContent = matrixNev[i - 1][j - 1];

          square.appendChild(pMatrixPot);
          square.appendChild(pMatrixNev);
        }
        square.appendChild(pMatrixC);
      }
      line.appendChild(square);
    }
    tblDraw.appendChild(line);
  }
  if (flagTableVariant) {
    // большая таблица
    let line = document.createElement("div");
    line.setAttribute("class", "flex flex-row text-center items-center");
    for (let j = 0; j <= mval + 1; j++) {
      let square = document.createElement("div");
      if (j == 0) {
        square.textContent = "V(j)";
      } else {
        square.textContent = masV[j - 1];
      }
      square.setAttribute(
        "class",
        "relative border-2 rounded border-dashed border-zinc-700 text-emerald-500 size-16"
      );
      line.appendChild(square);
    }
    tblDraw.appendChild(line);

    Array.from(tblDraw.children).forEach((line, index) => {
      let square = document.createElement("div");
      if (index == 0) {
        square.textContent = "U(i)";
      } else {
        square.textContent = masU[index - 1];
      }
      square.setAttribute(
        "class",
        "relative border-2 rounded border-dashed border-zinc-700 text-emerald-500 size-16"
      );
      line.appendChild(square);
    });
  }
}

///Метод мин эл

function leastCostMethod() {
  let minti;
  let mintj;
  if (isFulled()) {
    let min = minElem();
    minti = min[0];
    mintj = min[1];

    let A = matrixC[minti][mval];
    let B = matrixC[nval][mintj];

    let sumB = sumElem("row", mintj);
    let sumA = sumElem("col", minti);

    if (A - sumA == A && B - sumB == B) {
      if (B <= A) {
        matrixPot[minti][mintj] = B;
        for (let i = 0; i < nval; i++) {
          matrixCross[i][mintj] = null;
        }
      } else {
        matrixPot[minti][mintj] = A;
        for (let j = 0; j < mval; j++) {
          matrixCross[minti][j] = null;
        }
      }
    } else {
      if (A - sumA <= B - sumB) {
        matrixPot[minti][mintj] = A - sumA;
        for (let j = 0; j < mval; j++) {
          matrixCross[minti][j] = null;
        }
      } else {
        matrixPot[minti][mintj] = B - sumB;
        for (let i = 0; i < nval; i++) {
          matrixCross[i][mintj] = null;
        }
      }
    }
    return true;
  } else {
    return false;
  }
}

function isFulled() {
  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixCross[i][j] != null) {
        return true;
      }
    }
  }
  return false;
}

function minElem() {
  let mint = matrixC[nval][mval];

  let x = [null, null];
  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixC[i][j] < mint && matrixCross[i][j] != null) {
        x[0] = i;
        x[1] = j;
        mint = matrixC[i][j];
      }
    }
  }

  matrixCross[x[0]][x[1]] = null;
  matrixOnes[x[0]][x[1]] = 1;
  return x;
}

function sumElem(s, mintIndex) {
  let sum = 0;
  if (s == "row") {
    for (let i = 0; i < nval; i++) {
      sum += matrixPot[i][mintIndex];
    }
  } else if (s == "col") {
    for (let j = 0; j < mval; j++) {
      sum += matrixPot[mintIndex][j];
    }
  }
  return sum;
}

//Вывод решения

function solution() {
  let f = 0;
  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      f += matrixC[i][j] * matrixPot[i][j];
    }
  }
  let pF = document.createElement("p");

  pF.textContent += "Решение: " + f;
  sltF.appendChild(pF);
  sltF.setAttribute(
    "class",
    "bg-zinc-800 text-emerald-500 border-2 rounded border-dashed border-zinc-700 px-5 py-2 m-5 font-semibold"
  );
}

function isSolvedNev() {
  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixNev[i][j] > 0 || matrixNev[i][j] == null) {
        return false;
      }
    }
  }
  return true;
}

//Метод потанцевалов
function potentialMethod() {
  countUV(0, "V(j)"); //вычисление невязок
  crossingOut1(); //процедура вычеркивания
  contour1(); //рисуем контур
  movingIntoContour();
  // solution();
}

function countUV(index, s) {
  if (!provUV()) {
    if (s == "V(j)") {
      for (let j = 0; j < mval; j++) {
        if (matrixPot[index][j] != null && masV[j] == null) {
          masV[j] = matrixC[index][j] - masU[index];
          countUV(j, "U(i)");
        }
      }
    } else if (s == "U(i)") {
      for (let i = 0; i < nval; i++) {
        if (matrixPot[i][index] != null && masU[i] == null) {
          masU[i] = matrixC[i][index] - masV[index];
          countUV(i, "V(j)");
        }
      }
    }
  } else {
    let maxUV = 0;
    let maxU = 0;
    let maxV = 0;

    for (let i = 0; i < nval; i++) {
      for (let j = 0; j < mval; j++) {
        matrixNev[i][j] = masU[i] + masV[j] - matrixC[i][j];

        if (matrixNev[i][j] > maxUV) {
          maxUV = matrixNev[i][j];
          maxU = i;
          maxV = j;
        }
      }
    }

    if (maxUV != 0) {
      matrixOnes[maxU][maxV] = 1;
      matrixCont[maxU][maxV] = 1;
    }
  }
}

function provUV() {
  for (let i = 0; i < nval; i++) {
    if (masU[i] == null) {
      return false;
    }
  }

  for (let j = 0; j < mval; j++) {
    if (masV[j] == null) {
      return false;
    }
  }
  return true;
}

function crossingOut1() {
  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixOnes[i][j] == 1) {
        crossingOut2(i, j);
      }
    }
  }
}

function crossingOut2(I, J) {
  let sumI = 0,
    sumJ = 0;
  for (let i = 0; i < nval; i++) {
    sumI += matrixOnes[i][J];
  }
  for (let j = 0; j < mval; j++) {
    sumJ += matrixOnes[I][j];
  }

  if (sumI == 1 || sumJ == 1) {
    matrixOnes[I][J] = 0;
    crossingOut1();
  }
}

function contour1() {
  let sumEnd = 0;
  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixOnes[i][j] == 1) {
        sumEnd += 1;
      }
    }
  }

  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixCont[i][j] == 1) {
        contour2(i, j, "-", sumEnd, 0);
      }
    }
  }
}

function contour2(I, J, next, sumEnd, end) {
  if (sumEnd != end) {
    matrixOnes[I][J] = 0;
    if (next == "-") {
      for (let i = 0; i < nval; i++) {
        if (matrixOnes[i][J] == 1) {
          matrixCont[i][J] = -1;
          contour2(i, J, "+", sumEnd, end + 1);
        }
      }
      for (let j = 0; j < mval; j++) {
        if (matrixOnes[I][j] == 1) {
          matrixCont[I][j] = -1;
          contour2(I, j, "+", sumEnd, end + 1);
        }
      }
    } else if (next == "+") {
      for (let i = 0; i < nval; i++) {
        if (matrixOnes[i][J] == 1) {
          matrixCont[i][J] = 1;
          contour2(i, J, "-", sumEnd, end + 1);
        }
      }
      for (let j = 0; j < mval; j++) {
        if (matrixOnes[I][j] == 1) {
          matrixCont[I][j] = 1;
          contour2(I, j, "-", sumEnd, end + 1);
        }
      }
    }
  }
}

function movingIntoContour() {
  let minCount = matrixC[nval][mval];

  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixCont[i][j] == -1) {
        if (matrixPot[i][j] < minCount) {
          minCount = matrixPot[i][j];
        }
      }
    }
  }

  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixCont[i][j] == -1) {
        if (matrixPot[i][j] - minCount == 0) {
          matrixPot[i][j] = null;
        } else {
          matrixPot[i][j] = matrixPot[i][j] - minCount;
        }
      } else if (matrixCont[i][j] == 1) {
        matrixPot[i][j] = matrixPot[i][j] + minCount;
      }
    }
  }

  let countBase = 0;
  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixPot[i][j] != null) {
        countBase += 1;
      }
    }
  }

  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixPot[i][j] == 0 && nval + mval - 1 < countBase) {
        matrixPot[i][j] = null;
        countBase -= 1;
      }
    }
  }

  for (let i = 0; i < nval; i++) {
    for (let j = 0; j < mval; j++) {
      if (matrixPot[i][j] != null) {
        matrixOnes[i][j] = 1;
      }
    }
  }
}
