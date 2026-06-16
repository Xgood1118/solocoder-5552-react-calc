import BigNumber from 'bignumber.js'

export type Matrix = BigNumber[][]

export type MatrixOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'transpose'
  | 'inverse'
  | 'determinant'
  | 'eigenvalues'
  | 'lu'
  | 'qr'
