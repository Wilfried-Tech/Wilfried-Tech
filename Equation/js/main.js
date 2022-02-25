const solution = $('.solution-content');
const varCountInput = $('#var-count');
const equation = $('.equation-content');
const exemple = $(".btn-exemple");
const resoudre = $('.solve button');
const Popup = new Message();

var varCount = Number(varCountInput.value);

addInputs(varCount);

varCountInput.oninput = function(e) {
  varCount = Number(varCountInput.value);
  addInputs(varCount);
}

varCountInput.onblur = function(e) {
  resoudre.disabled = (Number(varCountInput.value) == 0) ? true : false;
}

exemple.onclick = function() {
  swal("pas d'exemple pour le moment", { icon: "info" })
}

resoudre.onclick = function(e) {

  var equationArr = [];
  var equationObjectArr = [];
  var caractereInvalid = false;
  var equationPropre = true;
  var empty = false;
  var noError = false;

  solution.innerHTML = "";
  Popup.clear();

  for (var i = 0; i < varCount; i++) {
    equationArr.push($(`.equation-content .equation-${i+1}`).value.toLowerCase());
  }

  equationArr.forEach((equation, i) => {
    equation = equation.replace(/ /g, "");
    if (equation == "") {

      empty = true;
      Popup.push(`Veillez remplir proprement le champs № ${i+1} avec une equation`);

    } else if (/[^a-z0-9+./=-]+/.test(equation)) {

      caractereInvalid = true;
      Popup.push(`tout autre caractères différents de lettre, chiffre,point sont non autorisée!\nReverifiez l'équation № ${i+1}\nNB:\nremplacer les virgules par un point Cad 0,5 => 0.5\nles fraction sont aussi accepté donc vous pourrez écrire 7/2z + 2y = 7 à la place de 3.5z + 2y = 7`);

    } else if (/^([a-z0-9+./-])+(=)([a-z0-9+./-])+$/.test(equation)) {

      equationObjectArr.push(createEquationObject(equation));

    } else {
      equationPropre = false;
      Popup.push(`l'equation № ${i+1} de ce systeme est mal écrite`);

    }
  })

  if (!empty && !caractereInvalid && equationPropre) {

    if (checkoutEquationObject(equationObjectArr)) {
      noError = true;
    }
  }

  if (noError) {

    var MatrixArr = createMatrixFromObject(equationObjectArr);
    var det = MatrixArr[0].det();

    if (det == 0) {
      checkoutEquation(MatrixArr);
    } else {
      MatrixArr[0] = MatrixArr[0].invert();
      var result = MatrixArr[0].multiplyBy(MatrixArr[2]);
      result.getMatrix().forEach((res, i) => {
        solution.insertAdjacentHTML('beforeend', `<p> ${MatrixArr[1][i][0]} = ${Fraction(res)}`);
      })
    }

  } else {
    Popup.show('warning');
  }
}