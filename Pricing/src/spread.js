/**
 * Accumulates spread for different companies across all transactions in given period of time
 * @param {Array} arr Array of objects. Each object is a transaction published by transactions service, having following keys
 *  - comapny name
 *  - price
 *  - volume
 *  - spread if any
 *
 * @returns {Object} object containing spread for each company as key-value pairs
 */
function accumulateSpread(arr) {
  let spread = {};
  arr.forEach(transaction => {
    if (!(transaction.company in spread)) {
      spread.company = 0;
    }
    spread.company += transaction.spread;
  });
  return spread;
}

module.exports = {
  accumulateSpread: accumulateSpread
};
