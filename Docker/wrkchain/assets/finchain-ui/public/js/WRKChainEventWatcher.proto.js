function WRKChainEventWatcher(_mainchainRest,
                              _wrkchainId,
                              _wrkchainOwner) {

    this.mainchainRest = _mainchainRest;
    this.lastEvent = null;
    this.wrkchainId = _wrkchainId;
    this.wrkchainOwner = _wrkchainOwner;
}

WRKChainEventWatcher.prototype.getLatestRecordedHeader = function(_callback) {

  let self = this;
  let noToReturn = 20;
  let url = this.mainchainRest + "/txs?message.sender=" + this.wrkchainOwner + "&page=1&limit="+noToReturn+"&message.action=record_wrkchain_hash&record_wrkchain_block.wrkchain_id=" + this.wrkchainId

    $.get( url, function( data ) {
        let actual_page = data.page_total
        let url = self.mainchainRest + "/txs?message.sender=" + self.wrkchainOwner + "&page=" + actual_page + "&limit="+noToReturn+"&message.action=record_wrkchain_hash&record_wrkchain_block.wrkchain_id=" + self.wrkchainId
        $.get( url, function( data ) {
            let txs = data.txs.reverse()
            self.lastEvent = txs;
            _callback(true, txs);
        });
    });
}
