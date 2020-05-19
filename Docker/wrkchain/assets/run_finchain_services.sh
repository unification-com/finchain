#!/bin/bash

cd /root/finchain-oracle-contract
sleep 15
truffle migrate 2>&1 | tee sc_log.txt

WRKCHAIN_NETWORK_ID_ENV=$(grep 'WRKCHAIN_NETWORK_ID' /root/finchain-oracle-contract/.env)
WRKCHAIN_NETWORK_ID=${WRKCHAIN_NETWORK_ID_ENV##*=}
CONTRACT_ADDRESS=$(node /root/finchain-oracle-contract/abi.js addr ${WRKCHAIN_NETWORK_ID})
FINCHAIN_ORACLE_ABI=$(node /root/finchain-oracle-contract/abi.js)

echo "CONTRACT_ADDRESS=${CONTRACT_ADDRESS}" >> /root/finchain-oracle-contract/.env
echo "FINCHAIN_ORACLE_ABI=${FINCHAIN_ORACLE_ABI}" >> /root/finchain-oracle-contract/.env

cp /root/finchain-oracle-contract/.env /root/finchain-ui/.env
cp /root/finchain-oracle-contract/.env /root/finchain-oracle-service/.env
cp /root/finchain-oracle-contract/.env /root/finchain-ui/.env

cd /root/finchain-oracle-service && npm run develop 2>&1 | tee finchain_oracle_log.txt & \
cd /root/finchain-ui && node server.js
