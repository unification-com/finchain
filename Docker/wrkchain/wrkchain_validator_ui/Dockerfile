FROM node:8

WORKDIR /root

RUN npm install -g truffle

ARG MAINCHAIN_EXPLORER_URL
ARG MAINCHAIN_REST_URL
ARG WRKCHAIN_EXPLORER_URL
ARG WRKCHAIN_NAME
ARG WRKCHAIN_NETWORK_ID
ARG WRKCHAIN_WRITE_TIMEOUT
ARG WRKCHAIN_WEB3_PROVIDER_URL
ARG WRKCHAIN_RPC_HOST
ARG WRKCHAIN_RPC_PORT
ARG WRKCHAIN_VALIDATOR_SERVICE_PORT
ARG ALPHAVANTAGE
ARG WORLDTRADING
ARG IEX
ARG THRESHOLD
ARG CRYPTO_THRESHOLD
ARG TRACKED_TICKERS
ARG TRACKED_CRYPTOS
ARG UPDATE_TIME
ARG CRYPTO_UPDATE_TIME
ARG CRYPTO_TIMEDIFF
ARG MNEMONIC
ARG WRKCHAIN_ID
ARG WRKCHAIN_OWNER

COPY ./assets/finchain-ui /root/finchain-ui
COPY ./assets/finchain-oracle-contract /root/finchain-oracle-contract
COPY ./assets/finchain-oracle-service /root/finchain-oracle-service

RUN cd /root/finchain-oracle-service && npm install && \
    cd /root/finchain-ui && npm install

COPY ./assets/run_finchain_services.sh /root/run_finchain_services.sh

RUN echo "MAINCHAIN_EXPLORER_URL=${MAINCHAIN_EXPLORER_URL}" >> /root/finchain-oracle-contract/.env && \
    echo "MAINCHAIN_REST_URL=${MAINCHAIN_REST_URL}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_EXPLORER_URL=${WRKCHAIN_EXPLORER_URL}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_NAME=${WRKCHAIN_NAME}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_NETWORK_ID=${WRKCHAIN_NETWORK_ID}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_ID=${WRKCHAIN_ID}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_WRITE_TIMEOUT=${WRKCHAIN_WRITE_TIMEOUT}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_WEB3_PROVIDER_URL=${WRKCHAIN_WEB3_PROVIDER_URL}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_RPC_HOST=${WRKCHAIN_RPC_HOST}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_RPC_PORT=${WRKCHAIN_RPC_PORT}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_VALIDATOR_SERVICE_PORT=${WRKCHAIN_VALIDATOR_SERVICE_PORT}" >> /root/finchain-oracle-contract/.env && \
    echo "ALPHAVANTAGE=${ALPHAVANTAGE}" >> /root/finchain-oracle-contract/.env && \
    echo "WORLDTRADING=${WORLDTRADING}" >> /root/finchain-oracle-contract/.env && \
    echo "IEX=${IEX}" >> /root/finchain-oracle-contract/.env && \
    echo "THRESHOLD=${THRESHOLD}" >> /root/finchain-oracle-contract/.env && \
    echo "CRYPTO_THRESHOLD=${CRYPTO_THRESHOLD}" >> /root/finchain-oracle-contract/.env && \
    echo "TRACKED_TICKERS=${TRACKED_TICKERS}" >> /root/finchain-oracle-contract/.env && \
    echo "TRACKED_CRYPTOS=${TRACKED_CRYPTOS}" >> /root/finchain-oracle-contract/.env && \
    echo "UPDATE_TIME=${UPDATE_TIME}" >> /root/finchain-oracle-contract/.env && \
    echo "CRYPTO_UPDATE_TIME=${CRYPTO_UPDATE_TIME}" >> /root/finchain-oracle-contract/.env && \
    echo "CRYPTO_TIMEDIFF=${CRYPTO_TIMEDIFF}" >> /root/finchain-oracle-contract/.env && \
    echo "MNEMONIC=${MNEMONIC}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_OWNER=${WRKCHAIN_OWNER}" >> /root/finchain-oracle-contract/.env && \
    chmod +x /root/run_finchain_services.sh && \
    echo "alias ll='ls -la'" >> /root/.bashrc

RUN cat /root/finchain-oracle-contract/.env

RUN cd /root/finchain-oracle-contract && rm -rf /root/finchain-oracle-contract/build && npm install && truffle compile

CMD cd /root && ./run_finchain_services.sh
