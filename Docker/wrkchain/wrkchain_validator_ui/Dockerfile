FROM node:8

WORKDIR /root

RUN npm install -g truffle

ARG MAINCHAIN_EXPLORER_URL
ARG MAINCHAIN_WEB3_PROVIDER_URL
ARG WRKCHAIN_NETWORK_ID
ARG WRKCHAIN_ROOT_WRITE_TIMEOUT
ARG WRKCHAIN_WEB3_PROVIDER_URL
ARG WRKCHAIN_RPC_HOST
ARG WRKCHAIN_RPC_PORT
ARG WRKCHAIN_VALIDATOR_SERVICE_PORT
ARG ALPHAVANTAGE
ARG WORLDTRADING
ARG IEX
ARG THRESHOLD
ARG TRACKED_TICKERS
ARG UPDATE_TIME
ARG WRKCHAIN_PKEY_1
ARG WRKCHAIN_PKEY_2
ARG WRKCHAIN_PKEY_3
ARG WRKCHAIN_PKEY_4

COPY ./assets/finchain-ui /root/finchain-ui
COPY ./assets/finchain-oracle-contract /root/finchain-oracle-contract
COPY ./assets/finchain-oracle-service /root/finchain-oracle-service

RUN cd /root/finchain-oracle-service && npm install && \
    cd /root/finchain-ui && npm install

COPY ./assets/run_finchain_services.sh /root/run_finchain_services.sh

RUN echo "MAINCHAIN_EXPLORER_URL=${MAINCHAIN_EXPLORER_URL}" >> /root/finchain-oracle-contract/.env && \
    echo "MAINCHAIN_WEB3_PROVIDER_URL=${MAINCHAIN_WEB3_PROVIDER_URL}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_NETWORK_ID=${WRKCHAIN_NETWORK_ID}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_ROOT_WRITE_TIMEOUT=${WRKCHAIN_ROOT_WRITE_TIMEOUT}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_WEB3_PROVIDER_URL=${WRKCHAIN_WEB3_PROVIDER_URL}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_RPC_HOST=${WRKCHAIN_RPC_HOST}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_RPC_PORT=${WRKCHAIN_RPC_PORT}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_VALIDATOR_SERVICE_PORT=${WRKCHAIN_VALIDATOR_SERVICE_PORT}" >> /root/finchain-oracle-contract/.env && \
    echo "ALPHAVANTAGE=${ALPHAVANTAGE}" >> /root/finchain-oracle-contract/.env && \
    echo "WORLDTRADING=${WORLDTRADING}" >> /root/finchain-oracle-contract/.env && \
    echo "IEX=${IEX}" >> /root/finchain-oracle-contract/.env && \
    echo "THRESHOLD=${THRESHOLD}" >> /root/finchain-oracle-contract/.env && \
    echo "TRACKED_TICKERS=${TRACKED_TICKERS}" >> /root/finchain-oracle-contract/.env && \
    echo "UPDATE_TIME=${UPDATE_TIME}" >> /root/finchain-oracle-contract/.env && \
    echo "LEGACY_WRKCHAIN_ROOT=${LEGACY_WRKCHAIN_ROOT}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_PKEY_1=${WRKCHAIN_PKEY_1}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_PKEY_2=${WRKCHAIN_PKEY_2}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_PKEY_3=${WRKCHAIN_PKEY_3}" >> /root/finchain-oracle-contract/.env && \
    echo "WRKCHAIN_PKEY_4=${WRKCHAIN_PKEY_4}" >> /root/finchain-oracle-contract/.env && \
    chmod +x /root/run_finchain_services.sh && \
    echo "alias ll='ls -la'" >> /root/.bashrc

RUN cd /root/finchain-oracle-contract && rm -rf build && npm install && truffle compile

CMD cd /root && ./run_finchain_services.sh
