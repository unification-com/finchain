function WRKChainRoot(_wrkchainRootContractAddress,
                       _mainchainWeb3ProviderUrl,
                       _wrkchainWeb3ProviderUrl,
                       _wrkchainRootAbi,
                       _wrkchainNetworkId,
                       _legacyWrkchainRoot) {

  this.web3jsMainchain = null;
  this.contractAddress = _wrkchainRootContractAddress;
  this.abi = _wrkchainRootAbi;
  wrkchainNetworkId = parseInt(_wrkchainNetworkId);
  if(!_legacyWrkchainRoot) {
      wrkchainNetworkId = numStringToBytes32(_wrkchainNetworkId)
  }
  this.wrkchainNetworkId = wrkchainNetworkId

  let self = this;

  this.web3jsMainchain = new Web3(new Web3.providers.HttpProvider(_mainchainWeb3ProviderUrl));
  this.web3jsWrkchain = new Web3(new Web3.providers.HttpProvider(_wrkchainWeb3ProviderUrl));

  this.wrkchainRootContract = new this.web3jsMainchain.eth.Contract(this.abi, this.contractAddress);
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
    self.wrkchainRootContract.getPastEvents('RecordHeader', {
      filter: {_chainId: this.wrkchainNetworkId, _height: _block_num},
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, events) => {
      if(error) {
         console.log("error", error);
      } else {
         let latestEvent = events[0]
         resolve(latestEvent);
      }
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

WRKChainRoot.prototype.getTxFromMainchain = async function(_tx) {
    let txData = this.web3jsMainchain.eth.getTransaction(_tx);
    return txData;
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
