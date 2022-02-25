function log(arg) {
  console.log(JSON.stringify(arg));
}

function $(elt) {
  return document.querySelector(elt);
}

function addInputs(count) {
  equation.innerHTML = "";
  for (var i = 0; i < count; i++) {
    equation.insertAdjacentHTML('beforeend', `<input type="text" class="equation-${i+1} ${(i%2==0)? "even":"odd"}" />`);
  }
}

function Message() {
  this.message = "";
  this.index = 1;
}

Message.prototype.push = function(msg) {
  this.message += (this.index + " ) " + msg + "\n\n");
  this.index++;
  return this;
}

Message.prototype.show = function(type) {
  if (this.message != "") swal("Rapport Wilfried-Tech", this.message, { icon: type });
  return this;
}

Message.prototype.clear = function() {
  this.message = "";
  this.index = 1;
  return this
}



function createEquationObject(equation) {

  var digit = variable = '',
    gotEqual = false,
    number = 1,
    equationObject = {};

  function createObject(variable, val, gotEqual) {
    if (gotEqual) {
      val *= -1;
    }
    if (equationObject[variable]) {
      equationObject[variable] += val;
    } else {
      equationObject[variable] = val;
    }
  }
  equation.toLowerCase().replace(/ /g, '').split('').forEach((char, index) => {

    if (/^[0-9\.\/]$/.test(char)) {
      digit += char;
    }
    if (/^[a-zA-Z]$/.test(char)) {
      variable += char;
    }
    if (/^[=\+\-]$/.test(char) || index == equation.length - 1) {
      if (variable) {
        if (digit) {
          number *= parseFloat(eval(digit));
          createObject(variable, number, gotEqual);
          digit = variable = '';
          number = 1;
        } else {
          createObject(variable, number, gotEqual);
          digit = variable = '';
          number = 1;
        }
      } else if (digit) {
        number *= parseFloat(eval(digit));
        createObject('const', number, gotEqual);
        number = 1;
        digit = variable = '';
      }
    }
    if (char == '-') {
      number *= -1;
    }
    if (char == '=') {
      gotEqual = true;
    }
  });
  if (!equationObject.hasOwnProperty('const')) {
    equationObject['const'] = 0;
  }
  equationObject.const *= -1;
  return equationObject;
}

function checkoutEquationObject(equationObjectArr) {
  var equationsVarCount = [];
  var check = true;
  var pivotEquation = null;

  // selection une Equation avec un nombre supérieur d'inconnu

  equationObjectArr.forEach((equationObject, i) => {
    equationsVarCount.push(Object.getOwnPropertyNames(equationObject).length - 1);

    if (equationsVarCount[i] > varCount) {
      Popup.push(`les inconnus de l'equation № ${i+1} est supérieur a celle précisé `);
    }

    if (equationsVarCount[i] == 0) {
      Popup.push(`l'equation № ${i+1} n'a pas d'inconnu`);
    }

  })

  if (Popup.message != "") return !check;

  pivotEquation = equationObjectArr[equationsVarCount.indexOf(varCount)];

  /*
    complete les inconu manquant par un zero
  */

  if (pivotEquation != null) {
    Object.getOwnPropertyNames(pivotEquation).forEach(variable => {
      if (variable != "const") {
        equationObjectArr.forEach(equationObject => {
          if (!equationObject[variable]) {
            equationObject[variable] = 0;
          }
        })

      }
    })
  } else {
    Popup.push("les inconus de vos equations sont tous inférieur a celle que vous avez précisé");
  }

  if (Popup.message != "") return !check;

  var variables = Object.getOwnPropertyNames(pivotEquation).sort();

  equationObjectArr.forEach(equationObject => {
    if (!(Object.getOwnPropertyNames(equationObject).sort().join("") == variables.join(""))) {
      Popup.push(`le nom des inconnus des equation ne change pas d'une equation a l'autre `);
      check = false;
    }
  })
  return check;
}


function checkoutEquation(MatrixArr) {
  var MatrixA = MatrixArr[0].getMatrix();
  var MatrixC = MatrixArr[2].getMatrix();
  var infinite = false,
    vide = true;

  for (var row = 0; row < MatrixA.length; row++) {
    MatrixA[row].push(MatrixC[row][0])
    MatrixA[row] = Array_GCD(MatrixA[row]);
  }
  for (var row = 0; row < MatrixA.length - 1; row++) {
    infinite = false;
    vide = false;
    for (var col = 0; col < MatrixA[0].length; col++) {
      if (MatrixA[row][col] == MatrixA[row + 1][col] || (!MatrixA[row][col] && !MatrixA[row + 1][col])) {
        infinite = true;
      } else {
        vide = true;
      }
    }

    solution.innerHTML = "";
    if (infinite) {
      solution.insertAdjacentHTML('beforeend', "<p>s = { ∞ }</p>");

      swal("Il exite une infinité de solution a ce systeme\nveillez entrez un autre pour avoir une unique solution", { icon: "error" });
    } else if (vide) {
      swal("Il n'exite pas de solution a ce systeme\nveillez entrez un autre pour avoir une unique solution", { icon: "error" });
      solution.insertAdjacentHTML('beforeend', "<p>s = { ∅ }</p>");
    }
  }
  if (vide) {
    swal("Il n'exite pas de solution a ce systeme\nveillez entrez un autre pour avoir une unique solution", { icon: "error" });
    solution.insertAdjacentHTML('beforeend', "<p>s = { ∅ }</p>");
  }
}

function Array_GCD(arr) {
  var ten = 1;
  arr.forEach(elt => {
    var temp = `${elt}`.match(/\.(.*)/);
    if (temp) ten = Math.pow(10, temp[1].length);
  })
  arr = arr.map(x => { return x * ten });
  var result = arr[0];
  for (var i = 1; i < arr.length; i++) {
    result = GCD(result, arr[i])
  }
  arr = arr.map(x => { return x / (result * ten) })
  return arr;
}

function createMatrixFromObject(equationObjectArr) {

  var MatrixX = [],
    MatrixA = [],
    MatrixC = [];

  Object.getOwnPropertyNames(equationObjectArr[0]).forEach((variable) => {
    if (variable != 'const') MatrixX.push([variable]);
  });

  equationObjectArr.forEach((equationObject, index) => {

    MatrixC.push([equationObject['const']]);

    var tempRow = [];

    for (var [prop] of MatrixX) {
      tempRow.push(equationObject[prop]);
    }

    MatrixA.push(tempRow);
  });

  MatrixA = new Matrix(MatrixA);
  MatrixC = new Matrix(MatrixC);

  return [MatrixA, MatrixX, MatrixC];
}

function GCD(a, b) {

  return b ? (a > b ? GCD(b, a % b) : GCD(a, b % a)) : a;
}

function Fraction(float) {
  var positif = true;
  if (float < 0) {
    positif = false;
    float *= -1;
  }
  let reciproque = (float % 1 == 0) ? 1 : 1 / (float % 1);
  let denominateur = reciproque;
  const limite = 10;
  for (let i = 0; i < limite && Number.isInteger(Math.round(reciproque * 10 ** (limite - i)) / 10 ** (limite - i)) != true; i++)
  {
    reciproque = 1 / (reciproque % 1);
    denominateur *= reciproque;
  }

  return ((positif) ? Math.round(float * denominateur) : Math.round(float * denominateur) * -1) + ((Math.round(denominateur) == 1) ? "" : "/" + Math.round(denominateur));
}