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

FinchainDiscrepencyWatcher.prototype.getLatestDiscrepencies = function(_ticker, _timespan, _callback) {

  let self = this;
  let timespan = _timespan * 3600.0
  let numBlocks = parseInt(timespan / 15.0); // looking up all tickers. Just get last 24 hours
  let tickerHash = Web3.utils.soliditySha3(_ticker);
  let noToReturn = _timespan * 3;

  this.getCurrentBlockNumber().then(blockNumber => {

    let fromBlock = blockNumber - numBlocks;
    if(fromBlock < 0) {
      fromBlock = 0;
    }

    self.finchainContract.getPastEvents('discrepancy', {
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
         let latestEvent = events.slice(Math.max(events.length - noToReturn, 1));
         latestEvent = latestEvent.reverse();
         self.lastEvent = latestEvent;
        _callback(true, latestEvent);
      }
    });
    return;
  });
}

FinchainDiscrepencyWatcher.prototype.getLatestStocks = function(_ticker, _timespan, _callback) {

  let self = this;
  let timespan = _timespan * 3600.0
  let numBlocks = parseInt(timespan / 15.0); // looking up all tickers. Just get last 24 hours
  let tickerHash = Web3.utils.soliditySha3(_ticker);

  let noToReturn = _timespan * 3;
  console.log(numBlocks);
  console.log(noToReturn);

  this.getCurrentBlockNumber().then(blockNumber => {

    let fromBlock = blockNumber - numBlocks;
    if(fromBlock < 0) {
      fromBlock = 0;
    }

    self.finchainContract.getPastEvents('stockData', {
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
        let latestEvent = events.slice(Math.max(events.length - noToReturn, 1));
        latestEvent = latestEvent.reverse();
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
