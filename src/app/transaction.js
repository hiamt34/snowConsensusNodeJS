class Transaction {
  constructor(txId) {
    this.txId = txId;
    this.broadcastCount = 0;
  }
}
module.exports = Transaction;
