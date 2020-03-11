function WRKChainRoot(_mainchainRest,
                      _wrkchainId,
                       _wrkchainWeb3ProviderUrl
) {

    this.mainchainRest = _mainchainRest;
    this.wrkchainId = _wrkchainId;
    this.web3jsWrkchain = new Web3(new Web3.providers.HttpProvider(_wrkchainWeb3ProviderUrl));
}

WRKChainRoot.prototype.validateBlock = function(_block_num, _callback) {

  let self = this;
  this.getWrkchainBlock(_block_num).then(wrkchain_block => {
    this.runBlockHeaderFromRoot(_block_num).then(wrkchain_root_data => {
      _callback(wrkchain_block, wrkchain_root_data);
      return;
    });
    return;
  });
}

WRKChainRoot.prototype.getWrkchainBlock = async function(_block_num) {
  let wrkchain_block = await this.web3jsWrkchain.eth.getBlock(_block_num);
  return wrkchain_block;
}

WRKChainRoot.prototype.runBlockHeaderFromRoot = async function (_block_num) {
  let wrkchain_root_data = await this.getBlockHeaderFromRoot(_block_num);
  return wrkchain_root_data;
}

WRKChainRoot.prototype.getBlockHeaderFromRoot = function (_block_num) {
  let self = this;
  return new Promise(resolve => {
      let url = self.mainchainRest + "/txs?page=1&limit=1&message.action=record_wrkchain_hash&record_wrkchain_block.wrkchain_block_height=" + _block_num + "&record_wrkchain_block.wrkchain_id=" + self.wrkchainId
      $.get( url, function( data ) {
          resolve(data.txs);
      });
  });
}

WRKChainRoot.prototype.getCurrentBlockNumber = async function () {
  let blockNumber = await this.web3js.eth.getBlockNumber();
  return blockNumber;
}

WRKChainRoot.prototype.getWrkchainRootTx = function(_tx, _callback) {
    let self = this;
    this.getTxFromMainchain(_tx).then(tx_data => {
        _callback(tx_data);
        return;
    });
}

WRKChainRoot.prototype.getWrkchainRootTxReceipt = function(_tx, _callback) {
    let self = this;
    this.getTxReceiptFromMainchain(_tx).then(receipt_data => {
        _callback(receipt_data);
        return;
    });
}

WRKChainRoot.prototype.getTxFromMainchain = async function(_tx) {
    let txData = this.web3jsMainchain.eth.getTransaction(_tx);
    return txData;
}

WRKChainRoot.prototype.getTxReceiptFromMainchain = async function(_tx) {
    let receiptData = this.web3jsMainchain.eth.getTransactionReceipt(_tx);
    return receiptData;
}

function numStringToBytes32(num) {
   var bn = new Web3.utils.BN(num).toTwos(256);
   return padToBytes32(bn.toString(16));
}

function bytes32ToNumString(bytes32str) {
    bytes32str = bytes32str.replace(/^0x/, '');
    var bn = new Web3.utils.BN(bytes32str, 16).fromTwos(256);
    return bn.toString();
}

function padToBytes32(n) {
    while (n.length < 64) {
        n = "0" + n;
    }
    return "0x" + n;
}
