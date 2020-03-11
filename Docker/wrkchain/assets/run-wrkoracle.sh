#!/bin/bash

MAINCHAIN_NODE=$1

SHA_GENESIS=$(openssl dgst -sha256 -hex /root/.und_wrkoracle/genesis.json | cut -c 44-108)
sleep 20

undcli tx wrkchain register --moniker="finchain" --genesis="$SHA_GENESIS" --name="Finchain" --base="geth" --from wrk --keyring-backend test --gas=auto --gas-adjustment=1.5 --node tcp://$MAINCHAIN_NODE --chain-id UND-Mainchain-DevNet --yes --broadcast-mode block 2>&1 | tee /root/wrkoracle_log.txt

sleep 60

wrkoracle run 2>&1 | tee /root/wrkoracle_log.txt
