FROM geoffreybooth/meteor-base:1.9

RUN apt-get update && \
    apt-get install git make

# Build args
ARG RPC
ARG LCD

WORKDIR /src

RUN git clone https://github.com/unification-com/mainchain-explorer --depth 1 && \
    cd /src/mainchain-explorer

WORKDIR /src/mainchain-explorer

RUN meteor npm install
RUN meteor update

RUN sed -i "s/localhost:1318/${LCD}/g" /src/mainchain-explorer/devnet_settings.json && \
    sed -i "s/localhost:1317/${LCD}/g" /src/mainchain-explorer/devnet_settings.json && \
    sed -i "s/localhost:26661/${RPC}/g" /src/mainchain-explorer/devnet_settings.json && \
    cat /src/mainchain-explorer/devnet_settings.json
