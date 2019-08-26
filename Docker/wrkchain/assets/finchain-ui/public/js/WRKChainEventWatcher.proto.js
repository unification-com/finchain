function WRKChainEventWatcher(_contractAddress,
                              _web3ProviderUrl,
                              _abi,
                              _wrkchainNetworkId,
                              _legacyWrkchainRoot) {

  this.web3js = null;
  this.contractAddress = _contractAddress;
  this.abi = _abi;
  this.lastEvent = null;
  wrkchainNetworkId = parseInt(_wrkchainNetworkId);
  if(!_legacyWrkchainRoot) {
      wrkchainNetworkId = numStringToBytes32(_wrkchainNetworkId)
  }
  this.wrkchainNetworkId = wrkchainNetworkId

  console.log(wrkchainNetworkId);

  let self = this;

  this.web3js = new Web3(new Web3.providers.HttpProvider(_web3ProviderUrl));

  this.wrkchainRootContract = new this.web3js.eth.Contract(this.abi,
                                                           this.contractAddress
                                                           );
}

WRKChainEventWatcher.prototype.getLatestRecordedHeader = function(_callback) {

  let self = this;

  this.getCurrentBlockNumber().then(blockNumber => {

    let fromBlock = blockNumber - 100;
    if(fromBlock < 0) {
      fromBlock = 0;
    }

    let noToReturn = 20;

    self.wrkchainRootContract.getPastEvents('RecordHeader', {
      filter: {_chainId: this.wrkchainNetworkId},
      fromBlock: fromBlock,
      toBlock: 'latest'
    }, (error, events) => {
      if(error) {
        console.log("error", error);
        if(self.lastEvent != null) {
           _callback(true, self.lastEvent);
        } else {
           _callback(false, error);
        }
      } else {
        let latestEvent = events.slice(Math.max(events.length - noToReturn, 1));
        latestEvent = latestEvent.reverse();
        self.lastEvent = latestEvent;
        _callback(true, latestEvent);
      }
    });
    return;
  });
}

WRKChainEventWatcher.prototype.getCurrentBlockNumber = async function () {
  let blockNumber = await this.web3js.eth.getBlockNumber();
  return blockNumber;
}

WRKChainEventWatcher.prototype.getChainId = async function () {
  let blockNumber = await this.web3js.eth.getBlockNumber();
  return blockNumber;
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
