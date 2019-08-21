function FinchainDiscrepencyWatcher(_contractAddress,
                              _web3ProviderUrl,
                              _abi) {

  this.web3js = null;
  this.contractAddress = _contractAddress;
  this.abi = _abi;
  this.lastEvent = null;

  let self = this;

  this.web3js = new Web3(new Web3.providers.HttpProvider(_web3ProviderUrl));

  this.finchainContract = new this.web3js.eth.Contract(this.abi,
                                                       this.contractAddress);
}

FinchainDiscrepencyWatcher.prototype.getLatestDiscrepencies = function(_callback) {

  let self = this;

  this.getCurrentBlockNumber().then(blockNumber => {

    let fromBlock = blockNumber -10;
    if(fromBlock < 0) {
      fromBlock = 0;
    }

    self.finchainContract.getPastEvents('discrepancy', {
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
        let latestEvent = events[events.length - 1]
        self.lastEvent = latestEvent;
        _callback(true, latestEvent);
      }
    });
    return;
  });
}

FinchainDiscrepencyWatcher.prototype.getCurrentBlockNumber = async function () {
  let blockNumber = await this.web3js.eth.getBlockNumber();
  return blockNumber;
}
