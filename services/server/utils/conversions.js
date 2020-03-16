const convertVal = (source, dest) => v => {
  if (v === source) {
    return dest
  }
  return v
}

const falseToNull = convertVal(false, null)
const nullToFalse = convertVal(null, false)

module.exports = {
  falseToNull,
  nullToFalse,
  convertVal
}
