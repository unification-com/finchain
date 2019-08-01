function FinchainEventContract(_contractAddress, _web3ProviderUrl, _abi) {

    let abi = _abi.replace(/\\(.)/mg, "$1");

    this.web3js = null;
    this.contractAddress = _contractAddress;
    this.abi = JSON.parse(abi);

    let self = this;

    this.web3js = new Web3(new Web3.providers.HttpProvider(_web3ProviderUrl));

    this.FinchainContract = new this.web3js.eth.Contract(this.abi, this.contractAddress);

}

FinchainContract.prototype.emitEvent = function(_callback) {

    let self = this;
    var event = FinchainContract.discrepency();

    event.watch(function(error, result){
        if (!error)
            {
                _callback(result);
            } else {
                console.log(error);
            }
    });
}