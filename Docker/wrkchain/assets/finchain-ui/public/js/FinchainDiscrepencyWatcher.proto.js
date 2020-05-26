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

FinchainDiscrepencyWatcher.prototype.getLatestEvents = function(_ticker, _timespan, _event, _callback) {
  let self = this;
  let timespan = _timespan * 3600.0
  let numBlocks = parseInt(timespan / 15.0); // looking up all tickers.
  let tickerHash = Web3.utils.soliditySha3(_ticker);

  this.getCurrentBlockNumber().then(blockNumber => {

    let fromBlock = blockNumber - numBlocks;
    if(fromBlock < 0) {
      fromBlock = 0;
    }

    self.finchainContract.getPastEvents(_event, {
      filter: {_tickerHash: tickerHash},
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
         let latestEvent = events.reverse();
         self.lastEvent = latestEvent;
        _callback(true, latestEvent);
      }
    });
    return;
  });
}

FinchainDiscrepencyWatcher.prototype.getThreshold = function(_callback) {
    this.getCurrentThreshold().then(threshold => {
        _callback(threshold);
    });
}

FinchainDiscrepencyWatcher.prototype.getCurrentBlockNumber = async function () {
  let blockNumber = await this.web3js.eth.getBlockNumber();
  return blockNumber;
}

FinchainDiscrepencyWatcher.prototype.getCurrentThreshold = async function() {
    let threshold = await this.finchainContract.methods.threshold().call();
    return threshold;
}

FinchainDiscrepencyWatcher.prototype.getAllOracles = async function() {
    let oracles = await this.finchainContract.methods.getAllOracles().call();
    return oracles;
}

FinchainDiscrepencyWatcher.prototype.getSource = async function(oracle) {
    let source = await this.finchainContract.methods.getSource(oracle).call();
    return source;
}
