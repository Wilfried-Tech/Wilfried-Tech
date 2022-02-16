/**********************************
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * *******************************/

function Matrix(M, n) {
  this.isSquare = false;
  var MATRIX;
  if (typeof M == 'number' && typeof n == 'number') {
    var T = [];
    for (var row = 0; row < M; row++) {
      T[row] = []
      for (var col = 0; col < n; col++) {
        T[row][col] = 0;
      }
    }
    return new Matrix(T);
  }
  if (typeof M == 'number') {
    return new Matrix([[M]]);
  }
  if (typeof M == 'object') {
    for (var col = 0; col < M.length; col++) {
      if (M[0].length != M[col].length) {
        console.error("not equal column");
        return null;
      }
    }
    this.DIM = { row: M.length, col: M[0].length };
    MATRIX = M;
  }
  if (this.DIM['row'] == this.DIM['col']) {
    this.isSquare = true;
  }
  this.getMatrix = function() {
    return MATRIX;
  }
}

Matrix.prototype.toString = function() {
  var A = '',
    M = this.getMatrix();
  for (var row = 0; row < this.DIM['row']; row++) {
    switch (row) {
      case 0:
        A += `${M[row]/*.map(x =>x.toFixed(2))*/.join('\b\b\b')}\n`;
        break;
      case this.Dim - 1:
        A += `${M[row]/*.map(x =>x.toFixed(2))*/.join('\b\b\b')}`;
        break;
      default:
        A += `${M[row]/*.map(x =>x.toFixed(2))*/.join('\b\b\b')}\n`;
        break;
    }

  }
  return A;
}

Matrix.prototype.add = function(B) {
  if (!B instanceof Matrix || (B.DIM['row'] != this.DIM['row'] || B.DIM['col'] != this.DIM['col'])) {
    console.error("couldn't add Matrix with different Dimension");
    return;
  }
  var T = [],
    A = this.getMatrix(),
    B = B.getMatrix();
  for (var row = 0; row < this.DIM['row']; row++) {
    T[row] = [];
    for (var col = 0; col < this.DIM['col']; col++) {
      T[row][col] = A[row][col] + B[row][col];
    }
  }
  return new Matrix(T);
}

Matrix.prototype.reduce = function(B) {
  if (!B instanceof Matrix || (B.DIM['row'] != this.DIM['row'] || B.DIM['col'] != this.DIM['col'])) {
    console.error("couldn't reduce Matrix with different Dimension");
    return;
  }
  var T = [],
    A = this.getMatrix(),
    B = B.getMatrix();
  for (var row = 0; row < this.DIM['row']; row++) {
    T[row] = [];
    for (var col = 0; col < this.DIM['col']; col++) {
      T[row][col] = A[row][col] - B[row][col];
    }
  }
  return new Matrix(T);
}

Matrix.prototype.vectorMultiply = function(vector) {
  var T = [],
    A = this.getMatrix();
  for (var row = 0; row < this.DIM['row']; row++) {
    T[row] = [];
    for (var col = 0; col < this.DIM['col']; col++) {
      T[row][col] = A[row][col] * vector;
    }
  }
  return new Matrix(T);
}

Matrix.prototype.vectorDivide = function(vector) {
  var T = [],
    A = this.getMatrix();
  for (var row = 0; row < this.DIM['row']; row++) {
    T[row] = [];
    for (var col = 0; col < this.DIM['col']; col++) {
      T[row][col] = A[row][col] / vector;
    }
  }
  return new Matrix(T);
}

Matrix.prototype.divideBy = function(B) {
  if (!B instanceof Matrix || (B.DIM['row'] != this.DIM['row'] || B.DIM['col'] != this.DIM['col'])) {
    console.error("couldn't divide Matrix with different Dimension");
    return;
  }
  A = this.getMatrix(),
  B = B.getMatrix();
  T = []
  for (var row = 0; row < this.DIM['row']; row++) {
    T[row] = [];
    for (var col = 0; col < this.DIM['col']; col++) {
      T[row][col] = A[row][col] / B[row][col];
    }
  }
  return new Matrix(T);
}

Matrix.prototype.transpose = function() {
  var A = this.getMatrix(),
    T = new Matrix(this.DIM['col'], this.DIM['row']).getMatrix();
  for (var row = 0; row < this.DIM['row']; row++) {
    for (var col = 0; col < this.DIM['col']; col++) {
      T[col][row] = A[row][col]
    }
  }
  return new Matrix(T);
}

Matrix.prototype.multiplyBy = function(B) {
  if (!B instanceof Matrix || (this.DIM['col'] != B.DIM['row'])) {
    console.error("you couldn't multiply " + this.DIM['row'] + "×" + this.DIM['col'] + " by " + B.DIM['row'] + "×" + B.DIM['col'] + " matrix");
    return null;
  }
  var T = new Matrix(this.DIM['row'], B.DIM['col']).getMatrix(),
    A = this.getMatrix(),
    C = B.getMatrix();
  for (var row = 0; row < this.DIM['row']; row++) {
    for (var col = 0; col < B.DIM['col']; col++) {
      var k = 0;
      while (k < B.DIM['row']) {
        T[row][col] += A[row][k] * C[k][col];
        k++;
      }
    }
  }
  return new Matrix(T);
}

Matrix.prototype.det = function() {
  if (!this.isSquare) return null;
  var A = this.getMatrix();
  var det = 0,
    row = 0;
  if (this.DIM['row'] == 1) {
    return A[0][0];
  } else {
    for (var col = 0; col < this.DIM['col']; col++) {
      det += A[row][col] * Math.pow(-1, row + col) * this.cofactor(row, col).det();
    }
    return det;
  }
}

Matrix.prototype.cofactor = function(srow, scol) {
  if (!this.isSquare) { return null; }
  var A = this.getMatrix(),
    C = []; //the cofactor
  if (this.DIM['row'] == 1) {
    return new Matrix([[A[0][0]]]);
  } else {
    for (var row = 0; row < this.DIM['row']; row++) {
      if (row == srow) { continue; }
      var tempRow = [];
      for (var col = 0; col < this.DIM['col']; col++) {
        if (col == scol) { continue; }
        else {
          tempRow.push(A[row][col]);
        }
      }
      C.push(tempRow);
    }
  }
  return new Matrix(C);
}

Matrix.prototype.adjoint = function() {
  if (!this.isSquare) { return null; }
  var A = this.getMatrix(),
    Aj = [];
  if (this.DIM['row'] == 1) {
    return new Matrix([[1]]);
  }
  for (var row = 0; row < this.DIM['row']; row++) {
    var tempRow = [];
    for (var col = 0; col < this.DIM["col"]; col++) {
      tempRow.push(this.cofactor(row, col).det() * Math.pow(-1, row + col));
    }
    Aj.push(tempRow);
  }
  return new Matrix(Aj).transpose();
}

Matrix.prototype.invert = function() {
  if (!this.isSquare) { return null; }
  return this.adjoint().vectorDivide(this.det());
}

Matrix.prototype.pow = function(pow) {
  var T = new Matrix(this.getMatrix())
  for (var i = 0; i < pow - 1; i++) {
    T = T.multiplyBy(this);
  }
  return T
}

Matrix.prototype.show = function() {
  var A = this.getMatrix(),
    Popup = document.createElement('div'),
    btn = document.createElement('button'),
    style = document.createElement('style');
  document.body.appendChild(Popup);
  var template = "<table border='0'>";
  for (var row = 0; row < this.DIM['row']; row++) {
    template += "<tr>";
    for (var col = 0; col < this.DIM['col']; col++) {
      template += `<td>${A[row][col]}</td>`;
    }
    template += "</tr>";
  }
  template += `<caption>${this.DIM['row']} × ${this.DIM['col']} Matrix</caption></table>`;
  Popup.innerHTML += template;
  btn.innerText = 'close'
  btn.onclick = function() {
    btn.parentElement.remove();
  }
  Popup.className = "matrix-show";
  Popup.append(btn, style);
  style.innerHTML = `
  .matrix-show,.matrix-show *{margin:0;padding:0;box-sizing:border-box;outline:0;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:"Times New Roman",Times,Baskerville,Georgia,serif}.matrix-show{background:#fff;position:absolute;top:45%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);border-radius:20px;box-shadow:2px 2px 4px rgba(0,0,0,.2),-1px -1px 4px #c8c8c8;width:275px;padding:5px;max-height:300px;overflow:scroll;display:none}.matrix-show button{padding:5px;font-weight:700;border-radius:10px;width:75%;margin:7px auto;text-transform:capitalize;letter-spacing:4px;background-color:beige;border:1px groove beige}.matrix-show table{width:100%;margin:5px auto}.matrix-show table td{padding:3px}
  `;

  setTimeout(() => {
    Popup.style = 'display:block;';
  }, 1000)
}


/******************************
 * 
 * MATRIX Static method
 * 
 * ****************************/


Matrix.createIdentity = function(DIM) {
  var I = [];

  for (var row = 0; row < DIM; row++) {
    I[row] = [];
    for (var col = 0; col < DIM; col++) {
      I[row][col] = 0;
      if (row == col) { I[row][col] = 1; }
    }
  }
  return new Matrix(I);
}

Matrix.createTriangularUp = function(DIM) {
  var T = [];
  for (var row = 0; row < DIM; row++) {
    T[row] = [];
    for (var col = 0; col < DIM; col++) {
      T[row][col] = 1;
      if (row > col) { T[row][col] = 0; }
    }
  }
  return new Matrix(T);
}

Matrix.createTriangularDown = function(DIM) {
  var T = [];
  for (var row = 0; row < DIM; row++) {
    T[row] = [];
    for (var col = 0; col < DIM; col++) {
      T[row][col] = 1;
      if (row < col) { T[row][col] = 0; }
    }
  }
  return new Matrix(T);
}
