import BigNumber from 'bignumber.js'

export interface UnitDef {
  name: string
  nameEn: string
  symbol: string
  toBase: (v: BigNumber) => BigNumber
  fromBase: (v: BigNumber) => BigNumber
}

export interface UnitCategory {
  key: string
  label: string
  units: UnitDef[]
}

const lengthUnits: UnitDef[] = [
  { name: '米', nameEn: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
  { name: '英尺', nameEn: 'Foot', symbol: 'ft', toBase: (v) => v.times(0.3048), fromBase: (v) => v.div(0.3048) },
  { name: '英寸', nameEn: 'Inch', symbol: 'in', toBase: (v) => v.times(0.0254), fromBase: (v) => v.div(0.0254) },
  { name: '千米', nameEn: 'Kilometer', symbol: 'km', toBase: (v) => v.times(1000), fromBase: (v) => v.div(1000) },
  { name: '英里', nameEn: 'Mile', symbol: 'mi', toBase: (v) => v.times(1609.344), fromBase: (v) => v.div(1609.344) },
]

const massUnits: UnitDef[] = [
  { name: '千克', nameEn: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
  { name: '磅', nameEn: 'Pound', symbol: 'lb', toBase: (v) => v.times(0.45359237), fromBase: (v) => v.div(0.45359237) },
  { name: '盎司', nameEn: 'Ounce', symbol: 'oz', toBase: (v) => v.times(0.028349523125), fromBase: (v) => v.div(0.028349523125) },
]

const timeUnits: UnitDef[] = [
  { name: '秒', nameEn: 'Second', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
  { name: '分钟', nameEn: 'Minute', symbol: 'min', toBase: (v) => v.times(60), fromBase: (v) => v.div(60) },
  { name: '小时', nameEn: 'Hour', symbol: 'h', toBase: (v) => v.times(3600), fromBase: (v) => v.div(3600) },
  { name: '天', nameEn: 'Day', symbol: 'd', toBase: (v) => v.times(86400), fromBase: (v) => v.div(86400) },
]

const temperatureUnits: UnitDef[] = [
  {
    name: '摄氏度',
    nameEn: 'Celsius',
    symbol: '°C',
    toBase: (v) => v.plus(273.15),
    fromBase: (v) => v.minus(273.15),
  },
  {
    name: '华氏度',
    nameEn: 'Fahrenheit',
    symbol: '°F',
    toBase: (v) => v.minus(32).times(5).div(9).plus(273.15),
    fromBase: (v) => v.minus(273.15).times(9).div(5).plus(32),
  },
  {
    name: '开尔文',
    nameEn: 'Kelvin',
    symbol: 'K',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
]

const areaUnits: UnitDef[] = [
  { name: '平方米', nameEn: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
  { name: '平方千米', nameEn: 'Square Kilometer', symbol: 'km²', toBase: (v) => v.times(1e6), fromBase: (v) => v.div(1e6) },
  { name: '平方英尺', nameEn: 'Square Foot', symbol: 'ft²', toBase: (v) => v.times(0.09290304), fromBase: (v) => v.div(0.09290304) },
  { name: '英亩', nameEn: 'Acre', symbol: 'acre', toBase: (v) => v.times(4046.8564224), fromBase: (v) => v.div(4046.8564224) },
  { name: '公顷', nameEn: 'Hectare', symbol: 'ha', toBase: (v) => v.times(10000), fromBase: (v) => v.div(10000) },
]

const volumeUnits: UnitDef[] = [
  { name: '立方米', nameEn: 'Cubic Meter', symbol: 'm³', toBase: (v) => v.times(1000), fromBase: (v) => v.div(1000) },
  { name: '升', nameEn: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
  { name: '加仑', nameEn: 'Gallon', symbol: 'gal', toBase: (v) => v.times(3.785411784), fromBase: (v) => v.div(3.785411784) },
  { name: '立方英尺', nameEn: 'Cubic Foot', symbol: 'ft³', toBase: (v) => v.times(28.316846592), fromBase: (v) => v.div(28.316846592) },
]

const speedUnits: UnitDef[] = [
  { name: '米每秒', nameEn: 'Meter per Second', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
  { name: '千米每小时', nameEn: 'Kilometer per Hour', symbol: 'km/h', toBase: (v) => v.div(3.6), fromBase: (v) => v.times(3.6) },
  { name: '英里每小时', nameEn: 'Mile per Hour', symbol: 'mph', toBase: (v) => v.times(0.44704), fromBase: (v) => v.div(0.44704) },
]

const dataUnits: UnitDef[] = [
  { name: '字节', nameEn: 'Byte', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
  { name: '千字节', nameEn: 'Kilobyte', symbol: 'KB', toBase: (v) => v.times(1000), fromBase: (v) => v.div(1000) },
  { name: '兆字节', nameEn: 'Megabyte', symbol: 'MB', toBase: (v) => v.times(1e6), fromBase: (v) => v.div(1e6) },
  { name: '吉字节', nameEn: 'Gigabyte', symbol: 'GB', toBase: (v) => v.times(1e9), fromBase: (v) => v.div(1e9) },
  { name: '太字节', nameEn: 'Terabyte', symbol: 'TB', toBase: (v) => v.times(1e12), fromBase: (v) => v.div(1e12) },
  { name: '千比字节', nameEn: 'Kibibyte', symbol: 'KiB', toBase: (v) => v.times(1024), fromBase: (v) => v.div(1024) },
  { name: '兆比字节', nameEn: 'Mebibyte', symbol: 'MiB', toBase: (v) => v.times(1048576), fromBase: (v) => v.div(1048576) },
  { name: '吉比字节', nameEn: 'Gibibyte', symbol: 'GiB', toBase: (v) => v.times(1073741824), fromBase: (v) => v.div(1073741824) },
  { name: '太比字节', nameEn: 'Tebibyte', symbol: 'TiB', toBase: (v) => v.times(1099511627776), fromBase: (v) => v.div(1099511627776) },
]

const angleUnits: UnitDef[] = [
  { name: '弧度', nameEn: 'Radian', symbol: 'rad', toBase: (v) => v, fromBase: (v) => v },
  { name: '度', nameEn: 'Degree', symbol: 'deg', toBase: (v) => v.times(Math.PI).div(180), fromBase: (v) => v.times(180).div(Math.PI) },
  { name: '梯度', nameEn: 'Gradian', symbol: 'grad', toBase: (v) => v.times(Math.PI).div(200), fromBase: (v) => v.times(200).div(Math.PI) },
  { name: '角分', nameEn: 'Arcminute', symbol: 'arcmin', toBase: (v) => v.times(Math.PI).div(10800), fromBase: (v) => v.times(10800).div(Math.PI) },
  { name: '角秒', nameEn: 'Arcsecond', symbol: 'arcsec', toBase: (v) => v.times(Math.PI).div(648000), fromBase: (v) => v.times(648000).div(Math.PI) },
]

const pressureUnits: UnitDef[] = [
  { name: '帕斯卡', nameEn: 'Pascal', symbol: 'Pa', toBase: (v) => v, fromBase: (v) => v },
  { name: '标准大气压', nameEn: 'Atmosphere', symbol: 'atm', toBase: (v) => v.times(101325), fromBase: (v) => v.div(101325) },
  { name: '毫米汞柱', nameEn: 'Millimeter of Mercury', symbol: 'mmHg', toBase: (v) => v.times(133.3223684211), fromBase: (v) => v.div(133.3223684211) },
  { name: '巴', nameEn: 'Bar', symbol: 'bar', toBase: (v) => v.times(100000), fromBase: (v) => v.div(100000) },
]

export const categories: UnitCategory[] = [
  { key: 'length', label: '长度', units: lengthUnits },
  { key: 'mass', label: '质量', units: massUnits },
  { key: 'time', label: '时间', units: timeUnits },
  { key: 'temperature', label: '温度', units: temperatureUnits },
  { key: 'area', label: '面积', units: areaUnits },
  { key: 'volume', label: '体积', units: volumeUnits },
  { key: 'speed', label: '速度', units: speedUnits },
  { key: 'data', label: '数据存储', units: dataUnits },
  { key: 'angle', label: '角度', units: angleUnits },
  { key: 'pressure', label: '压强', units: pressureUnits },
]

const categoryMap = new Map(categories.map((c) => [c.key, c]))

export function convertUnit(
  value: BigNumber,
  fromUnit: string,
  toUnit: string,
  category: string
): BigNumber {
  const cat = categoryMap.get(category)
  if (!cat) throw new Error(`Unknown category: ${category}`)

  const from = cat.units.find((u) => u.symbol === fromUnit)
  const to = cat.units.find((u) => u.symbol === toUnit)
  if (!from) throw new Error(`Unknown unit: ${fromUnit}`)
  if (!to) throw new Error(`Unknown unit: ${toUnit}`)

  const baseValue = from.toBase(value)
  return to.fromBase(baseValue)
}

export function getUnitsByCategory(category: string): UnitDef[] {
  const cat = categoryMap.get(category)
  if (!cat) throw new Error(`Unknown category: ${category}`)
  return cat.units
}
