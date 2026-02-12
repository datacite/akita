const ROR_ID_PATTERN = /^0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$/

export function isValidRORId(rorid: string): boolean {
  return ROR_ID_PATTERN.test(rorid)
}
