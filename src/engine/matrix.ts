import BigNumber from 'bignumber.js';

const BN0 = new BigNumber(0);
const BN1 = new BigNumber(1);

export type Matrix = BigNumber[][];

export function createMatrix(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => new BigNumber(0))
  );
}

export function cloneMatrix(m: Matrix): Matrix {
  return m.map(row => row.map(v => new BigNumber(v)));
}

export function isSquareMatrix(m: Matrix): boolean {
  return m.length > 0 && m.length === m[0].length;
}

export function isSymmetricMatrix(m: Matrix): boolean {
  if (!isSquareMatrix(m)) return false;
  const n = m.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (!m[i][j].isEqualTo(m[j][i])) return false;
    }
  }
  return true;
}

export function matrixAdd(a: Matrix, b: Matrix): Matrix {
  const rows = a.length;
  const cols = a[0].length;
  const result = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = a[i][j].plus(b[i][j]);
    }
  }
  return result;
}

export function matrixSubtract(a: Matrix, b: Matrix): Matrix {
  const rows = a.length;
  const cols = a[0].length;
  const result = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = a[i][j].minus(b[i][j]);
    }
  }
  return result;
}

export function matrixMultiply(a: Matrix, b: Matrix): Matrix {
  const rowsA = a.length;
  const colsB = b[0].length;
  const colsA = a[0].length;
  const result = createMatrix(rowsA, colsB);
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = BN0;
      for (let k = 0; k < colsA; k++) {
        sum = sum.plus(a[i][k].times(b[k][j]));
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function matrixTranspose(a: Matrix): Matrix {
  const rows = a.length;
  const cols = a[0].length;
  const result = createMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = a[i][j];
    }
  }
  return result;
}

export function matrixInverse(a: Matrix): Matrix {
  if (!isSquareMatrix(a)) throw new Error('Matrix must be square for inversion');
  const n = a.length;
  const aug = createMatrix(n, 2 * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      aug[i][j] = new BigNumber(a[i][j]);
    }
    aug[i][n + i] = BN1;
  }

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (aug[row][col].abs().isGreaterThan(aug[maxRow][col].abs())) {
        maxRow = row;
      }
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    if (aug[col][col].isZero()) {
      throw new Error('Matrix is not invertible');
    }

    const pivot = aug[col][col];
    for (let j = 0; j < 2 * n; j++) {
      aug[col][j] = aug[col][j].div(pivot);
    }

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = 0; j < 2 * n; j++) {
        aug[row][j] = aug[row][j].minus(factor.times(aug[col][j]));
      }
    }
  }

  const result = createMatrix(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i][j] = aug[i][n + j];
    }
  }
  return result;
}

export function matrixDeterminant(a: Matrix): BigNumber {
  if (!isSquareMatrix(a)) throw new Error('Matrix must be square for determinant');
  const n = a.length;
  if (n === 1) return new BigNumber(a[0][0]);
  if (n === 2) return a[0][0].times(a[1][1]).minus(a[0][1].times(a[1][0]));

  const lu = matrixLU(a);
  let det = BN1;
  for (let i = 0; i < n; i++) {
    det = det.times(lu.U[i][i]);
  }
  return det;
}

export function matrixLU(a: Matrix): { L: Matrix; U: Matrix } {
  if (!isSquareMatrix(a)) throw new Error('Matrix must be square for LU decomposition');
  const n = a.length;
  const L = createMatrix(n, n);
  const U = createMatrix(n, n);

  for (let i = 0; i < n; i++) {
    L[i][i] = BN1;

    for (let j = i; j < n; j++) {
      let sum = BN0;
      for (let k = 0; k < i; k++) {
        sum = sum.plus(L[i][k].times(U[k][j]));
      }
      U[i][j] = new BigNumber(a[i][j]).minus(sum);
    }

    for (let j = i + 1; j < n; j++) {
      let sum = BN0;
      for (let k = 0; k < i; k++) {
        sum = sum.plus(L[j][k].times(U[k][i]));
      }
      if (U[i][i].isZero()) {
        L[j][i] = BN0;
      } else {
        L[j][i] = new BigNumber(a[j][i]).minus(sum).div(U[i][i]);
      }
    }
  }

  return { L, U };
}

export function matrixQR(a: Matrix): { Q: Matrix; R: Matrix } {
  const rows = a.length;
  const cols = a[0].length;
  const Q = createMatrix(rows, cols);
  const R = createMatrix(cols, cols);

  const v: Matrix = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => BN0)
  );

  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < rows; i++) {
      v[j][i] = new BigNumber(a[i][j]);
    }

    for (let k = 0; k < j; k++) {
      let dot = BN0;
      for (let i = 0; i < rows; i++) {
        dot = dot.plus(v[k][i].times(a[i][j]));
      }
      R[k][j] = dot;

      for (let i = 0; i < rows; i++) {
        v[j][i] = v[j][i].minus(dot.times(v[k][i]));
      }
    }

    let norm = BN0;
    for (let i = 0; i < rows; i++) {
      norm = norm.plus(v[j][i].times(v[j][i]));
    }
    norm = norm.sqrt();

    R[j][j] = norm;

    if (norm.isZero()) {
      for (let i = 0; i < rows; i++) {
        Q[i][j] = BN0;
      }
    } else {
      for (let i = 0; i < rows; i++) {
        Q[i][j] = v[j][i].div(norm);
      }
    }
  }

  return { Q, R };
}

export function matrixEigenvalues(a: Matrix): BigNumber[] {
  if (!isSquareMatrix(a)) throw new Error('Matrix must be square for eigenvalue computation');
  const n = a.length;
  if (n === 1) return [new BigNumber(a[0][0])];
  if (n === 2) {
    const tr = a[0][0].plus(a[1][1]);
    const det = a[0][0].times(a[1][1]).minus(a[0][1].times(a[1][0]));
    const disc = tr.times(tr).minus(det.times(4));
    if (disc.isNegative()) {
      const realPart = tr.div(2);
      return [realPart, realPart];
    }
    const sqrtDisc = disc.sqrt();
    return [tr.plus(sqrtDisc).div(2), tr.minus(sqrtDisc).div(2)];
  }

  if (isSymmetricMatrix(a)) {
    return jacobiEigenvalues(a);
  }

  return qrEigenvalues(a);
}

function jacobiEigenvalues(a: Matrix): BigNumber[] {
  const n = a.length;
  const m = cloneMatrix(a);
  const maxIter = 100;
  const tol = new BigNumber('1e-14');

  for (let iter = 0; iter < maxIter; iter++) {
    let maxVal = BN0;
    let p = 0;
    let q = 1;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (m[i][j].abs().isGreaterThan(maxVal)) {
          maxVal = m[i][j].abs();
          p = i;
          q = j;
        }
      }
    }

    if (maxVal.isLessThan(tol)) break;

    const app = m[p][p];
    const aqq = m[q][q];
    const apq = m[p][q];

    let thetaNum: number;
    if (app.isEqualTo(aqq)) {
      thetaNum = Math.PI / 4;
      if (apq.isNegative()) thetaNum = -thetaNum;
    } else {
      thetaNum = Math.atan2(apq.times(2).toNumber(), app.minus(aqq).toNumber()) / 2;
    }

    const cosVal = Math.cos(thetaNum);
    const sinVal = Math.sin(thetaNum);
    const cos = new BigNumber(cosVal);
    const sin = new BigNumber(sinVal);

    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const mip = m[i][p];
        const miq = m[i][q];
        m[i][p] = cos.times(mip).plus(sin.times(miq));
        m[p][i] = m[i][p];
        m[i][q] = cos.times(miq).minus(sin.times(mip));
        m[q][i] = m[i][q];
      }
    }

    m[p][p] = cos.times(cos).times(app).plus(sin.times(sin).times(aqq)).plus(sin.times(2).times(cos).times(apq));
    m[q][q] = sin.times(sin).times(app).plus(cos.times(cos).times(aqq)).minus(sin.times(2).times(cos).times(apq));
    m[p][q] = BN0;
    m[q][p] = BN0;
  }

  const eigenvalues: BigNumber[] = [];
  for (let i = 0; i < n; i++) {
    eigenvalues.push(m[i][i]);
  }
  return eigenvalues;
}

function qrEigenvalues(a: Matrix): BigNumber[] {
  const n = a.length;
  let m = cloneMatrix(a);
  const maxIter = 200;
  const tol = new BigNumber('1e-10');

  for (let iter = 0; iter < maxIter; iter++) {
    const { Q, R } = matrixQR(m);
    m = matrixMultiply(R, Q);

    let offDiag = BN0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          offDiag = offDiag.plus(m[i][j].times(m[i][j]));
        }
      }
    }

    if (offDiag.sqrt().isLessThan(tol)) break;
  }

  const eigenvalues: BigNumber[] = [];
  let i = 0;
  while (i < n) {
    if (i === n - 1 || (i < n - 1 && m[i + 1][i].abs().isLessThan(tol))) {
      eigenvalues.push(m[i][i]);
      i++;
    } else {
      const a11 = m[i][i];
      const a12 = m[i][i + 1];
      const a21 = m[i + 1][i];
      const a22 = m[i + 1][i + 1];
      const tr = a11.plus(a22);
      const det = a11.times(a22).minus(a12.times(a21));
      const disc = tr.times(tr).minus(det.times(4));
      if (disc.isNegative()) {
        eigenvalues.push(tr.div(2));
      } else {
        const sqrtDisc = disc.sqrt();
        eigenvalues.push(tr.plus(sqrtDisc).div(2));
        eigenvalues.push(tr.minus(sqrtDisc).div(2));
      }
      i += 2;
    }
  }

  return eigenvalues;
}

export function formatMatrix(m: Matrix): string {
  const rows = m.map(row =>
    row.map(v => v.toFormat()).join('\t')
  );
  return rows.join('\n');
}
