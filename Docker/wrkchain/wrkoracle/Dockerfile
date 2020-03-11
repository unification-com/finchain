FROM golang:1.13

ARG SUBNET_IP

WORKDIR /root
RUN mkdir /root/src
RUN cd /root/src && git clone -b $(curl --silent "https://api.github.com/repos/unification-com/wrkoracle/releases/latest" | grep -Po '"tag_name": "\K.*?(?=")')  https://github.com/unification-com/wrkoracle.git

RUN cd /root/src/wrkoracle && make install

RUN cd /root/src && git clone -b $(curl --silent "https://api.github.com/repos/unification-com/mainchain/releases/latest" | grep -Po '"tag_name": "\K.*?(?=")')  https://github.com/unification-com/mainchain.git

RUN cd /root/src/mainchain && make install

RUN mkdir -p /root/.und_wrkoracle/config

COPY ./assets/run-wrkoracle.sh /root/src/run-wrkoracle.sh
RUN chmod +x /root/src/run-wrkoracle.sh
COPY ./assets/genesis.json /root/.und_wrkoracle/genesis.json
COPY ./assets/wrkoracle_devnet.key /root/.und_wrkoracle/wrkoracle_devnet.key
COPY ./assets/wrkoracle_config.toml /root/.und_wrkoracle/config/config.toml

RUN sed -i "s/172.25.0/${SUBNET_IP}/g" /root/.und_wrkoracle/config/config.toml

RUN yes password | undcli keys import wrk /root/.und_wrkoracle/wrkoracle_devnet.key --keyring-backend test
RUN yes password | wrkoracle keys import wrk /root/.und_wrkoracle/wrkoracle_devnet.key --keyring-backend test
